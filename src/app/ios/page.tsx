import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DownloadButtons from "@/components/DownloadButtons";
import ActivationFlow from "@/components/ActivationFlow";
import PlatformGuard from "@/components/PlatformGuard";
import { ACTIVATION_KEY_REGEX, TG_BOT_URL } from "@/lib/constants";
import { getLocale, getDictionary } from "@/lib/i18n/server";

export const dynamic = "force-dynamic";

export function generateMetadata(): Metadata {
  const dict = getDictionary(getLocale());
  return {
    title: dict.ios.metaTitle,
    description: dict.ios.metaDesc,
    robots: { index: false, follow: false },
  };
}

interface PageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

export default function IosPage({ searchParams }: PageProps) {
  const locale = getLocale();
  const dict = getDictionary(locale);
  const rawKey =
    typeof searchParams.key === "string" ? searchParams.key : undefined;
  const keyIsValid = rawKey ? ACTIVATION_KEY_REGEX.test(rawKey) : false;

  return (
    <>
      <Navbar />
      <PlatformGuard expectedPlatform="ios" t={dict.platformGuard} />

      <main className="px-4 pb-20 pt-28">
        <div className="mx-auto max-w-2xl">
          {/* Header */}
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-korvex-accent/10">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="#00ff87"
              >
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
            </div>
            <h1 className="mt-6 font-heading text-3xl font-black text-korvex-text sm:text-4xl">
              {dict.ios.header}
            </h1>
          </div>

          {/* Activation key present and valid */}
          {rawKey && keyIsValid && (
            <section className="mt-10">
              <ActivationFlow activationKey={rawKey} t={dict.activationFlow} />
            </section>
          )}

          {/* Activation key present but INVALID */}
          {rawKey && !keyIsValid && (
            <section className="mt-10">
              <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M15 9l-6 6M9 9l6 6" />
                  </svg>
                </div>
                <p className="mt-4 text-sm text-red-400">
                  {dict.ios.invalidKey}
                </p>
                <a
                  href={TG_BOT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 text-sm text-korvex-accent transition-colors hover:text-korvex-accent-secondary"
                >
                  {dict.ios.contactSupport}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </section>
          )}

          {/* No key — standard page */}
          {!rawKey && (
            <>
              <p className="mt-4 text-center text-korvex-muted">
                {dict.ios.downloadPrompt}
              </p>

              <div className="mt-8 flex justify-center">
                <DownloadButtons size="lg" />
              </div>

              {/* Features */}
              <section className="mt-14 space-y-4">
                {dict.platformFeatures.map((text, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 rounded-xl border border-korvex-border bg-korvex-card px-5 py-4"
                  >
                    <svg
                      className="h-5 w-5 flex-shrink-0 text-korvex-accent"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path d={["M13 2L3 14h9l-1 8 10-12h-9l1-8z", "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z", "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"][i]} />
                    </svg>
                    <span className="text-sm text-korvex-text">{text}</span>
                  </div>
                ))}
              </section>

              {/* Link to activate */}
              <div className="mt-10 text-center">
                <p className="text-sm text-korvex-muted">
                  {dict.ios.hasKey}{" "}
                  <Link
                    href="/activate"
                    className="text-korvex-accent transition-colors hover:text-korvex-accent-secondary"
                  >
                    {dict.ios.activate}
                  </Link>
                </p>
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
