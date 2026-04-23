import { NextResponse } from "next/server";
import { getOrderByToken } from "@/lib/web-store";
import { getPlanById } from "@/lib/plans";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token");
  if (!token || token.length < 16) {
    return NextResponse.json({ error: "Invalid token" }, { status: 400 });
  }

  const order = await getOrderByToken(token);
  if (!order) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const plan = getPlanById(order.plan_id);

  return NextResponse.json(
    {
      email: order.email,
      planName: plan?.name ?? order.plan_id,
      subscriptionUrl: order.subscription_url,
      expiresAt: order.expires_at,
      status: order.status,
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
