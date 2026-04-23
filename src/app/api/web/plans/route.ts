import { NextResponse } from "next/server";
import { getPlans, formatPrice } from "@/lib/plans";

export const dynamic = "force-dynamic";

export async function GET() {
  const plans = getPlans().map((p) => ({
    id: p.id,
    name: p.name,
    durationDays: p.durationDays,
    limitIp: p.limitIp,
    price: formatPrice(p),
    priceMinor: p.priceMinor,
    currency: p.currency,
    family: p.family ?? false,
    highlighted: p.highlighted ?? false,
  }));
  return NextResponse.json({ plans }, { headers: { "Cache-Control": "no-store" } });
}
