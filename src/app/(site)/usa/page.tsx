import { UsaView } from "@/components/page-views/UsaView";
import { routes } from "@/lib/routes";
import { buildPageMetadata } from "@/lib/page-meta";

export async function generateMetadata() {
  return buildPageMetadata({
    path: routes.usa,
    title: {
      sk: "USA",
      en: "USA",
    },
    description: {
      sk: "USA kapitola Filipa Urbánoša — štúdium a tenis v Spojených štátoch.",
      en: "Filip Urbanos’s USA chapter — study and tennis in the United States.",
    },
  });
}

export default function UsaPage() {
  return (
    <div className="page">
      <UsaView />
    </div>
  );
}
