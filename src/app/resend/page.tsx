import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ResendForm from "./ResendForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Resend link — Korvex",
};

interface Props {
  searchParams: { email?: string };
}

export default function ResendPage({ searchParams }: Props) {
  return (
    <>
      <Navbar />
      <main className="px-4 pb-20 pt-28">
        <div className="mx-auto max-w-lg">
          <h1 className="font-heading text-3xl font-black text-korvex-text">Resend your link</h1>
          <p className="mt-3 text-sm text-korvex-muted">
            We&apos;ll re-send the most recent connection link to the address you used at checkout.
          </p>
          <div className="mt-8 rounded-2xl border border-korvex-border bg-korvex-card p-6">
            <ResendForm defaultEmail={searchParams.email ?? ""} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
