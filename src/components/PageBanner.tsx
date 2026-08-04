"use client";

import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import { useEffect, useState } from "react";

type PageBannerProps = {
  eyebrow: string;
  title: string;
  lead: string;
  outlineTitle?: string;
  imageSrc?: string;
  tone?: "light" | "dark";
};

export function PageBanner({
  eyebrow,
  title,
  lead,
  outlineTitle,
  imageSrc,
  tone = "dark",
}: PageBannerProps) {
  const [src, setSrc] = useState<string | null>(imageSrc ?? null);

  useEffect(() => {
    setSrc(imageSrc ?? null);
  }, [imageSrc]);

  return (
    <section className={`page-banner page-banner--${tone}`}>
      <div className="page-banner__media" aria-hidden="true">
        {src ? (
          <Image
            src={src}
            alt=""
            fill
            priority
            sizes="100vw"
            className="page-banner__img"
            onError={() => setSrc(null)}
          />
        ) : (
          <div className="page-banner__fallback" />
        )}
        <div className="page-banner__veil" />
      </div>
      <div className="shell page-banner__content">
        <Reveal>
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="page-banner__title">{title}</h1>
          {outlineTitle ? (
            <p className="page-banner__outline">{outlineTitle}</p>
          ) : null}
          <p className="page-banner__lead">{lead}</p>
        </Reveal>
      </div>
    </section>
  );
}
