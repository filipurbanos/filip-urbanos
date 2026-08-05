"use client";

import { BrandMark } from "@/components/BrandMark";
import { mediaLinks } from "@/content";
import { useLocale } from "@/lib/locale";

export function Footer() {
  const { t, locale } = useLocale();
  const brandName = locale === "en" ? "Filip Urbanos" : "Filip Urbánoš";

  return (
    <footer className="site-footer">
      <div className="shell site-footer__inner">
        <div className="site-footer__brand-row">
          <BrandMark />
          <p className="site-footer__brand">{brandName}</p>
        </div>
        <p className="site-footer__tag">{t.footer.tagline}</p>
        <a
          className="site-footer__ig"
          href={mediaLinks.instagram}
          target="_blank"
          rel="noopener noreferrer"
        >
          {t.footer.instagram}
        </a>
        <p className="site-footer__rights">{t.footer.rights}</p>
      </div>
    </footer>
  );
}
