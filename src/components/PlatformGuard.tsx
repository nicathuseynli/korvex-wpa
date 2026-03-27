"use client";

import { useEffect, useState } from "react";
import { detectPlatform } from "@/lib/platform";
import type { Dictionary } from "@/lib/i18n";

interface PlatformGuardProps {
  expectedPlatform: "ios" | "android";
  t: Dictionary["platformGuard"];
}

const STORAGE_KEY = "korvex-platform-guard-dismissed";

function getRedirectPath(actualPlatform: string): string {
  if (actualPlatform === "ios") return "/ios";
  if (actualPlatform === "android") return "/android";
  return "/";
}

function getPlatformLabel(platform: string): string {
  if (platform === "ios") return "iOS";
  if (platform === "android") return "Android";
  return platform;
}

export default function PlatformGuard({
  expectedPlatform,
  t,
}: PlatformGuardProps) {
  const [show, setShow] = useState(false);
  const [actualPlatform, setActualPlatform] = useState<string | null>(null);

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY)) return;
    } catch {
      // localStorage unavailable — skip guard
      return;
    }

    const detected = detectPlatform();
    if (
      detected !== expectedPlatform &&
      (detected === "ios" || detected === "android")
    ) {
      setActualPlatform(detected);
      setShow(true);
    }
  }, [expectedPlatform]);

  function dismiss() {
    setShow(false);
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // Silently ignore storage errors
    }
  }

  if (!show || !actualPlatform) return null;

  const redirectPath = getRedirectPath(actualPlatform);
  const label = getPlatformLabel(actualPlatform);

  return (
    <div className="fixed inset-x-0 top-[65px] z-40 border-b border-yellow-500/20 bg-yellow-500/10 px-4 py-3 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
        <p className="text-sm text-korvex-text">
          {t.usingPlatform} {label}.{" "}
          <a
            href={redirectPath}
            className="font-medium text-korvex-accent underline underline-offset-2 transition-colors hover:text-korvex-accent-secondary"
          >
            {t.switchQ}
          </a>
        </p>
        <button
          type="button"
          onClick={dismiss}
          className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md text-korvex-muted transition-colors hover:bg-korvex-bg-tertiary hover:text-korvex-text"
          aria-label={t.close}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          >
            <path d="M2 2l10 10M12 2L2 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
