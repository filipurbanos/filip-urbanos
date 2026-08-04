"use client";

import { ContactDetails } from "@/components/ContactDetails";
import { ContactForm } from "@/components/ContactForm";
import { PageBanner } from "@/components/PageBanner";
import { Faq } from "@/components/SiteSections";
import { useLocale } from "@/lib/locale";
import { mediaAssets } from "@/lib/media";

export function ContactView() {
  const { t } = useLocale();

  return (
    <>
      <PageBanner
        eyebrow={t.contact.eyebrow}
        title={t.contact.title}
        outlineTitle={t.contact.outlineTitle}
        lead={t.contact.lead}
        imageSrc={mediaAssets.contact}
      />
      <ContactForm flushTop />
      <ContactDetails />
      <Faq />
    </>
  );
}
