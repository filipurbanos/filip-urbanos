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

type ActiveView = "index" | "all" | "none" | string;

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

function coverForAlbum(photos: Photo[], albumId: string | null) {
  const list =
    albumId === null
      ? photos.filter((photo) => !photo.albumId)
      : photos.filter((photo) => photo.albumId === albumId);
  return list[0] ?? null;
}

function countLabel(
  photos: number,
  videos: number,
  labels: { photos: string; videos: string },
) {
  const parts: string[] = [];
  if (photos > 0) parts.push(`${photos} ${labels.photos}`);
  if (videos > 0) parts.push(`${videos} ${labels.videos}`);
  return parts.join(" · ");
}

export function MediaAlbums({ albums, photos, videos }: MediaAlbumsProps) {
  const { t, locale } = useLocale();
  const sortedAlbums = useMemo(() => sortByDateDesc(albums), [albums]);
  const [active, setActive] = useState<ActiveView>("index");

  const hasUncategorized =
    photos.some((photo) => !photo.albumId) ||
    videos.some((video) => !video.albumId);

  const albumStats = useMemo(() => {
    return sortedAlbums.map((album) => {
      const albumPhotos = photos.filter((photo) => photo.albumId === album.id);
      const albumVideos = videos.filter((video) => video.albumId === album.id);
      return {
        album,
        photoCount: albumPhotos.length,
        videoCount: albumVideos.length,
        cover: coverForAlbum(photos, album.id),
      };
    });
  }, [sortedAlbums, photos, videos]);

  const uncategorizedStats = useMemo(() => {
    const albumPhotos = photos.filter((photo) => !photo.albumId);
    const albumVideos = videos.filter((video) => !video.albumId);
    return {
      photoCount: albumPhotos.length,
      videoCount: albumVideos.length,
      cover: coverForAlbum(photos, null),
    };
  }, [photos, videos]);

  const filteredPhotos = useMemo(() => {
    if (active === "index") return [];
    if (active === "all") return photos;
    if (active === "none") return photos.filter((photo) => !photo.albumId);
    return photos.filter((photo) => photo.albumId === active);
  }, [active, photos]);

  const filteredVideos = useMemo(() => {
    if (active === "index") return [];
    if (active === "all") return videos;
    if (active === "none") return videos.filter((video) => !video.albumId);
    return videos.filter((video) => video.albumId === active);
  }, [active, videos]);

  const activeAlbum =
    active !== "index" && active !== "all" && active !== "none"
      ? sortedAlbums.find((album) => album.id === active)
      : null;

  const empty =
    active !== "index" &&
    filteredPhotos.length === 0 &&
    filteredVideos.length === 0;

  const countLabels = {
    photos: locale === "sk" ? "fotiek" : "photos",
    videos: locale === "sk" ? "videí" : "videos",
  };

  const detailTitle =
    active === "all"
      ? t.albums.all
      : active === "none"
        ? t.albums.uncategorized
        : activeAlbum?.title;

  const detailDate = activeAlbum?.date || null;

  const detailLead =
    active === "all"
      ? t.albums.allLead
      : active === "none"
        ? null
        : activeAlbum?.description || null;

  return (
    <Section id="gallery" className="media albums-section section--after-banner">
      {active === "index" ? (
        <>
          <Reveal>
            <p className="album-index__label">{t.albums.indexLabel}</p>
          </Reveal>
          <ul className="album-index">
            <Reveal>
              <li>
                <button
                  type="button"
                  className="album-row"
                  onClick={() => setActive("all")}
                >
                  <span className="album-row__cover album-row__cover--all" aria-hidden="true" />
                  <span className="album-row__body">
                    <span className="album-row__title">{t.albums.all}</span>
                    <span className="album-row__meta">
                      {countLabel(photos.length, videos.length, countLabels) ||
                        t.albums.empty}
                    </span>
                  </span>
                  <span className="album-row__open" aria-hidden="true">
                    ↗
                  </span>
                </button>
              </li>
            </Reveal>

            {albumStats.map(({ album, photoCount, videoCount, cover }, i) => (
              <Reveal key={album.id} delay={40 + i * 40}>
                <li>
                  <button
                    type="button"
                    className="album-row"
                    onClick={() => setActive(album.id)}
                  >
                    <span className="album-row__cover">
                      {cover ? (
                        <Image
                          src={cover.src}
                          alt=""
                          fill
                          sizes="96px"
                          style={{ objectFit: "cover" }}
                        />
                      ) : null}
                    </span>
                    <span className="album-row__body">
                      {album.date ? (
                        <span className="album-row__date">{album.date}</span>
                      ) : null}
                      <span className="album-row__title">{album.title}</span>
                      <span className="album-row__meta">
                        {countLabel(photoCount, videoCount, countLabels) ||
                          t.albums.empty}
                      </span>
                    </span>
                    <span className="album-row__open" aria-hidden="true">
                      ↗
                    </span>
                  </button>
                </li>
              </Reveal>
            ))}

            {hasUncategorized ? (
              <Reveal delay={40 + albumStats.length * 40}>
                <li>
                  <button
                    type="button"
                    className="album-row"
                    onClick={() => setActive("none")}
                  >
                    <span className="album-row__cover">
                      {uncategorizedStats.cover ? (
                        <Image
                          src={uncategorizedStats.cover.src}
                          alt=""
                          fill
                          sizes="96px"
                          style={{ objectFit: "cover" }}
                        />
                      ) : null}
                    </span>
                    <span className="album-row__body">
                      <span className="album-row__title">
                        {t.albums.uncategorized}
                      </span>
                      <span className="album-row__meta">
                        {countLabel(
                          uncategorizedStats.photoCount,
                          uncategorizedStats.videoCount,
                          countLabels,
                        )}
                      </span>
                    </span>
                    <span className="album-row__open" aria-hidden="true">
                      ↗
                    </span>
                  </button>
                </li>
              </Reveal>
            ) : null}
          </ul>

          {sortedAlbums.length === 0 && !hasUncategorized && photos.length === 0 ? (
            <Reveal delay={80}>
              <p className="placeholder-note">{t.albums.emptyIndex}</p>
            </Reveal>
          ) : null}
        </>
      ) : (
        <>
          <Reveal>
            <button
              type="button"
              className="album-back"
              onClick={() => setActive("index")}
            >
              ← {t.albums.back}
            </button>
          </Reveal>

          <Reveal delay={40}>
            <div className="album-intro">
              {detailDate ? (
                <p className="album-intro__date">{detailDate}</p>
              ) : null}
              {detailTitle ? (
                <h2 className="album-intro__title">{detailTitle}</h2>
              ) : null}
              {detailLead ? (
                <p className="album-intro__lead">{detailLead}</p>
              ) : null}
            </div>
          </Reveal>

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
                      const isLocal = isPlayableMediaUrl(video.url);
                      return (
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
        </>
      )}
    </Section>
  );
}
