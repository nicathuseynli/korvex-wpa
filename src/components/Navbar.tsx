import Link from "next/link";
import { TG_BOT_URL } from "@/lib/constants";
import { getLocale, getDictionary } from "@/lib/i18n/server";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function Navbar() {
  const locale = getLocale();
  const dict = getDictionary(locale);

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 border-b border-korvex-border bg-korvex-bg/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1">
          <span className="font-heading text-xl font-black tracking-tight text-korvex-text">
            KORV
          </span>
          <span className="font-heading text-xl font-black tracking-tight text-korvex-accent">
            EX
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-8 md:flex">
          <Link
            href="/"
            className="text-sm text-korvex-muted transition-colors hover:text-korvex-text"
          >
            {dict.nav.features}
          </Link>
          <Link
            href="/pricing"
            className="text-sm text-korvex-muted transition-colors hover:text-korvex-text"
          >
            {dict.nav.pricing}
          </Link>
          <Link
            href="/tv"
            className="text-sm text-korvex-muted transition-colors hover:text-korvex-text"
          >
            {dict.nav.tv}
          </Link>
          <a
            href={TG_BOT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-korvex-muted transition-colors hover:text-korvex-text"
          >
            {dict.nav.support}
          </a>
          <LanguageSwitcher currentLocale={locale} />
        </div>

        {/* Mobile hamburger — CSS-only via checkbox peer */}
        <div className="flex items-center gap-2 md:hidden">
          <LanguageSwitcher currentLocale={locale} />
          <input
            type="checkbox"
            id="nav-toggle"
            className="peer hidden"
            aria-label={dict.nav.toggleMenu}
          />
          <label
            htmlFor="nav-toggle"
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-korvex-border"
            aria-label={dict.nav.menu}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              stroke="#e8f5ee"
              strokeWidth="1.5"
              strokeLinecap="round"
            >
              <path d="M3 6h14M3 10h14M3 14h14" />
            </svg>
          </label>

          {/* Mobile menu panel */}
          <div className="fixed inset-x-0 top-[65px] hidden border-b border-korvex-border bg-korvex-bg/95 px-4 py-6 backdrop-blur-xl peer-checked:block md:!hidden">
            <div className="flex flex-col gap-5">
              <Link
                href="/"
                className="text-sm text-korvex-muted transition-colors hover:text-korvex-text"
              >
                {dict.nav.features}
              </Link>
              <Link
                href="/pricing"
                className="text-sm text-korvex-muted transition-colors hover:text-korvex-text"
              >
                {dict.nav.pricing}
              </Link>
              <Link
                href="/tv"
                className="text-sm text-korvex-muted transition-colors hover:text-korvex-text"
              >
                {dict.nav.tv}
              </Link>
              <a
                href={TG_BOT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-korvex-muted transition-colors hover:text-korvex-text"
              >
                {dict.nav.support}
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
