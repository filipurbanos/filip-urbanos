"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Reveal } from "@/components/Reveal";
import { Section } from "@/components/Section";
import { youtubeEmbedUrl, sortByDateDesc } from "@/lib/cms/dates";
import { isPlayableMediaUrl } from "@/lib/cms/media-url";
import { useLocale } from "@/lib/locale";
import type { Album, Photo, Video } from "@/lib/cms/types";

type MediaAlbumsProps = {
  albums: Album[];
  photos: Photo[];
  videos: Video[];
};

function LocalVideo({ src, title }: { src: string; title: string }) {
  const [orientation, setOrientation] = useState<"landscape" | "portrait">(
    "landscape",
  );

  return (
    <div
      className={`album-video__embed ${
        orientation === "portrait" ? "album-video__embed--portrait" : ""
      }`}
    >
      <video
        controls
        playsInline
        preload="metadata"
        src={src}
        onLoadedMetadata={(e) => {
          const el = e.currentTarget;
          if (el.videoHeight > el.videoWidth) {
            setOrientation("portrait");
          }
        }}
      >
        {title}
      </video>
    </div>
  );
}

export function MediaAlbums({ albums, photos, videos }: MediaAlbumsProps) {
  const { t } = useLocale();
  const sortedAlbums = useMemo(() => sortByDateDesc(albums), [albums]);
  const [activeId, setActiveId] = useState<string>("all");

  const filteredPhotos = useMemo(() => {
    if (activeId === "all") return photos;
    if (activeId === "none") return photos.filter((photo) => !photo.albumId);
    return photos.filter((photo) => photo.albumId === activeId);
  }, [activeId, photos]);

  const filteredVideos = useMemo(() => {
    if (activeId === "all") return videos;
    if (activeId === "none") return videos.filter((video) => !video.albumId);
    return videos.filter((video) => video.albumId === activeId);
  }, [activeId, videos]);

  const activeAlbum =
    activeId !== "all" && activeId !== "none"
      ? sortedAlbums.find((album) => album.id === activeId)
      : null;

  const hasUncategorized =
    photos.some((photo) => !photo.albumId) ||
    videos.some((video) => !video.albumId);

  const empty =
    filteredPhotos.length === 0 && filteredVideos.length === 0;

  return (
    <Section id="gallery" className="media albums-section section--after-banner">
      <div className="album-tabs" role="tablist" aria-label={t.albums.tabsLabel}>
        <button
          type="button"
          role="tab"
          aria-selected={activeId === "all"}
          className={activeId === "all" ? "is-active" : ""}
          onClick={() => setActiveId("all")}
        >
          {t.albums.all}
        </button>
        {sortedAlbums.map((album) => (
          <button
            key={album.id}
            type="button"
            role="tab"
            aria-selected={activeId === album.id}
            className={activeId === album.id ? "is-active" : ""}
            onClick={() => setActiveId(album.id)}
          >
            {album.title}
          </button>
        ))}
        {hasUncategorized ? (
          <button
            type="button"
            role="tab"
            aria-selected={activeId === "none"}
            className={activeId === "none" ? "is-active" : ""}
            onClick={() => setActiveId("none")}
          >
            {t.albums.uncategorized}
          </button>
        ) : null}
      </div>

      {activeAlbum ? (
        <Reveal>
          <div className="album-intro">
            {activeAlbum.date ? (
              <p className="album-intro__date">{activeAlbum.date}</p>
            ) : null}
            <h2 className="album-intro__title">{activeAlbum.title}</h2>
            {activeAlbum.description ? (
              <p className="album-intro__lead">{activeAlbum.description}</p>
            ) : null}
          </div>
        </Reveal>
      ) : null}

      {empty ? (
        <Reveal delay={80}>
          <p className="placeholder-note">{t.albums.empty}</p>
        </Reveal>
      ) : (
        <>
          {filteredPhotos.length > 0 ? (
            <div className="gallery-grid gallery-grid--flush">
              {filteredPhotos.map((photo, i) => (
                <Reveal key={photo.id} delay={i * 40}>
                  <figure className="gallery-item">
                    <div className="gallery-item__media">
                      <Image
                        src={photo.src}
                        alt={photo.alt}
                        fill
                        sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw"
                      />
                    </div>
                    {photo.caption ? (
                      <figcaption>{photo.caption}</figcaption>
                    ) : null}
                  </figure>
                </Reveal>
              ))}
            </div>
          ) : null}

          {filteredVideos.length > 0 ? (
            <div className="album-videos">
              <h3 className="album-videos__title">{t.albums.videosLabel}</h3>
              <div className="album-video-grid">
                {filteredVideos.map((video, i) => {
                  const embed = youtubeEmbedUrl(video.url);
                  const isLocal = isPlayableMediaUrl(video.url);                  return (
                    <Reveal key={video.id} delay={i * 50}>
                      <article className="album-video">
                        {embed ? (
                          <div className="album-video__embed">
                            <iframe
                              src={embed}
                              title={video.title}
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          </div>
                        ) : isLocal ? (
                          <LocalVideo src={video.url} title={video.title} />
                        ) : (
                          <a
                            className="album-video__link"
                            href={video.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {video.title} ↗
                          </a>
                        )}
                        <h4>{video.title}</h4>
                        {video.description ? <p>{video.description}</p> : null}
                      </article>
                    </Reveal>
                  );
                })}
              </div>
            </div>
          ) : null}
        </>
      )}
    </Section>
  );
}
