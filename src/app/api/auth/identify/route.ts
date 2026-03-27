import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { apiFetch, ApiError } from "@/lib/api";

interface IdentifyResponse {
  accessToken: string;
  refreshToken: string;
}

export async function POST(request: Request) {
  try {
    // Extract forwarded IP (first hop only) for upstream X-Forwarded-For
    const forwarded = request.headers.get("x-forwarded-for");
    const clientIp = forwarded?.split(",")[0]?.trim() ?? "";

    const upstreamHeaders: Record<string, string> = {};
    if (clientIp) {
      upstreamHeaders["X-Forwarded-For"] = clientIp;
    }

    const data = await apiFetch<IdentifyResponse>(
      "/api/v1/auth/identify",
      {
        method: "POST",
        headers: upstreamHeaders,
        body: JSON.stringify({}),
      }
    );

    // Set JWT in httpOnly cookies — never expose in response body
    const cookieStore = cookies();

    cookieStore.set("access_token", data.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 3600, // 1 hour
      path: "/",
    });

    cookieStore.set("refresh_token", data.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 30 * 24 * 3600, // 30 days
      path: "/",
    });

    return NextResponse.json(
      { status: "ok" },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    const status = error instanceof ApiError ? error.status : 500;
    return NextResponse.json(
      { error: "Authentication failed" },
      {
        status: Math.min(status, 500),
        headers: { "Cache-Control": "no-store" },
      }
    );
  }
}
