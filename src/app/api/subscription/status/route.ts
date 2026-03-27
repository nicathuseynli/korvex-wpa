import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { apiFetch, ApiError } from "@/lib/api";
import { z } from "zod";

// Schema for sanitising upstream response
const subscriptionSchema = z.object({
  plan: z.string(),
  status: z.string(),
  expiresAt: z.string(),
});

export async function GET() {
  try {
    const cookieStore = cookies();
    const jwt = cookieStore.get("access_token")?.value;

    if (!jwt) {
      return NextResponse.json(
        { error: "Unauthorized" },
        {
          status: 401,
          headers: { "Cache-Control": "no-store" },
        }
      );
    }

    const raw = await apiFetch<Record<string, unknown>>(
      "/api/v1/subscription/status",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );

    // Sanitize — only return expected fields, strip everything else
    const parsed = subscriptionSchema.safeParse(raw);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid subscription data" },
        {
          status: 502,
          headers: { "Cache-Control": "no-store" },
        }
      );
    }

    return NextResponse.json(parsed.data, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    const status = error instanceof ApiError ? error.status : 500;
    return NextResponse.json(
      { error: "Failed to fetch subscription status" },
      {
        status: Math.min(status, 500),
        headers: { "Cache-Control": "no-store" },
      }
    );
  }
}
