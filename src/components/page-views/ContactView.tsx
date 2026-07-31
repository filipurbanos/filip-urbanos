"use client";

import { PageBanner } from "@/components/PageBanner";
import { FlipBusinessCards } from "@/components/FlipBusinessCards";
import { Faq } from "@/components/SiteSections";
import { useLocale } from "@/lib/locale";
import { mediaAssets } from "@/lib/media";

export function ContactView() {
  const { t, locale } = useLocale();

  return (
    <>
      <PageBanner
        eyebrow={t.contact.eyebrow}
        title={locale === "sk" ? "Kontakt" : "Contact"}
        outlineTitle={locale === "sk" ? "Filip Urbánoš" : "Filip Urbanos"}
        lead={t.contact.lead}
        imageSrc={mediaAssets.about}
      />
      <FlipBusinessCards />
      <Faq />
    </>
  );
}
