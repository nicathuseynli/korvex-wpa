"use client";

import { useState, useRef, useEffect } from "react";
import { locales, type Locale } from "@/lib/i18n";

interface LanguageSwitcherProps {
  currentLocale: Locale;
}

export default function LanguageSwitcher({ currentLocale }: LanguageSwitcherProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  function switchLocale(locale: Locale) {
    // Set cookie with 1-year expiry
    const expires = new Date();
    expires.setFullYear(expires.getFullYear() + 1);
    document.cookie = `locale=${locale};path=/;expires=${expires.toUTCString()};samesite=lax`;
    setOpen(false);
    // Navigate to current path to force server re-render with new locale
    window.location.href = window.location.pathname;
  }

  const current = locales.find((l) => l.code === currentLocale) ?? locales[0];

  return (
    <div ref={ref} className="relative" style={{ zIndex: 9999 }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Select language"
        className="flex items-center gap-1.5 rounded-lg border border-korvex-border px-2.5 py-1.5 text-xs text-korvex-text transition-colors hover:border-korvex-accent/30 hover:bg-korvex-bg-tertiary"
      >
        <span aria-hidden="true">{current.flag}</span>
        <span className="hidden sm:inline">{current.code.toUpperCase()}</span>
        <svg
          className={`h-3 w-3 text-korvex-muted transition-transform duration-150 ${open ? "rotate-180" : ""}`}
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path d="M3 4.5l3 3 3-3" />
        </svg>
      </button>

      {open && (
        <div
          role="listbox"
          aria-label="Language options"
          className="absolute right-0 top-full mt-2 min-w-[140px] overflow-hidden rounded-xl border border-korvex-border bg-korvex-card shadow-xl"
          style={{ zIndex: 9999 }}
        >
          {locales.map((l) => (
            <button
              key={l.code}
              type="button"
              role="option"
              aria-selected={l.code === currentLocale}
              onClick={() => switchLocale(l.code)}
              className={`flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-sm transition-colors hover:bg-korvex-bg-tertiary ${
                l.code === currentLocale ? "text-korvex-accent" : "text-korvex-text"
              }`}
            >
              <span aria-hidden="true">{l.flag}</span>
              <span>{l.name}</span>
              {l.code === currentLocale && (
                <svg className="ml-auto h-3 w-3 text-korvex-accent" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M2 6l3 3 5-5" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
