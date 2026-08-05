import { MediaView } from "@/components/page-views/MediaView";
import { readCms } from "@/lib/cms/store";
import { routes } from "@/lib/routes";
import { buildPageMetadata } from "@/lib/page-meta";

export async function generateMetadata() {
  return buildPageMetadata({
    path: routes.media,
    title: {
      sk: "Média",
      en: "Media",
    },
    description: {
      sk: "Fotogaléria, videá, novinky a mediálne výstupy Filipa Urbánoša.",
      en: "Photo gallery, videos, news, and media coverage of Filip Urbanos.",
    },
  });
}

export const dynamic = "force-dynamic";

export default async function MediaPage() {
  const data = await readCms();

  return (
    <div className="page">
      <MediaView
        albums={data.albums}
        photos={data.photos}
        videos={data.videos}
      />
    </div>
  );
}
