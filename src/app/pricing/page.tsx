import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { APP_STORE_URL, PLAY_STORE_URL, TG_BOT_URL } from "@/lib/constants";
import { getLocale, getDictionary } from "@/lib/i18n/server";
import type { Locale } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export function generateMetadata(): Metadata {
  const dict = getDictionary(getLocale());
  return {
    title: dict.pricing.pageTitle + " — Korvex",
    description: dict.meta.siteDescription,
  };
}

// Price per locale: [weekly, monthly, annual]
const PRICES: Record<Locale, { weekly: string; monthly: string; annual: string; currency: string }> = {
  ru: { weekly: "99 ₽",  monthly: "299 ₽",  annual: "2 490 ₽", currency: "RUB" },
  tr: { weekly: "39 ₺",  monthly: "109 ₺",  annual: "890 ₺",   currency: "TRY" },
  en: { weekly: "$1.29", monthly: "$3.49",  annual: "$29.49",  currency: "USD" },
  kk: { weekly: "599 ₸", monthly: "1 499 ₸",annual: "11 990 ₸", currency: "KZT" },
  ky: { weekly: "99 с",  monthly: "299 с",  annual: "2 490 с",  currency: "KGS" },
};

function CheckIcon() {
  return (
    <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-korvex-accent" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 8l3.5 3.5L13 5" />
    </svg>
  );
}

