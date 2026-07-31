"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { Content } from "@/content/types";
import { routes } from "@/lib/routes";
import { useLocale } from "@/lib/locale";

const links: { key: keyof Content["nav"]; href: string }[] = [
  { key: "about", href: routes.about },
  { key: "journey", href: routes.journey },
  { key: "results", href: routes.results },
  { key: "usa", href: routes.usa },
  { key: "media", href: routes.media },
  { key: "partners", href: routes.partners },
  { key: "contact", href: routes.contact },
];

export function Header() {
  const { t, locale, setLocale } = useLocale();
  const pathname = usePathname();
  const isHome = pathname === routes.home;
  const [scrolled, setScrolled] = useState(!isHome);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!isHome) {
      setScrolled(true);
      return;
    }

    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={`site-header ${scrolled || !isHome ? "is-scrolled" : ""}`}
    >
      <div className="site-header__inner">
        <Link href={routes.home} className="brand" onClick={() => setOpen(false)}>
          <span className="brand__mark" aria-hidden="true">
            FU
          </span>
          <span className="brand__name">Filip Urbánoš</span>
        </Link>

        <nav className={`nav ${open ? "is-open" : ""}`} aria-label="Primary">
          {links.map(({ key, href }) => (
            <Link
              key={href}
              href={href}
              className={pathname === href ? "is-active" : ""}
              onClick={() => setOpen(false)}
            >
              {t.nav[key]}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          <div className="lang" role="group" aria-label="Language">
            <button
              type="button"
              className={locale === "en" ? "is-active" : ""}
              onClick={() => setLocale("en")}
            >
              EN
            </button>
            <span className="lang__sep" aria-hidden="true">
              /
            </span>
            <button
              type="button"
              className={locale === "sk" ? "is-active" : ""}
              onClick={() => setLocale("sk")}
            >
              SK
            </button>
          </div>
          <button
            type="button"
            className={`menu-btn ${open ? "is-open" : ""}`}
            aria-expanded={open}
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  );
}
