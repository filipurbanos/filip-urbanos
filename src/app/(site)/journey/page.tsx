import { JourneyView } from "@/components/page-views/JourneyView";
import { routes } from "@/lib/routes";
import { buildPageMetadata } from "@/lib/page-meta";

export async function generateMetadata() {
  return buildPageMetadata({
    path: routes.journey,
    title: {
      sk: "Športová cesta",
      en: "Journey",
    },
    description: {
      sk: "Športová cesta Filipa Urbánoša — od Slovenska cez Barcelonu do USA.",
      en: "Filip Urbanos’s journey — from Slovakia through Barcelona to the USA.",
    },
  });
}

export default function JourneyPage() {
  return (
    <div className="page">
      <JourneyView />
    </div>
  );
}
