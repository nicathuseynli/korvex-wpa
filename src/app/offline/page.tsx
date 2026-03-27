"use client";

import { getDictionary, getClientLocale } from "@/lib/i18n";

export default function OfflinePage() {
  const dict = getDictionary(getClientLocale());

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-korvex-accent/10">
        <svg
          width="36"
          height="36"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#00ff87"
          strokeWidth="1.5"
        >
          <path d="M1 1l22 22M16.72 11.06A10.94 10.94 0 0119 12.55M5 12.55a10.94 10.94 0 015.17-2.39M10.71 5.05A16 16 0 0122.56 9M1.42 9a15.91 15.91 0 014.7-2.88M8.53 16.11a6 6 0 016.95 0M12 20h.01" />
        </svg>
      </div>

      <h1 className="mt-8 font-heading text-3xl font-black text-korvex-text">
        {dict.offline.title}
      </h1>
      <p className="mt-4 max-w-sm text-korvex-muted">
        {dict.offline.desc}
      </p>

      <button
        type="button"
        onClick={() => window.location.reload()}
        className="mt-8 inline-flex items-center gap-2 rounded-xl bg-korvex-accent px-6 py-3 font-heading text-sm font-bold text-korvex-bg transition-all duration-200 hover:bg-korvex-accent-secondary hover:shadow-[0_0_24px_rgba(0,255,135,0.25)] active:scale-[0.97]"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M23 4v6h-6M1 20v-6h6" />
          <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
        </svg>
        {dict.offline.retry}
      </button>

      <p className="mt-6 text-xs text-korvex-muted">
        {dict.offline.cached}
      </p>
    </main>
  );
}
