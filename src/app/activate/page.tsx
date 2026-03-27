import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ActivationKeyForm from "@/components/ActivationKeyForm";
import { TG_BOT_URL } from "@/lib/constants";
import { getLocale, getDictionary } from "@/lib/i18n/server";

export const dynamic = "force-dynamic";

export function generateMetadata(): Metadata {
  const dict = getDictionary(getLocale());
  return {
    title: dict.activate.metaTitle,
    description: dict.activate.metaDesc,
    robots: { index: false, follow: false },
  };
}

export default function ActivatePage() {
  const dict = getDictionary(getLocale());

  return (
    <>
      <Navbar />

      <main className="px-4 pb-20 pt-28">
        <div className="mx-auto max-w-lg">
          {/* Header */}
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-korvex-accent/10">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#00ff87"
                strokeWidth="1.5"
              >
                <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
              </svg>
            </div>

            <h1 className="mt-6 font-heading text-3xl font-black text-korvex-text">
              {dict.activate.header}
            </h1>
            <p className="mt-3 text-korvex-muted">
              {dict.activate.subtitle}
            </p>
          </div>

          {/* Form */}
          <div className="mt-8 flex justify-center">
            <ActivationKeyForm t={dict.activationForm} tQr={dict.qrCode} />
          </div>

          {/* FAQ — pure CSS accordion via <details> */}
          <section className="mt-14">
            <h2 className="mb-6 font-heading text-lg font-bold text-korvex-text">
              {dict.activate.faqTitle}
            </h2>
            <div className="space-y-3">
              {dict.activate.faq.map((item) => (
                <details
                  key={item.id}
                  className="group rounded-xl border border-korvex-border bg-korvex-card"
                >
                  <summary className="flex cursor-pointer items-center justify-between px-5 py-4 text-sm font-medium text-korvex-text [&::-webkit-details-marker]:hidden">
                    {item.q}
                    <svg
                      className="h-4 w-4 flex-shrink-0 text-korvex-muted transition-transform duration-200 group-open:rotate-180"
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M4 6l4 4 4-4" />
                    </svg>
                  </summary>
                  <div className="border-t border-korvex-border px-5 pb-4 pt-3">
                    <p className="text-sm leading-relaxed text-korvex-muted">
                      {item.a}
                    </p>
                  </div>
                </details>
              ))}
            </div>
          </section>

          {/* Support */}
          <div className="mt-10 text-center">
            <p className="text-sm text-korvex-muted">
              {dict.activate.noAnswer}{" "}
              <a
                href={TG_BOT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-korvex-accent transition-colors hover:text-korvex-accent-secondary"
              >
                {dict.activate.contactSupport}
              </a>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
