import { NextResponse } from "next/server";
import { apiFetch, ApiError } from "@/lib/api";
import { z } from "zod";

// Schema for sanitising each server — strip host IPs and other sensitive fields
const serverSchema = z.object({
  id: z.union([z.string(), z.number()]),
  name: z.string(),
  country: z.string(),
  protocol: z.string(),
  isActive: z.boolean(),
  priority: z.number(),
});

const serverListSchema = z.array(serverSchema);

export async function GET() {
  try {
    const raw = await apiFetch<unknown[]>("/api/v1/servers", {
      method: "GET",
    });

    // Sanitize — only return safe fields, discard host IPs etc.
    const parsed = serverListSchema.safeParse(raw);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid server data" },
        { status: 502 }
      );
    }

    return NextResponse.json(parsed.data, {
      headers: {
        "Cache-Control": "public, max-age=60",
      },
    });
  } catch (error) {
    const status = error instanceof ApiError ? error.status : 500;
    return NextResponse.json(
      { error: "Failed to fetch server list" },
      { status: Math.min(status, 500) }
    );
  }
}
