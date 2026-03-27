import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

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

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const requestId = crypto.randomUUID();

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
