import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Subscription ready — Korvex",
};

interface Props {
  searchParams: { email?: string; emailed?: string; manage?: string };
}

export default function SuccessPage({ searchParams }: Props) {
  const email = searchParams.email || "";
  const emailed = searchParams.emailed === "1";
  const manage = searchParams.manage;

  return (
    <>
      <Navbar />
      <main className="px-4 pb-20 pt-28">
        <div className="mx-auto max-w-xl text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-korvex-accent/10">
            <svg viewBox="0 0 24 24" className="h-8 w-8 text-korvex-accent" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M5 12l5 5 9-11" />
            </svg>
          </div>

          <h1 className="font-heading text-3xl font-black text-korvex-text">
            You&apos;re all set
          </h1>

          {emailed ? (
            <p className="mt-4 text-korvex-muted">
              We&apos;ve sent your connection link to{" "}
              <strong className="text-korvex-text">{email}</strong>. Open the email
              and paste the link into V2Box (or scan the QR).
            </p>
          ) : (
            <p className="mt-4 text-korvex-muted">
              Your subscription is active, but email delivery failed. Use the
              link below to view your connection details.
            </p>
          )}

          {manage && (
            <a
              href={manage}
              className="mt-8 inline-block rounded-xl bg-korvex-accent px-6 py-3 font-heading text-sm font-bold text-korvex-bg transition-all hover:bg-korvex-accent-secondary"
            >
              Open my subscription
            </a>
          )}

          <div className="mt-10 rounded-2xl border border-korvex-border bg-korvex-card p-6 text-left">
            <h2 className="font-heading text-base font-bold text-korvex-text">
              Didn&apos;t receive the email?
            </h2>
            <ol className="mt-3 list-inside list-decimal space-y-2 text-sm text-korvex-muted">
              <li>Check your spam folder.</li>
              <li>Wait ~1 minute — first-time delivery can be slow.</li>
              <li>
                <Link href={`/resend?email=${encodeURIComponent(email)}`} className="text-korvex-accent underline">
                  Resend the link
                </Link>
                .
              </li>
            </ol>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
