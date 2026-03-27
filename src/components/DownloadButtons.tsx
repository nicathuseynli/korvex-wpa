"use client";

import { useEffect, useState } from "react";
import { detectPlatform } from "@/lib/platform";
import { APP_STORE_URL, PLAY_STORE_URL, TG_BOT_URL } from "@/lib/constants";

interface DownloadButtonsProps {
  size?: "sm" | "lg";
  showAll?: boolean;
  /** @deprecated Use showAll instead */
  showTv?: boolean;
}

type Platform = "ios" | "android" | "desktop" | "tv";

function AppleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  );
}

function AndroidIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.6 9.48l1.84-3.18c.16-.31.04-.69-.26-.85-.29-.15-.65-.06-.83.22l-1.88 3.24c-2.86-1.21-6.08-1.21-8.94 0L5.65 5.67c-.19-.29-.58-.38-.87-.2-.28.18-.37.54-.22.83L6.4 9.48C3.3 11.25 1.28 14.44 1 18h22c-.28-3.56-2.3-6.75-5.4-8.52zM7 15.25c-.69 0-1.25-.56-1.25-1.25s.56-1.25 1.25-1.25 1.25.56 1.25 1.25-.56 1.25-1.25 1.25zm10 0c-.69 0-1.25-.56-1.25-1.25s.56-1.25 1.25-1.25 1.25.56 1.25 1.25-.56 1.25-1.25 1.25z" />
    </svg>
  );
}

function TelegramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  );
}

export default function DownloadButtons({
  size = "lg",
  showAll = false,
  showTv = false,
}: DownloadButtonsProps) {
  const shouldShowAll = showAll || showTv;
  const [platform, setPlatform] = useState<Platform>("desktop");

  useEffect(() => {
    setPlatform(detectPlatform());
  }, []);

  const sizeClasses =
    size === "lg"
      ? "px-6 py-3 text-sm"
      : "px-4 py-2 text-xs";

  const primaryClasses = `inline-flex items-center justify-center gap-2 rounded-xl bg-korvex-accent font-heading font-bold text-korvex-bg transition-all duration-200 hover:bg-korvex-accent-secondary hover:shadow-[0_0_24px_rgba(0,255,135,0.25)] active:scale-[0.97] ${sizeClasses}`;

  const secondaryClasses = `inline-flex items-center justify-center gap-2 rounded-xl border border-korvex-border bg-korvex-card font-heading font-bold text-korvex-text transition-all duration-200 hover:border-korvex-accent/30 hover:bg-korvex-bg-tertiary active:scale-[0.97] ${sizeClasses}`;

  const showIos = shouldShowAll || platform === "ios" || platform === "desktop";
  const showAndroid = shouldShowAll || platform === "android" || platform === "desktop" || platform === "tv";
  const showTelegram = shouldShowAll || platform === "desktop";

  return (
    <div className="flex flex-wrap items-center gap-3">
      {showIos && (
        <a
          href={APP_STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={platform === "ios" ? primaryClasses : secondaryClasses}
        >
          <AppleIcon />
          App Store
        </a>
      )}

      {showAndroid && (
        <a
          href={PLAY_STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={platform === "android" || platform === "tv" ? primaryClasses : secondaryClasses}
        >
          <AndroidIcon />
          Google Play
        </a>
      )}

      {(shouldShowAll || platform === "tv" || platform === "desktop") && (
        <a
          href="/tv"
          className={platform === "tv" ? primaryClasses : secondaryClasses}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="2" y="3" width="20" height="14" rx="2" />
            <path d="M8 21h8M12 17v4" />
          </svg>
          Smart TV
        </a>
      )}

      {showTelegram && (
        <a
          href={TG_BOT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={secondaryClasses}
        >
          <TelegramIcon />
          Telegram
        </a>
      )}
    </div>
  );
}
