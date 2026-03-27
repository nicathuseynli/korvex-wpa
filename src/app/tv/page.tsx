import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import QRCode from "@/components/QRCode";
import { TG_BOT_URL } from "@/lib/constants";
import { getLocale, getDictionary } from "@/lib/i18n/server";

export const dynamic = "force-dynamic";

export function generateMetadata(): Metadata {
  const dict = getDictionary(getLocale());
  return {
    title: dict.tv.metaTitle,
    description: dict.tv.metaDesc,
  };
}

function StepList({
  title,
  steps,
}: {
  title: string;
  steps: readonly string[];
}) {
  return (
    <div className="card">
      <h3 className="font-heading text-base font-bold text-korvex-accent">
        {title}
      </h3>
      <ol className="mt-4 space-y-3">
        {steps.map((step, i) => (
          <li key={step} className="flex items-start gap-3">
            <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded bg-korvex-accent/10 text-xs font-bold text-korvex-accent">
              {i + 1}
            </span>
            <p className="text-sm text-korvex-text">{step}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function TvPage() {
  const dict = getDictionary(getLocale());

  return (
    <>
      <Navbar />

      <main className="px-4 pb-20 pt-28">
        <div className="mx-auto max-w-2xl">
          {/* Header */}
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-korvex-accent/10">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#00ff87"
                strokeWidth="1.5"
              >
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <path d="M8 21h8M12 17v4" />
              </svg>
            </div>
            <h1 className="mt-6 font-heading text-3xl font-black text-korvex-text sm:text-4xl">
              {dict.tv.header}
            </h1>
            <p className="mt-4 text-korvex-muted">
              {dict.tv.subtitle}
            </p>
          </div>

          {/* QR code for Android TV */}
          <section className="mt-10">
            <div className="card text-center">
              <h2 className="font-heading text-lg font-bold text-korvex-text">
                {dict.tv.quickSetup}
              </h2>
              <p className="mt-2 text-sm text-korvex-muted">
                {dict.tv.scanQR}
              </p>
              <div className="mt-6 flex justify-center">
                <QRCode
                  url="https://korvex.app/android"
                  size={200}
                  errorText={dict.qrCode.error}
                />
              </div>
            </div>
          </section>

          {/* Setup guides */}
          <section className="mt-10 space-y-4">
            <StepList title={dict.tv.androidTv} steps={dict.tv.androidSteps} />
            <StepList title={dict.tv.appleTv} steps={dict.tv.appleSteps} />
            <StepList title={dict.tv.otherTv} steps={dict.tv.otherSteps} />
          </section>

          {/* Help */}
          <section className="mt-10 text-center">
            <p className="text-sm text-korvex-muted">
              {dict.tv.needHelp}
            </p>
            <a
              href={TG_BOT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary mt-4 inline-flex"
            >
              {dict.tv.contactSupport}
            </a>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
