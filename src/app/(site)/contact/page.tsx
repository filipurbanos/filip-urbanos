import { ContactView } from "@/components/page-views/ContactView";
import { routes } from "@/lib/routes";
import { buildPageMetadata } from "@/lib/page-meta";

export async function generateMetadata() {
  return buildPageMetadata({
    path: routes.contact,
    title: {
      sk: "Kontakt",
      en: "Contact",
    },
    description: {
      sk: "Kontaktujte tím Filipa Urbánoša — médiá, recruiting a partnerstvá.",
      en: "Contact Filip Urbanos’s team — media, recruiting, and partnerships.",
    },
  });
}

export default function ContactPage() {
  return (
    <div className="page">
      <ContactView />
    </div>
  );
}
