import { NextResponse } from "next/server";
import { resendSchema } from "@/lib/validation";
import { getLatestOrderByEmail, rateLimit } from "@/lib/web-store";
import { sendSubscriptionEmail } from "@/lib/email";
import { getPlanById } from "@/lib/plans";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const parsed = resendSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }
    const { email } = parsed.data;

    if (!(await rateLimit({ bucket: "resend_email", key: email, maxCalls: 3, windowSeconds: 3600 }))) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const order = await getLatestOrderByEmail(email);

    // Always return ok to avoid leaking which emails have orders.
    if (!order) {
      return NextResponse.json({ ok: true });
    }

    const plan = getPlanById(order.plan_id);
    const origin = req.headers.get("origin") || `https://${req.headers.get("host")}`;
    const manageUrl = `${origin}/my?token=${encodeURIComponent(order.access_token)}`;

    try {
      await sendSubscriptionEmail({
        to: email,
        planName: plan?.name ?? order.plan_id,
        subscriptionUrl: order.subscription_url,
        expiresAt: order.expires_at,
        manageUrl,
        supportUsername: process.env.SUPPORT_USERNAME || "HelpKorvexVPN",
      });
    } catch (err) {
      console.error("Resend email failed:", err);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Resend error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
