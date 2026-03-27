import {
  APP_STORE_URL,
  PLAY_STORE_URL,
  TG_BOT_URL,
} from "@/lib/constants";

interface PricingCardProps {
  plan?: string;
  /** @deprecated Use plan instead */
  title?: string;
  price: string;
  period: string;
  trial: string;
  features: string[];
  ctaUrl?: string;
  recommended?: boolean;
  recommendedLabel?: string;
  ctaLabel?: string;
}

const ALLOWED_CTA_URLS: ReadonlySet<string> = new Set([
  APP_STORE_URL,
  PLAY_STORE_URL,
  TG_BOT_URL,
]);

function isValidCtaUrl(url: string): boolean {
  return ALLOWED_CTA_URLS.has(url) || url.startsWith("/");
}

export default function PricingCard({
  plan,
  title,
  price,
  period,
  trial,
  features,
  ctaUrl = "/pricing",
  recommended = false,
  recommendedLabel = "\u2b50 \u0420\u0435\u043a\u043e\u043c\u0435\u043d\u0434\u0443\u0435\u043c",
  ctaLabel = "\u041d\u0430\u0447\u0430\u0442\u044c",
}: PricingCardProps) {
  const displayName = plan ?? title ?? "";
  const safeCtaUrl = isValidCtaUrl(ctaUrl) ? ctaUrl : "/pricing";

  return (
    <div
      className={`relative flex flex-col rounded-2xl border p-6 transition-all duration-200 hover:scale-[1.02] ${
        recommended
          ? "border-korvex-accent/30 bg-korvex-card shadow-[0_0_40px_rgba(0,255,135,0.08)]"
          : "border-korvex-border bg-korvex-card"
      }`}
    >
      {recommended && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="whitespace-nowrap rounded-full bg-korvex-accent px-4 py-1 text-xs font-bold text-korvex-bg">
            &#11088; {recommendedLabel}
          </span>
        </div>
      )}

      <div className="mb-6">
        <h3 className="font-heading text-base font-bold text-korvex-text">
          {displayName}
        </h3>
        <div className="mt-3 flex items-baseline gap-1">
          <span className="font-heading text-4xl font-black text-korvex-text">
            {price}
          </span>
          <span className="text-sm text-korvex-muted">/{period}</span>
        </div>
        <p className="mt-2 text-sm text-korvex-accent">{trial}</p>
      </div>

      <ul className="mb-6 flex-1 space-y-3">
        {features.map((feature) => (
          <li
            key={feature}
            className="flex items-start gap-2 text-sm text-korvex-text"
          >
            <svg
              className="mt-0.5 h-4 w-4 flex-shrink-0 text-korvex-accent"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M3 8l3.5 3.5L13 5" />
            </svg>
            {feature}
          </li>
        ))}
      </ul>

      <a
        href={safeCtaUrl}
        target={safeCtaUrl.startsWith("/") ? undefined : "_blank"}
        rel={safeCtaUrl.startsWith("/") ? undefined : "noopener noreferrer"}
        className={`w-full rounded-xl px-6 py-3 text-center font-heading text-sm font-bold transition-all duration-200 active:scale-[0.97] ${
          recommended
            ? "bg-korvex-accent text-korvex-bg hover:bg-korvex-accent-secondary hover:shadow-[0_0_24px_rgba(0,255,135,0.25)]"
            : "border border-korvex-border bg-korvex-card text-korvex-text hover:border-korvex-accent/30 hover:bg-korvex-bg-tertiary"
        }`}
      >
        {ctaLabel}
      </a>
    </div>
  );
}
