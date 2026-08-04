"use client";

import { MediaAlbums } from "@/components/MediaAlbums";
import { PageBanner } from "@/components/PageBanner";
import { Press } from "@/components/SiteSections";
import { useLocale } from "@/lib/locale";
import { mediaAssets } from "@/lib/media";
import type { Album, Photo, Video } from "@/lib/cms/types";

export function MediaView({
  albums,
  photos,
  videos,
}: {
  albums: Album[];
  photos: Photo[];
  videos: Video[];
}) {
  const { t } = useLocale();

  return (
    <>
      <PageBanner
        eyebrow={t.gallery.eyebrow}
        title={t.gallery.title}
        outlineTitle={t.gallery.outlineTitle}
        lead={t.gallery.lead}
        imageSrc={mediaAssets.media}
      />
      <MediaAlbums albums={albums} photos={photos} videos={videos} />
      <Press />
    </>
  );
}