export default function PricingPage() {
  const locale = getLocale();
  const dict = getDictionary(locale);
  const prices = PRICES[locale];
  const pf = dict.pricing.planFeatures;

  const plans = [
    {
      name: dict.pricing.plans.weekly.name,
      price: prices.weekly,
      period: dict.pricing.plans.weekly.period,
      trial: dict.pricing.plans.weekly.trial,
      features: [pf.allServers, pf.devices5, pf.wireguard, pf.support247],
      recommended: false,
      buyPlanId: "month_1",
    },
    {
      name: dict.pricing.plans.monthly.name,
      price: prices.monthly,
      period: dict.pricing.plans.monthly.period,
      trial: dict.pricing.plans.monthly.trial,
      features: [pf.allServers, pf.devices5, pf.wireguard, pf.support247, pf.prioritySupport],
      recommended: true,
      buyPlanId: "months_3",
    },
    {
      name: dict.pricing.plans.annual.name,
      price: prices.annual,
      period: dict.pricing.plans.annual.period,
      trial: dict.pricing.plans.annual.trial,
      features: [pf.allServers, pf.devices10, pf.wireguard, pf.support247, pf.prioritySupport, pf.savings65],
      recommended: false,
      buyPlanId: "months_12",
    },
  ];

  return (
    <>
      <Navbar />

      <main className="px-4 pb-20 pt-28">
        <div className="mx-auto max-w-5xl">

          {/* Header */}
          <div className="text-center">
            <h1 className="font-heading text-3xl font-black text-korvex-text sm:text-4xl">
              {dict.pricing.pageTitle}
            </h1>
            <p className="mt-4 text-korvex-muted">{dict.pricing.pageSubtitle}</p>
          </div>

          {/* Pricing cards — display only, no payment */}
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative flex flex-col rounded-2xl border p-6 transition-all duration-200 hover:scale-[1.02] ${
                  plan.recommended
                    ? "border-korvex-accent/30 bg-korvex-card shadow-[0_0_40px_rgba(0,255,135,0.08)]"
                    : "border-korvex-border bg-korvex-card"
                }`}
              >
                {plan.recommended && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="whitespace-nowrap rounded-full bg-korvex-accent px-4 py-1 text-xs font-bold text-korvex-bg">
                      ⭐ {dict.pricing.recommended}
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="font-heading text-base font-bold text-korvex-text">{plan.name}</h3>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="font-heading text-4xl font-black text-korvex-text">{plan.price}</span>
                    <span className="text-sm text-korvex-muted">/{plan.period}</span>
                  </div>
                  <p className="mt-2 text-sm text-korvex-accent">{plan.trial}</p>
                </div>

                <ul className="mb-6 flex-1 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-korvex-text">
                      <CheckIcon />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/checkout?plan=${plan.buyPlanId}`}
                  className={`block w-full rounded-xl px-4 py-3 text-center font-heading text-sm font-bold transition-all ${
                    plan.recommended
                      ? "bg-korvex-accent text-korvex-bg hover:bg-korvex-accent-secondary"
                      : "border border-korvex-border bg-korvex-bg-secondary text-korvex-text hover:border-korvex-accent/40"
                  }`}
                >
                  Get link via email
                </Link>
              </div>
            ))}
          </div>

          {/* Download CTA — redirect to stores, NO payment here */}
          <section className="mt-14">
            <div className="rounded-2xl border border-korvex-border bg-korvex-card p-8 text-center">
              <h2 className="font-heading text-xl font-bold text-korvex-text">
                {dict.pricing.downloadTitle}
              </h2>
              <p className="mt-3 text-sm text-korvex-muted">
                {dict.pricing.downloadSubtitle}
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-4">
                <a
                  href={APP_STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-korvex-accent px-6 py-3 font-heading text-sm font-bold text-korvex-bg transition-all hover:bg-korvex-accent-secondary hover:shadow-[0_0_24px_rgba(0,255,135,0.25)] active:scale-[0.97]"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                  </svg>
                  App Store
                </a>
                <a
                  href={PLAY_STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-korvex-border bg-korvex-bg-secondary px-6 py-3 font-heading text-sm font-bold text-korvex-text transition-all hover:border-korvex-accent/30 hover:bg-korvex-bg-tertiary active:scale-[0.97]"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.6 9.48l1.84-3.18c.16-.31.04-.69-.26-.85-.29-.15-.65-.06-.83.22l-1.88 3.24c-2.86-1.21-6.08-1.21-8.94 0L5.65 5.67c-.19-.29-.58-.38-.87-.2-.28.18-.37.54-.22.83L6.4 9.48C3.3 11.25 1.28 14.44 1 18h22c-.28-3.56-2.3-6.75-5.4-8.52zM7 15.25c-.69 0-1.25-.56-1.25-1.25s.56-1.25 1.25-1.25 1.25.56 1.25 1.25-.56 1.25-1.25 1.25zm10 0c-.69 0-1.25-.56-1.25-1.25s.56-1.25 1.25-1.25 1.25.56 1.25 1.25-.56 1.25-1.25 1.25z" />
                  </svg>
                  Google Play
                </a>
                <a
                  href={TG_BOT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-korvex-border bg-korvex-bg-secondary px-6 py-3 font-heading text-sm font-bold text-korvex-text transition-all hover:border-korvex-accent/30 hover:bg-korvex-bg-tertiary active:scale-[0.97]"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                  </svg>
                  Telegram
                </a>
              </div>
              <p className="mt-4 text-xs text-korvex-muted">{dict.pricing.storeNote}</p>
            </div>
          </section>

          {/* FAQ */}
          <section className="mt-20">
            <h2 className="mb-8 text-center font-heading text-2xl font-bold text-korvex-text">
              {dict.pricing.faqTitle}
            </h2>
            <div className="mx-auto max-w-3xl space-y-3">
              {dict.pricing.faq.map((item, i) => (
                <details key={i} className="group rounded-xl border border-korvex-border bg-korvex-card">
                  <summary className="flex cursor-pointer items-center justify-between px-5 py-4 text-sm font-medium text-korvex-text [&::-webkit-details-marker]:hidden">
                    {item.q}
                    <svg className="h-4 w-4 flex-shrink-0 text-korvex-muted transition-transform duration-200 group-open:rotate-180" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 6l4 4 4-4" />
                    </svg>
                  </summary>
                  <div className="border-t border-korvex-border px-5 pb-4 pt-3">
                    <p className="text-sm leading-relaxed text-korvex-muted">{item.a}</p>
                  </div>
                </details>
              ))}
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </>
  );
}
