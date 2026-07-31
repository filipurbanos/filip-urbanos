"use client";

import { mediaLinks } from "@/content";
import { useLocale } from "@/lib/locale";

export function Footer() {
  const { t } = useLocale();

  return (
    <footer className="site-footer">
      <div className="shell site-footer__inner">
        <div className="site-footer__brand-row">
          <span className="brand__mark" aria-hidden="true">
            FU
          </span>
          <p className="site-footer__brand">Filip Urbánoš</p>
        </div>
        <p className="site-footer__tag">{t.footer.tagline}</p>
        <a
          className="site-footer__ig"
          href={mediaLinks.instagram}
          target="_blank"
          rel="noopener noreferrer"
        >
          Instagram ↗
        </a>
        <p className="site-footer__rights">{t.footer.rights}</p>
      </div>
    </footer>
  );
}
