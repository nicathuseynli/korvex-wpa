import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CheckoutForm from "./CheckoutForm";
import { getPlans, formatPrice, getPlanById } from "@/lib/plans";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Checkout — Korvex",
  description: "Complete your Korvex VPN subscription.",
};

interface Props {
  searchParams: { plan?: string };
}

export default function CheckoutPage({ searchParams }: Props) {
  const plans = getPlans().map((p) => ({
    id: p.id,
    name: p.name,
    durationDays: p.durationDays,
    limitIp: p.limitIp,
    price: formatPrice(p),
    family: p.family ?? false,
  }));
  const selected =
    (searchParams.plan && getPlanById(searchParams.plan)?.id) ||
    plans.find((p) => !p.family)?.id ||
    plans[0].id;

  return (
    <>
      <Navbar />
      <main className="px-4 pb-20 pt-28">
        <div className="mx-auto max-w-xl">
          <h1 className="font-heading text-3xl font-black text-korvex-text sm:text-4xl">
            Get your subscription
          </h1>
          <p className="mt-3 text-sm text-korvex-muted">
            Enter your email — we&apos;ll send the connection link to use in V2Box.
          </p>

          <div className="mt-8 rounded-2xl border border-korvex-border bg-korvex-card p-6">
            <CheckoutForm plans={plans} defaultPlanId={selected} />
          </div>

          <p className="mt-4 text-center text-xs text-korvex-muted">
            Payment step is temporarily disabled for testing.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
