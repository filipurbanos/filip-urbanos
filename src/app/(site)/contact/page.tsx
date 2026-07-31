import type { Metadata } from "next";
import { ContactView } from "@/components/page-views/ContactView";

export const metadata: Metadata = {
  title: "Kontakt",
  description:
    "Kontaktujte tím Filipa Urbánoša — médiá, recruiting a partnerstvá.",
};

export default function ContactPage() {
  return (
    <div className="page">
      <ContactView />
    </div>
  );
}
