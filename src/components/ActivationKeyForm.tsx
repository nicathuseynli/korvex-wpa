"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { activateFormSchema, type ActivateFormInput } from "@/lib/validation";
import { buildActivationDeepLink, attemptDeepLink } from "@/lib/deeplink";
import { detectPlatform } from "@/lib/platform";
import { APP_STORE_URL, PLAY_STORE_URL } from "@/lib/constants";
import { useState, useCallback } from "react";
import QRCode from "@/components/QRCode";
import type { Dictionary } from "@/lib/i18n";

type Platform = "ios" | "android" | "desktop" | "tv";

function getStoreUrl(platform: Platform): string {
  if (platform === "ios") return APP_STORE_URL;
  return PLAY_STORE_URL;
}

interface ActivationKeyFormProps {
  t: Dictionary["activationForm"];
  tQr: Dictionary["qrCode"];
}

export default function ActivationKeyForm({ t, tQr }: ActivationKeyFormProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [qrUrl, setQrUrl] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid, isDirty },
  } = useForm<ActivateFormInput>({
    resolver: zodResolver(activateFormSchema),
    mode: "onChange",
  });

  const keyValue = watch("key") ?? "";

  const handleKeyChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      // Strip non-hex characters and lowercase
      const cleaned = e.target.value.replace(/[^a-fA-F0-9]/g, "").toLowerCase();
      setValue("key", cleaned, { shouldValidate: true });
    },
    [setValue]
  );

  function onSubmit(data: ActivateFormInput) {
    setSubmitError(null);
    setQrUrl(null);

    try {
      const deepLink = buildActivationDeepLink(data.key);
      const platform = detectPlatform();

      if (platform === "desktop") {
        // Desktop: show QR code instead of attempting deep link
        setQrUrl(deepLink);
        return;
      }

      attemptDeepLink(deepLink, getStoreUrl(platform));
    } catch {
      setSubmitError(t.processingError);
    }
  }

  const hasError = Boolean(errors.key) && isDirty;
  const isValidKey = isValid && isDirty && keyValue.length === 32;

  const inputBorderClass = hasError
    ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/30"
    : isValidKey
    ? "border-korvex-accent/50 focus:border-korvex-accent focus:ring-korvex-accent/30"
    : "border-korvex-border focus:border-korvex-accent/50 focus:ring-korvex-accent/50";

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-md space-y-4"
    >
      <div>
        <label
          htmlFor="activation-key-input"
          className="mb-2 block text-sm font-medium text-korvex-text"
        >
          {t.label}
        </label>
        <input
          id="activation-key-input"
          type="text"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          maxLength={32}
          placeholder={t.placeholder}
          className={`w-full rounded-xl bg-korvex-bg-secondary px-4 py-3 font-mono text-sm lowercase text-korvex-text placeholder:text-korvex-muted/40 focus:outline-none focus:ring-1 transition-colors border ${inputBorderClass}`}
          {...register("key")}
          onChange={handleKeyChange}
        />
        {/* Character count */}
        <div className="mt-1.5 flex items-center justify-between">
          {hasError ? (
            <p className="text-xs text-red-400">
              {t.invalidFormat}
            </p>
          ) : isValidKey ? (
            <p className="text-xs text-korvex-accent">{t.valid}</p>
          ) : (
            <p className="text-xs text-korvex-muted">{t.hexChars}</p>
          )}
          <span
            className={`text-xs ${
              keyValue.length === 32 ? "text-korvex-accent" : "text-korvex-muted"
            }`}
          >
            {keyValue.length}/32
          </span>
        </div>
      </div>

      <button
        type="submit"
        disabled={!isValidKey}
        className="w-full rounded-xl bg-korvex-accent px-6 py-3 font-heading text-sm font-bold text-korvex-bg transition-all duration-200 hover:bg-korvex-accent-secondary hover:shadow-[0_0_24px_rgba(0,255,135,0.25)] active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-40"
      >
        {t.activateBtn}
      </button>

      {submitError && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-400">
          {submitError}
        </div>
      )}

      {qrUrl && (
        <div className="space-y-3 rounded-2xl border border-korvex-border bg-korvex-card p-6 text-center">
          <p className="text-sm text-korvex-muted">
            {t.scanQR}
          </p>
          <div className="flex justify-center">
            <QRCode url={qrUrl} size={200} errorText={tQr.error} />
          </div>
          <p className="text-xs text-korvex-muted">
            {t.orCopyKey}
          </p>
        </div>
      )}
    </form>
  );
}
