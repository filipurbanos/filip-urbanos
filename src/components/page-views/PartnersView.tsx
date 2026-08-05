"use client";

import { PageBanner } from "@/components/PageBanner";
import { PartnersList, Sponsors } from "@/components/SiteSections";
import type { Partner } from "@/lib/cms/types";
import { useLocale } from "@/lib/locale";
import { mediaAssets } from "@/lib/media";

export function PartnersView({ partners }: { partners: Partner[] }) {
  const { t } = useLocale();

  return (
    <>
      <PageBanner
        eyebrow={t.partners.eyebrow}
        title={t.partners.title}
        outlineTitle={t.partners.outlineTitle}
        lead={t.partners.lead}
        imageSrc={mediaAssets.partners}
      />
      <PartnersList partners={partners} />
      <Sponsors />
    </>
  );
}
