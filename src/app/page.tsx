import Navbar from "@/components/Navbar";
import PhoneMockup from "@/components/PhoneMockup";
import DownloadButtons from "@/components/DownloadButtons";
import Footer from "@/components/Footer";
import { TG_BOT_URL } from "@/lib/constants";
import { getLocale, getDictionary } from "@/lib/i18n/server";

export const dynamic = "force-dynamic";

export default function Home() {
  const locale = getLocale();
  const dict = getDictionary(locale);

  const features = [
    {
      id: "speed",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
      ),
      title: dict.features.speed.title,
      description: dict.features.speed.desc,
    },
    {
      id: "anonymity",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      ),
      title: dict.features.anonymity.title,
      description: dict.features.anonymity.desc,
    },
    {
      id: "no-registration",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 3a4 4 0 110 8 4 4 0 010-8z" />
        </svg>
      ),
      title: dict.features.noReg.title,
      description: dict.features.noReg.desc,
    },
    {
      id: "smart-tv",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <path d="M8 21h8M12 17v4" />
        </svg>
      ),
      title: dict.features.smartTv.title,
      description: dict.features.smartTv.desc,
    },
    {
      id: "eu-servers",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
        </svg>
      ),
      title: dict.features.euServers.title,
      description: dict.features.euServers.desc,
    },
    {
      id: "monitoring",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      ),
      title: dict.features.monitoring.title,
      description: dict.features.monitoring.desc,
    },
  ];

  const steps = dict.steps.items.map((s, i) => ({
    num: String(i + 1).padStart(2, "0"),
    title: s.title,
    description: s.desc,
  }));

  return (
    <>
      <Navbar />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden px-4 pb-20 pt-28">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,255,135,0.05)_0%,transparent_70%)]" />
          <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-korvex-border bg-korvex-card px-4 py-1.5">
                <div className="h-2 w-2 animate-pulse rounded-full bg-korvex-accent" />
                <span className="text-xs text-korvex-muted">
                  {dict.hero.badge}
                </span>
              </div>
              <h1 className="font-heading text-4xl font-black leading-tight text-korvex-text sm:text-5xl lg:text-6xl">
                {dict.hero.title}{" "}
                <span className="glow-text">{dict.hero.titleHighlight}</span>
              </h1>
              <p className="mt-6 max-w-lg text-lg font-light text-korvex-muted">
                {dict.hero.subtitle}
              </p>
              <div className="mt-8">
                <DownloadButtons showAll />
              </div>
            </div>
            <div className="flex justify-center lg:justify-end">
              <PhoneMockup />
            </div>
          </div>
        </section>

        {/* Features */}
        <section
          id="features"
          className="border-t border-korvex-border bg-korvex-bg-secondary px-4 py-20"
        >
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <h2 className="font-heading text-3xl font-bold text-korvex-text">
                {dict.features.title}
              </h2>
              <p className="mt-3 text-korvex-muted">
                {dict.features.subtitle}
              </p>
            </div>
            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((f) => (
                <div
                  key={f.id}
                  className="card group transition-all duration-200 hover:border-korvex-accent/20"
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-korvex-accent/10 text-korvex-accent transition-colors group-hover:bg-korvex-accent/20">
                    {f.icon}
                  </div>
                  <h3 className="font-heading text-base font-bold text-korvex-text">
                    {f.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-korvex-muted">
                    {f.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="border-t border-korvex-border bg-korvex-bg-secondary px-4 py-20">
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <h2 className="font-heading text-3xl font-bold text-korvex-text">
                {dict.steps.title}
              </h2>
            </div>
            <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
              {steps.map((s) => (
                <div key={s.num} className="text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-korvex-accent/10">
                    <span className="font-heading text-xl font-black text-korvex-accent">
                      {s.num}
                    </span>
                  </div>
                  <h3 className="mt-4 font-heading text-base font-bold text-korvex-text">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-sm text-korvex-muted">
                    {s.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Telegram banner */}
        <section className="px-4 py-20">
          <div className="mx-auto max-w-3xl">
            <div className="gradient-border rounded-2xl bg-korvex-card p-8 text-center sm:p-12">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-korvex-accent/10">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="#00ff87">
                  <path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                </svg>
              </div>
              <h2 className="mt-5 font-heading text-2xl font-bold text-korvex-text">
                {dict.telegram.title}
              </h2>
              <p className="mt-3 text-korvex-muted">
                {dict.telegram.desc}
              </p>
              <a
                href={TG_BOT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary mt-6 inline-flex"
              >
                {dict.telegram.cta}
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
