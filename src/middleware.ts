import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { GATE_COOKIE, isGateEnabled, isGateTokenValid } from "@/lib/gate-auth";

// Paths that stay reachable without the gate cookie — otherwise the user
// could never log in or fetch static assets for the gate page itself.
const GATE_BYPASS = [
  "/gate",
  "/api/gate",
  "/favicon.ico",
  "/manifest.json",
  "/sw.js",
  "/icons",
  "/_next",
  "/offline",
];

function isGateBypassed(pathname: string): boolean {
  return GATE_BYPASS.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

// --- Rate limiting ---

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

// In-memory rate limiting — works for single-instance deployments.
// TODO(scalability): replace with Redis (e.g. @upstash/ratelimit) when
// running multiple Next.js instances behind a load balancer.
const rateLimitStore = new Map<string, RateLimitEntry>();
const WINDOW_MS = 60_000;
const GENERAL_LIMIT = 60;
const ACTIVATE_LIMIT = 5;
const MAX_API_BODY_BYTES = 10_240; // 10 KB
const CLEANUP_INTERVAL_MS = 120_000;

const BLOCKED_UA_PATTERN = /sqlmap|nikto|masscan|zgrab|nmap|curl\/7|python-requests/i;

// Periodic cleanup of expired entries to prevent memory leaks
let lastCleanup = Date.now();

function cleanupExpiredEntries(): void {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;

  rateLimitStore.forEach((entry, key) => {
    if (now >= entry.resetAt) {
      rateLimitStore.delete(key);
    }
  });
}

function buildRateLimitKey(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const identifier = forwarded?.split(",")[0]?.trim() ?? "unknown";
  return `${identifier}:${request.nextUrl.pathname}`;
}

function isRateLimited(key: string, limit: number): boolean {
  cleanupExpiredEntries();

  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || now >= entry.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  entry.count++;
  return entry.count > limit;
}

// --- Middleware ---

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const requestId = crypto.randomUUID();

  // Site-wide password gate. If enabled (both env vars set), every request
  // must carry a valid site_access cookie — otherwise redirect to /gate.
  if (isGateEnabled() && !isGateBypassed(pathname)) {
    const cookie = request.cookies.get(GATE_COOKIE)?.value;
    const ok = await isGateTokenValid(cookie);
    if (!ok) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 401, headers: { "x-request-id": requestId } }
        );
      }
      // Build redirect URL from the forwarded host so proxies don't leak the
      // internal bind address (localhost:3000) into the Location header.
      const forwardedHost = request.headers.get("x-forwarded-host");
      const forwardedProto = request.headers.get("x-forwarded-proto");
      const hostHeader = request.headers.get("host");
      const redirect = request.nextUrl.clone();
      if (forwardedHost || hostHeader) {
        const hp = (forwardedHost ?? hostHeader)!.split(":");
        redirect.hostname = hp[0];
        redirect.port = hp[1] ?? "";
        redirect.protocol = (forwardedProto ?? "https") + ":";
      }
      redirect.pathname = "/gate";
      redirect.searchParams.set("next", pathname + request.nextUrl.search);
      return NextResponse.redirect(redirect);
    }
  }

  // Block malicious user-agents
  const userAgent = request.headers.get("user-agent") ?? "";
  if (BLOCKED_UA_PATTERN.test(userAgent)) {
    return NextResponse.json(
      { error: "Forbidden" },
      { status: 403, headers: { "x-request-id": requestId } }
    );
  }

  // Block oversized bodies on API routes
  if (pathname.startsWith("/api/")) {
    const contentLength = request.headers.get("content-length");
    if (contentLength && parseInt(contentLength, 10) > MAX_API_BODY_BYTES) {
      return NextResponse.json(
        { error: "Request body too large" },
        { status: 413, headers: { "x-request-id": requestId } }
      );
    }
  }

  // Rate limiting
  const rateLimitKey = buildRateLimitKey(request);

  if (pathname === "/api/keys/activate") {
    if (isRateLimited(rateLimitKey, ACTIVATE_LIMIT)) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429, headers: { "x-request-id": requestId } }
      );
    }
  } else if (isRateLimited(rateLimitKey, GENERAL_LIMIT)) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: { "x-request-id": requestId } }
    );
  }

  // Protected API routes require auth cookie
  const protectedRoutes = ["/api/subscription/status", "/api/keys/activate"];

  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    const accessToken = request.cookies.get("access_token")?.value;
    if (!accessToken) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401, headers: { "x-request-id": requestId } }
      );
    }
  }

  const response = NextResponse.next();
  response.headers.set("x-request-id", requestId);

  // Propagate locale cookie so server components always see the latest value.
  const localeCookie = request.cookies.get("locale")?.value;
  const validLocales = ["ru", "en", "tr", "kk", "ky"];
  if (localeCookie && validLocales.includes(localeCookie)) {
    response.cookies.set("locale", localeCookie, {
      path: "/",
      maxAge: 31536000,
      sameSite: "lax",
      httpOnly: false,
    });
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icons|manifest.json|sw.js).*)",
  ],
};
