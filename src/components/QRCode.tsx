"use client";

import { useEffect, useRef, useState } from "react";
import QRCodeLib from "qrcode";

interface QRCodeProps {
  url: string;
  size?: number;
  errorText?: string;
}

export default function QRCode({ url, size = 200, errorText }: QRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setLoading(true);
    setError(false);

    QRCodeLib.toCanvas(
      canvas,
      url,
      {
        width: size,
        margin: 2,
        color: {
          dark: "#00ff87",
          light: "#0a1510",
        },
        errorCorrectionLevel: "M",
      },
      (err) => {
        if (err) {
          setError(true);
        }
        setLoading(false);
      }
    );
  }, [url, size]);

  if (error) {
    return (
      <div
        className="flex items-center justify-center rounded-xl border border-korvex-border bg-korvex-bg-secondary text-sm text-korvex-muted"
        style={{ width: size, height: size }}
      >
        {errorText ?? "QR error"}
      </div>
    );
  }

  return (
    <div className="relative inline-block rounded-xl border border-korvex-border bg-korvex-bg-secondary p-3">
      {loading && (
        <div
          className="absolute inset-0 flex items-center justify-center rounded-xl bg-korvex-bg-secondary"
          style={{ width: size + 24, height: size + 24 }}
        >
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-korvex-accent border-t-transparent" />
        </div>
      )}
      <canvas
        ref={canvasRef}
        className={loading ? "invisible" : "visible"}
        width={size}
        height={size}
      />
    </div>
  );
}
