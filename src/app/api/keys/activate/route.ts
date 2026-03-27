import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { activationKeySchema } from "@/lib/validation";
import { apiFetch, ApiError } from "@/lib/api";
import { z } from "zod";

// Sanitize upstream response — only return expected fields
const activateResponseSchema = z.object({
  status: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { key?: string };

    const parsed = activationKeySchema.safeParse(body.key);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Неверный формат ключа" },
        { status: 400 }
      );
    }

    const cookieStore = cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    if (!accessToken) {
      return NextResponse.json(
        { error: "Необходима авторизация" },
        { status: 401 }
      );
    }

    const raw = await apiFetch<Record<string, unknown>>(
      "/api/v1/keys/activate",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ key: parsed.data }),
      }
    );

    // Sanitize — strip unexpected fields from upstream response
    const result = activateResponseSchema.safeParse(raw);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid activation response" },
        { status: 502 }
      );
    }

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 429) {
        return NextResponse.json(
          { error: "Слишком много попыток. Попробуйте позже." },
          { status: 429 }
        );
      }
      // Generic error — never proxy raw upstream messages
      return NextResponse.json(
        { error: "Не удалось активировать ключ" },
        { status: Math.min(error.status, 500) }
      );
    }
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}
