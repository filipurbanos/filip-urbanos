import { AboutView } from "@/components/page-views/AboutView";
import { routes } from "@/lib/routes";
import { buildPageMetadata } from "@/lib/page-meta";

export async function generateMetadata() {
  return buildPageMetadata({
    path: routes.about,
    title: {
      sk: "O Filipovi",
      en: "About Filip",
    },
    description: {
      sk: "O Filipovi Urbánošovi — ambícia, disciplína a rast slovenského juniorského tenistu.",
      en: "About Filip Urbanos — ambition, discipline, and growth of a Slovak junior tennis player.",
    },
  });
}

export default function AboutPage() {
  return (
    <div className="page">
      <AboutView />
    </div>
  );
}
