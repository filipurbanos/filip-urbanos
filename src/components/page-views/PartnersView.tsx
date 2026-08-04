"use client";

import { PageBanner } from "@/components/PageBanner";
import {
  Collaborate,
  Community,
  MediaKit,
  PartnersList,
  Sponsors,
} from "@/components/SiteSections";
import type { Partner } from "@/lib/cms/types";
import { useLocale } from "@/lib/locale";
import { mediaAssets } from "@/lib/media";

export function PartnersView({ partners }: { partners: Partner[] }) {
  const { t, locale } = useLocale();

  return (
    <>
      <PageBanner
        eyebrow={t.partners.eyebrow}
        title={t.partners.title}
        outlineTitle={
          locale === "sk" ? "Spoločná cesta." : "Shared journey."
        }
        lead={t.partners.lead}
        imageSrc={mediaAssets.partners}
      />
      <PartnersList partners={partners} />
      <Sponsors />
      <MediaKit />
      <Collaborate />
      <Community />
    </>
  );
}
