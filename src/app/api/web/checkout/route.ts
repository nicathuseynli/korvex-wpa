import { NextResponse } from "next/server";
import { checkoutSchema } from "@/lib/validation";
import { getPlanById } from "@/lib/plans";
import { createSubscription, BackendError } from "@/lib/korvex-backend";
import { emailToTelegramId, generateAccessToken } from "@/lib/web-id";
import { upsertOrder, rateLimit } from "@/lib/web-store";
import { sendSubscriptionEmail } from "@/lib/email";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function clientKey(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  return fwd ? fwd.split(",")[0].trim() : "unknown";
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const parsed = checkoutSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }
    const { email, planId } = parsed.data;

    const plan = getPlanById(planId);
    if (!plan) {
      return NextResponse.json({ error: "Unknown plan" }, { status: 400 });
    }

    // Rate-limit checkout per IP and per email (defense against spam-mail abuse)
    if (!(await rateLimit({ bucket: "checkout_ip", key: clientKey(req), maxCalls: 10, windowSeconds: 3600 }))) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }
    if (!(await rateLimit({ bucket: "checkout_email", key: email, maxCalls: 5, windowSeconds: 3600 }))) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    // TEST_MODE skips payment entirely — provision + email immediately.
    // When real payments are wired, this is where you'd redirect to
    // Stripe/Robokassa and defer provisioning to the webhook handler.
    const testMode = (process.env.TEST_MODE ?? "true").toLowerCase() === "true";
    if (!testMode) {
      return NextResponse.json(
        { error: "Payments not configured yet" },
        { status: 501 }
      );
    }

    const telegramId = emailToTelegramId(email);

    const sub = await createSubscription({
      telegramId,
      durationDays: plan.durationDays,
      limitIp: plan.limitIp,
    });

    const accessToken = generateAccessToken();

    await upsertOrder({
      email,
      telegramId,
      planId: plan.id,
      subscriptionId: sub.subscriptionId,
      subscriptionUrl: sub.subscriptionUrl,
      accessToken,
      expiresAt: sub.expiresAt,
    });

    const origin = req.headers.get("origin") || `https://${req.headers.get("host")}`;
    const manageUrl = `${origin}/my?token=${encodeURIComponent(accessToken)}`;

    try {
      await sendSubscriptionEmail({
        to: email,
        planName: plan.name,
        subscriptionUrl: sub.subscriptionUrl,
        expiresAt: sub.expiresAt,
        manageUrl,
        supportUsername: process.env.SUPPORT_USERNAME || "HelpKorvexVPN",
      });
    } catch (err) {
      // Provisioning succeeded; email failed. Return manage URL so the
      // user still gets their link, and log for ops.
      console.error("Email delivery failed:", err);
      return NextResponse.json(
        {
          ok: true,
          emailed: false,
          manageUrl,
          warning: "Subscription active, but we could not send the email.",
        },
        { status: 200 }
      );
    }

    return NextResponse.json({ ok: true, emailed: true });
  } catch (err) {
    if (err instanceof BackendError) {
      console.error("Backend error:", err.status, err.message);
      return NextResponse.json(
        { error: "Could not provision subscription. Please try again." },
        { status: 502 }
      );
    }
    console.error("Checkout error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
