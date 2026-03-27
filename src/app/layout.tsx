import type { Metadata, Viewport } from "next";
import { Inter, Unbounded } from "next/font/google";
import "./globals.css";
import TelegramProvider from "@/components/TelegramProvider";
import { getLocale } from "@/lib/i18n/server";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500"],
  variable: "--font-inter",
  display: "swap",
});

const unbounded = Unbounded({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "700", "900"],
  variable: "--font-unbounded",
  display: "swap",
});

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Korvex",
  description: "Private encrypted connection for iOS, Android & Smart TV",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Korvex",
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export const viewport: Viewport = {
  themeColor: "#00ff87",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = getLocale();

  return (
    <html
      lang={locale}
      className={`${inter.variable} ${unbounded.variable}`}
      style={{
        "--bg": "#060d0a",
        "--bg2": "#0a1510",
        "--accent": "#00ff87",
        "--text": "#e8f5ee",
        "--muted": "#4d7a5f",
        "--card": "#0b1812",
        "--border": "#162a1e",
      } as React.CSSProperties}
    >
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <script src="https://telegram.org/js/telegram-web-app.js" async />
      </head>
      <body className="min-h-screen bg-korvex-bg font-body text-korvex-text antialiased">
        <TelegramProvider>{children}</TelegramProvider>
      </body>
    </html>
  );
}
