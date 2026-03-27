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
    title: dict.android.metaTitle,
    description: dict.android.metaDesc,
    robots: { index: false, follow: false },
  };
}

interface PageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

export default function AndroidPage({ searchParams }: PageProps) {
  const locale = getLocale();
  const dict = getDictionary(locale);
  const rawKey =
    typeof searchParams.key === "string" ? searchParams.key : undefined;
  const keyIsValid = rawKey ? ACTIVATION_KEY_REGEX.test(rawKey) : false;

  return (
    <>
      <Navbar />
      <PlatformGuard expectedPlatform="android" t={dict.platformGuard} />

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
                <path d="M17.6 9.48l1.84-3.18c.16-.31.04-.69-.26-.85-.29-.15-.65-.06-.83.22l-1.88 3.24c-2.86-1.21-6.08-1.21-8.94 0L5.65 5.67c-.19-.29-.58-.38-.87-.2-.28.18-.37.54-.22.83L6.4 9.48C3.3 11.25 1.28 14.44 1 18h22c-.28-3.56-2.3-6.75-5.4-8.52zM7 15.25c-.69 0-1.25-.56-1.25-1.25s.56-1.25 1.25-1.25 1.25.56 1.25 1.25-.56 1.25-1.25 1.25zm10 0c-.69 0-1.25-.56-1.25-1.25s.56-1.25 1.25-1.25 1.25.56 1.25 1.25-.56 1.25-1.25 1.25z" />
              </svg>
            </div>
            <h1 className="mt-6 font-heading text-3xl font-black text-korvex-text sm:text-4xl">
              {dict.android.header}
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
                  {dict.android.invalidKey}
                </p>
                <a
                  href={TG_BOT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 text-sm text-korvex-accent transition-colors hover:text-korvex-accent-secondary"
                >
                  {dict.android.contactSupport}
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
                {dict.android.downloadPrompt}
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
                  {dict.android.hasKey}{" "}
                  <Link
                    href="/activate"
                    className="text-korvex-accent transition-colors hover:text-korvex-accent-secondary"
                  >
                    {dict.android.activate}
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
