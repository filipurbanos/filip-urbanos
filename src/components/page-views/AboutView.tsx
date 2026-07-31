"use client";

import { About, Profile, Training } from "@/components/AthleteSections";
import { PageBanner } from "@/components/PageBanner";
import { useLocale } from "@/lib/locale";
import { mediaAssets } from "@/lib/media";

export function AboutView() {
  const { t } = useLocale();

  return (
    <>
      <PageBanner
        eyebrow={t.about.eyebrow}
        title={t.about.title}
        lead={t.about.lead}
        imageSrc={mediaAssets.about}
      />
      <About omitHeader />
      <Profile />
      <Training />
    </>
  );
}
