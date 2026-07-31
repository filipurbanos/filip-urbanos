import type { Metadata } from "next";
import { MediaView } from "@/components/page-views/MediaView";
import { readCms } from "@/lib/cms/store";

export const metadata: Metadata = {
  title: "Média",
  description:
    "Fotogaléria, videá, novinky a mediálne výstupy Filipa Urbánoša.",
};

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
