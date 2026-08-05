"use client";

import Link from "next/link";
import { BrandMark } from "@/components/BrandMark";
import { mediaLinks } from "@/content";
import type { Content } from "@/content/types";
import { useLocale } from "@/lib/locale";
import { localePath } from "@/lib/locale-path";
import { routes } from "@/lib/routes";

const links: { key: keyof Content["nav"]; href: string }[] = [
  { key: "about", href: routes.about },
  { key: "journey", href: routes.journey },
  { key: "results", href: routes.results },
  { key: "usa", href: routes.usa },
  { key: "media", href: routes.media },
  { key: "partners", href: routes.partners },
  { key: "contact", href: routes.contact },
];

const emailDisplay = "urbanosfilip33@gmail.com";

export function Footer() {
  const { t, locale } = useLocale();
  const brandName = locale === "en" ? "Filip Urbanos" : "Filip Urbánoš";

  return (
    <footer className="site-footer">
      <div className="shell site-footer__inner">
        <div className="site-footer__brand-block">
          <div className="site-footer__brand-row">
            <BrandMark />
            <p className="site-footer__brand">{brandName}</p>
          </div>
          <p className="site-footer__tag">{t.footer.tagline}</p>
        </div>

        <nav className="site-footer__nav" aria-label={t.chrome.nav}>
          {links.map(({ key, href }) => (
            <Link key={href} href={localePath(locale, href)}>
              {t.nav[key]}
            </Link>
          ))}
        </nav>

        <div className="site-footer__contact">
          <a className="site-footer__email" href={mediaLinks.email}>
            {emailDisplay}
          </a>
          <a
            className="site-footer__ig"
            href={mediaLinks.instagram}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t.footer.instagram}
          </a>
        </div>

        <p className="site-footer__rights">{t.footer.rights}</p>
      </div>
    </footer>
  );
}
