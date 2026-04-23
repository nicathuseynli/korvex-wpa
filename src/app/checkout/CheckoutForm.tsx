"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface PlanOption {
  id: string;
  name: string;
  durationDays: number;
  limitIp: number;
  price: string;
  family: boolean;
}

interface Props {
  plans: PlanOption[];
  defaultPlanId: string;
}

export default function CheckoutForm({ plans, defaultPlanId }: Props) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [planId, setPlanId] = useState(defaultPlanId);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/web/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, planId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong");
        setLoading(false);
        return;
      }
      const params = new URLSearchParams({
        email,
        emailed: data.emailed ? "1" : "0",
      });
      if (data.manageUrl) params.set("manage", data.manageUrl);
      router.push(`/success?${params.toString()}`);
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <label className="mb-2 block text-sm font-medium text-korvex-text">Plan</label>
        <div className="space-y-2">
          {plans.map((p) => (
            <label
              key={p.id}
              className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 transition-colors ${
                planId === p.id
                  ? "border-korvex-accent bg-korvex-accent/5"
                  : "border-korvex-border hover:border-korvex-accent/40"
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="plan"
                  value={p.id}
                  checked={planId === p.id}
                  onChange={() => setPlanId(p.id)}
                  className="h-4 w-4 accent-korvex-accent"
                />
                <div>
                  <div className="text-sm font-semibold text-korvex-text">{p.name}</div>
                  <div className="text-xs text-korvex-muted">
                    {p.durationDays} days · up to {p.limitIp} devices
                  </div>
                </div>
              </div>
              <div className="font-heading text-base font-bold text-korvex-text">{p.price}</div>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="email" className="mb-2 block text-sm font-medium text-korvex-text">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full rounded-xl border border-korvex-border bg-korvex-bg px-4 py-3 text-sm text-korvex-text placeholder-korvex-muted outline-none focus:border-korvex-accent"
        />
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !email}
        className="w-full rounded-xl bg-korvex-accent px-6 py-3 font-heading text-sm font-bold text-korvex-bg transition-all hover:bg-korvex-accent-secondary disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Creating..." : "Get connection link"}
      </button>

      <p className="text-xs text-korvex-muted">
        By continuing you agree the link will be sent to the address above.
      </p>
    </form>
  );
}
