"use client";

import { Usa } from "@/components/AthleteSections";
import { PageBanner } from "@/components/PageBanner";
import { useLocale } from "@/lib/locale";
import { mediaAssets } from "@/lib/media";

export function UsaView() {
  const { t, locale } = useLocale();

  return (
    <>
      <PageBanner
        eyebrow={t.usa.eyebrow}
        title={t.usa.title}
        outlineTitle={locale === "sk" ? "Hard court. Škola." : "Hard court. School."}
        lead={t.usa.lead}
        imageSrc={mediaAssets.usa}
      />
      <Usa omitHeader />
    </>
  );
}
