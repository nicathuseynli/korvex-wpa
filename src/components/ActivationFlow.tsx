"use client";

import { useEffect, useState } from "react";
import { activationKeySchema } from "@/lib/validation";
import { buildActivationDeepLink, attemptDeepLink } from "@/lib/deeplink";
import { detectPlatform } from "@/lib/platform";
import { APP_STORE_URL, PLAY_STORE_URL } from "@/lib/constants";
import type { Dictionary } from "@/lib/i18n";
import QRCode from "@/components/QRCode";

interface ActivationFlowProps {
  activationKey: string;
  t: Dictionary["activationFlow"];
}

type Platform = "ios" | "android" | "desktop" | "tv";

function getStoreUrl(platform: Platform): string {
  if (platform === "ios") return APP_STORE_URL;
  return PLAY_STORE_URL;
}

function getStoreName(platform: Platform): string {
  if (platform === "ios") return "App Store";
  return "Google Play";
}

export default function ActivationFlow({ activationKey, t }: ActivationFlowProps) {
  const [platform, setPlatform] = useState<Platform>("desktop");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [deepLink, setDeepLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setPlatform(detectPlatform());

    const result = activationKeySchema.safeParse(activationKey);
    if (!result.success) {
      setValidationError(t.invalidKey);
      return;
    }

    try {
      const link = buildActivationDeepLink(activationKey);
      setDeepLink(link);

      // Auto-attempt deep link after 1500ms — mobile only
      const detected = detectPlatform();
      if (detected === 'ios' || detected === 'android') {
        const timer = setTimeout(() => {
          attemptDeepLink(link, getStoreUrl(detected));
        }, 1500);
        return () => clearTimeout(timer);
      }
    } catch {
      setValidationError(t.processingError);
    }
  }, [activationKey, t]);

  if (validationError) {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#ef4444"
            strokeWidth="1.5"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M15 9l-6 6M9 9l6 6" />
          </svg>
        </div>
        <p className="mt-4 text-sm text-red-400">{validationError}</p>
      </div>
    );
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(activationKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard not available
    }
  };

  const isMobile = platform === 'ios' || platform === 'android';
  const isDesktop = platform === 'desktop';

  const storeUrl = getStoreUrl(platform);
  const storeName = getStoreName(platform);

  return (
    <div className="space-y-6">
      {/* Step 1: Download */}
      <div className="rounded-2xl border border-korvex-border bg-korvex-card p-6">
        <div className="flex items-start gap-4">
          <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-korvex-accent/10 font-heading text-sm font-bold text-korvex-accent">
            1
          </span>
          <div className="flex-1">
            <h3 className="font-heading text-sm font-bold text-korvex-text">
              {t.step1Title}
            </h3>
            <p className="mt-1 text-xs text-korvex-muted">
              {t.step1Sub}
            </p>
            <a
              href={storeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-2 rounded-xl border border-korvex-border bg-korvex-bg-secondary px-4 py-2 text-xs font-bold text-korvex-text transition-colors hover:border-korvex-accent/30"
            >
              {t.downloadFrom} {storeName}
            </a>
          </div>
        </div>
      </div>

      {/* Step 2: Activate */}
      <div className="rounded-2xl border border-korvex-accent/20 bg-korvex-accent/5 p-6">
        <div className="flex items-start gap-4">
          <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-korvex-accent/20 font-heading text-sm font-bold text-korvex-accent">
            2
          </span>
          <div className="flex-1">
            <h3 className="font-heading text-sm font-bold text-korvex-text">
              {t.step2Title}
            </h3>
            <p className="mt-1 text-xs text-korvex-muted">
              {t.step2Sub}
            </p>
            {/* Mobile: one-tap deep link button */}
            {isMobile && (
              <button
                type="button"
                onClick={() => { if (deepLink) attemptDeepLink(deepLink, storeUrl); }}
                className="mt-3 inline-flex items-center gap-2 rounded-xl bg-korvex-accent px-5 py-2.5 font-heading text-xs font-bold text-korvex-bg transition-all hover:bg-korvex-accent-secondary hover:shadow-[0_0_24px_rgba(0,255,135,0.25)] active:scale-[0.97]"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
                {t.openAndActivate}
              </button>
            )}

            {/* Desktop: QR code to scan with phone */}
            {isDesktop && deepLink && (
              <div className="mt-4">
                <p className="mb-3 text-xs text-korvex-muted">
                  Отсканируйте телефоном для активации:
                </p>
                <QRCode url={deepLink} size={160} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Key display */}
      <div className="rounded-xl border border-korvex-border bg-korvex-bg-secondary px-4 py-3">
        <div className="flex items-center justify-between">
          <p className="text-[10px] uppercase tracking-wider text-korvex-muted">
            {t.yourKey}
          </p>
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1 rounded-lg px-2 py-1 text-[10px] text-korvex-muted transition-colors hover:text-korvex-accent"
          >
            {copied ? (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Скопировано
              </>
            ) : (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" />
                  <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                </svg>
                Копировать
              </>
            )}
          </button>
        </div>
        <p className="mt-1 break-all font-mono text-sm text-korvex-text">
          {activationKey}
        </p>
      </div>
    </div>
  );
}
