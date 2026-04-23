/**
 * Subscription plans.
 *
 * Prices are env-driven to stay in sync with the Telegram bot's
 * PRICE_* settings (which live in /opt/korvex-bot/.env).
 * When you change bot prices, update env on the web too.
 *
 * Duration / limitIp mirror the bot's PLAN_DURATIONS & PLAN_CONNECTIONS
 * in bot/services/subscription.py so both channels sell the same product.
 */

export interface Plan {
  id: string;
  name: string;
  durationDays: number;
  limitIp: number;
  priceMinor: number;   // e.g. kopeks (RUB * 100) or cents
  currency: string;     // ISO 4217
  family?: boolean;
  highlighted?: boolean;
}

function envInt(key: string, fallback: number): number {
  const v = process.env[key];
  const n = v ? parseInt(v, 10) : NaN;
  return Number.isFinite(n) ? n : fallback;
}

function envStr(key: string, fallback: string): string {
  return process.env[key] ?? fallback;
}

export function getPlans(): Plan[] {
  const currency = envStr("PLAN_CURRENCY", "RUB");
  return [
    {
      id: "month_1",
      name: "1 Month",
      durationDays: 30,
      limitIp: 5,
      priceMinor: envInt("PLAN_PRICE_1_MONTH", 19900),
      currency,
    },
    {
      id: "months_3",
      name: "3 Months",
      durationDays: 90,
      limitIp: 5,
      priceMinor: envInt("PLAN_PRICE_3_MONTHS", 49900),
      currency,
      highlighted: true,
    },
    {
      id: "months_6",
      name: "6 Months",
      durationDays: 180,
      limitIp: 5,
      priceMinor: envInt("PLAN_PRICE_6_MONTHS", 89900),
      currency,
    },
    {
      id: "months_12",
      name: "12 Months",
      durationDays: 365,
      limitIp: 5,
      priceMinor: envInt("PLAN_PRICE_12_MONTHS", 149900),
      currency,
    },
    {
      id: "family_1",
      name: "Family — 1 Month",
      durationDays: 30,
      limitIp: 10,
      priceMinor: envInt("PLAN_PRICE_FAMILY_1_MONTH", 34900),
      currency,
      family: true,
    },
    {
      id: "family_3",
      name: "Family — 3 Months",
      durationDays: 90,
      limitIp: 10,
      priceMinor: envInt("PLAN_PRICE_FAMILY_3_MONTHS", 89900),
      currency,
      family: true,
    },
  ];
}

export function getPlanById(id: string): Plan | undefined {
  return getPlans().find((p) => p.id === id);
}

export function formatPrice(plan: Plan): string {
  const amount = plan.priceMinor / 100;
  const symbols: Record<string, string> = { RUB: "₽", USD: "$", EUR: "€", TRY: "₺" };
  const sym = symbols[plan.currency] ?? plan.currency;
  const formatted = amount.toLocaleString("en-US", { maximumFractionDigits: 2 });
  return plan.currency === "USD" || plan.currency === "EUR"
    ? `${sym}${formatted}`
    : `${formatted} ${sym}`;
}
