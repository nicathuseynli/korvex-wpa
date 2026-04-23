"use client";

import { useState } from "react";

export default function ResendForm({ defaultEmail }: { defaultEmail: string }) {
  const [email, setEmail] = useState(defaultEmail);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/web/resend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setDone(true);
    } catch {
      // Show "done" anyway to avoid leaking which emails exist.
      setDone(true);
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="text-sm text-korvex-text">
        If an active subscription exists for <strong>{email}</strong>, we&apos;ve
        re-sent the link. Check your inbox (and spam) in a minute.
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="mb-2 block text-sm font-medium text-korvex-text">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full rounded-xl border border-korvex-border bg-korvex-bg px-4 py-3 text-sm text-korvex-text placeholder-korvex-muted outline-none focus:border-korvex-accent"
        />
      </div>
      <button
        type="submit"
        disabled={loading || !email}
        className="w-full rounded-xl bg-korvex-accent px-6 py-3 font-heading text-sm font-bold text-korvex-bg transition-all hover:bg-korvex-accent-secondary disabled:opacity-50"
      >
        {loading ? "Sending…" : "Resend link"}
      </button>
    </form>
  );
}
