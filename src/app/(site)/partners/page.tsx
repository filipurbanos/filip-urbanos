import { PartnersView } from "@/components/page-views/PartnersView";
import { readCmsCached } from "@/lib/cms/store";
import { routes } from "@/lib/routes";
import { buildPageMetadata } from "@/lib/page-meta";

export async function generateMetadata() {
  return buildPageMetadata({
    path: routes.partners,
    title: {
      sk: "Partneri",
      en: "Partners",
    },
    description: {
      sk: "Partneri, sponzoring, media kit a spolupráca s Filipom Urbánošom.",
      en: "Partners, sponsorship, media kit, and collaboration with Filip Urbanos.",
    },
  });
}

export default async function PartnersPage() {
  const data = await readCmsCached();

  return (
    <div className="page">
      <PartnersView partners={data.partners} />
    </div>
  );
}
