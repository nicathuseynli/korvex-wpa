"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

interface SubData {
  email: string;
  planName: string;
  subscriptionUrl: string;
  expiresAt: string;
  status: string;
}

export default function MyClient({ token }: { token: string }) {
  const [data, setData] = useState<SubData | null>(null);
  const [qr, setQr] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("Missing access token.");
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/web/my?token=${encodeURIComponent(token)}`);
        if (!res.ok) {
          setError(res.status === 404 ? "Subscription not found." : "Could not load.");
          return;
        }
        const body = (await res.json()) as SubData;
        if (cancelled) return;
        setData(body);
        const q = await QRCode.toDataURL(body.subscriptionUrl, {
          margin: 1,
          width: 320,
          color: { dark: "#0a0a0a", light: "#ffffff" },
        });
        if (!cancelled) setQr(q);
      } catch {
        if (!cancelled) setError("Network error.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  async function copyLink() {
    if (!data) return;
    await navigator.clipboard.writeText(data.subscriptionUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-300">
        {error}
      </div>
    );
  }

  if (!data) {
    return <div className="text-sm text-korvex-muted">Loading…</div>;
  }

  const expires = new Date(data.expiresAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-korvex-border bg-korvex-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-wider text-korvex-accent">Plan</div>
            <div className="mt-1 font-heading text-lg font-bold text-korvex-text">{data.planName}</div>
          </div>
          <div
            className={`rounded-full px-3 py-1 text-xs font-bold ${
              data.status === "active"
                ? "bg-korvex-accent/15 text-korvex-accent"
                : "bg-korvex-border text-korvex-muted"
            }`}
          >
            {data.status}
          </div>
        </div>
        <div className="mt-3 text-sm text-korvex-muted">
          Expires <strong className="text-korvex-text">{expires}</strong>
        </div>
      </div>

      <div className="rounded-2xl border border-korvex-border bg-korvex-card p-6">
        <div className="mb-3 text-sm font-semibold text-korvex-text">
          Subscription link (paste in V2Box)
        </div>
        <div className="break-all rounded-lg border border-korvex-border bg-korvex-bg p-3 font-mono text-xs text-korvex-accent">
          {data.subscriptionUrl}
        </div>
        <button
          onClick={copyLink}
          className="mt-3 rounded-lg border border-korvex-border px-4 py-2 text-xs font-bold text-korvex-text hover:border-korvex-accent/40"
        >
          {copied ? "Copied" : "Copy link"}
        </button>
      </div>

      {qr && (
        <div className="rounded-2xl border border-korvex-border bg-korvex-card p-6 text-center">
          <div className="mb-3 text-sm font-semibold text-korvex-text">
            Or scan with V2Box
          </div>
          <img
            src={qr}
            alt="Subscription QR"
            className="mx-auto rounded-xl bg-white p-3"
            width={240}
            height={240}
          />
        </div>
      )}
    </div>
  );
}
