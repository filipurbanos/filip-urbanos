"use client";

import { Journey } from "@/components/AthleteSections";
import { PageBanner } from "@/components/PageBanner";
import { useLocale } from "@/lib/locale";
import { mediaAssets } from "@/lib/media";

export function JourneyView() {
  const { t } = useLocale();

  return (
    <>
      <PageBanner
        eyebrow={t.journey.eyebrow}
        title={t.journey.title}
        outlineTitle={t.journey.outlineTitle}
        lead={t.journey.lead}
        imageSrc={mediaAssets.journey}
      />
      <Journey omitHeader />
    </>
  );
}
