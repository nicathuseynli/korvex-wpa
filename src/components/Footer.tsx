import Link from "next/link";
import { getLocale, getDictionary } from "@/lib/i18n/server";

export default function Footer() {
  const locale = getLocale();
  const dict = getDictionary(locale);

  return (
    <footer className="border-t border-korvex-border bg-korvex-bg-secondary">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-korvex-accent">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    d="M8 1L14 4.5V11.5L8 15L2 11.5V4.5L8 1Z"
                    fill="#060d0a"
                    stroke="#060d0a"
                    strokeWidth="1.5"
                  />
                </svg>
              </div>
              <span className="font-heading text-lg font-bold text-korvex-text">
                Korvex
              </span>
            </div>
            <p className="mt-3 text-sm text-korvex-muted">
              {dict.footer.desc}
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="mb-3 font-heading text-xs font-bold uppercase tracking-wider text-korvex-muted">
              {dict.footer.navTitle}
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/pricing"
                  className="text-sm text-korvex-text transition-colors hover:text-korvex-accent"
                >
                  {dict.footer.pricing}
                </Link>
              </li>
              <li>
                <Link
                  href="/activate"
                  className="text-sm text-korvex-text transition-colors hover:text-korvex-accent"
                >
                  {dict.footer.activation}
                </Link>
              </li>
              <li>
                <Link
                  href="/tv"
                  className="text-sm text-korvex-text transition-colors hover:text-korvex-accent"
                >
                  {dict.footer.smartTv}
                </Link>
              </li>
              <li>
                <a
                  href="https://t.me/KorvexVPN_Bot"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-korvex-text transition-colors hover:text-korvex-accent"
                >
                  {dict.footer.support}
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="mb-3 font-heading text-xs font-bold uppercase tracking-wider text-korvex-muted">
              {dict.footer.legalTitle}
            </h4>
            <ul className="space-y-2">
              <li>
                <span className="text-sm text-korvex-muted">
                  {dict.footer.privacy}
                </span>
              </li>
              <li>
                <span className="text-sm text-korvex-muted">
                  {dict.footer.terms}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-korvex-border pt-6 text-center text-xs text-korvex-muted">
          &copy; {new Date().getFullYear()} {dict.footer.copyright}
        </div>
      </div>
    </footer>
  );
}
