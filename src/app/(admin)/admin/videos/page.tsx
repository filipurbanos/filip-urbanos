"use client";

import { upload } from "@vercel/blob/client";
import { useEffect, useState } from "react";
import type { Album, Video } from "@/lib/cms/types";
import { sortByDateDesc } from "@/lib/cms/dates";
import { isManagedUploadUrl } from "@/lib/cms/media-url";

function makeUploadName(file: File) {
  const ext =
    file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") ||
    "mp4";
  const id = `vid_${Date.now().toString(36)}_${Math.random()
    .toString(36)
    .slice(2, 8)}`;
  return `uploads/${id}.${ext === "qt" ? "mov" : ext}`;
}

export default function AdminVideosPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [albumId, setAlbumId] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [uploadMode, setUploadMode] = useState<"blob-client" | "server">(
    "server",
  );

  async function load() {
    const [videosRes, albumsRes, configRes] = await Promise.all([
      fetch("/api/admin/videos"),
      fetch("/api/admin/albums"),
      fetch("/api/admin/upload-config"),
    ]);
    if (videosRes.ok) {
      const data = (await videosRes.json()) as { videos: Video[] };
      setVideos(data.videos);
    }
    if (albumsRes.ok) {
      const data = (await albumsRes.json()) as { albums: Album[] };
      setAlbums(sortByDateDesc(data.albums));
    }
    if (configRes.ok) {
      const data = (await configRes.json()) as {
        mode: "blob-client" | "server";
      };
      setUploadMode(data.mode);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setProgress(null);
    if (!file && !url.trim()) {
      setError("Nahraj súbor z disku alebo vyplň URL");
      return;
    }
    const maxBytes = 150 * 1024 * 1024;
    if (file && file.size > maxBytes) {
      setError("Video je príliš veľké (max 150 MB)");
      return;
    }
    setLoading(true);
    try {
      let res: Response;

      if (file && uploadMode === "blob-client") {
        const pathname = makeUploadName(file);
        const blob = await upload(pathname, file, {
          access: "public",
          handleUploadUrl: "/api/admin/blob-upload",
          multipart: true,
          contentType: file.type || "video/mp4",
          onUploadProgress: ({ percentage }) => {
            setProgress(Math.round(percentage));
          },
        });

        res = await fetch("/api/admin/videos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: title || file.name.replace(/\.[^.]+$/, "") || "Video",
            url: blob.url,
            description,
            albumId,
          }),
        });
      } else if (file) {
        const qs = new URLSearchParams({
          title,
          description,
          albumId,
        });
        res = await fetch(`/api/admin/videos?${qs}`, {
          method: "POST",
          headers: {
            "Content-Type": file.type || "application/octet-stream",
            "x-file-name": encodeURIComponent(file.name),
          },
          body: file,
        });
      } else {
        res = await fetch("/api/admin/videos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, url, description, albumId }),
        });
      }

      const data = (await res.json().catch(() => null)) as
        | { videos?: Video[]; error?: string }
        | null;
      if (!res.ok) {
        setError(data?.error || `Uloženie zlyhalo (${res.status})`);
        return;
      }
      setVideos(data?.videos || []);
      setTitle("");
      setUrl("");
      setDescription("");
      setFile(null);
      setProgress(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "";
      setError(
        message
          ? `Upload zlyhal: ${message}`
          : "Upload zlyhal — skontroluj veľkosť súboru a skús znova.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Zmazať video?")) return;
    const res = await fetch(`/api/admin/videos?id=${id}`, { method: "DELETE" });
    if (!res.ok) return;
    const data = (await res.json()) as { videos: Video[] };
    setVideos(data.videos);
  }

  function albumTitle(id: string) {
    if (!id) return "Bez albumu";
    return albums.find((album) => album.id === id)?.title || "Album";
  }

  return (
    <div className="admin-page">
      <h1>Videá</h1>
      <p className="admin-lead">
        Nahraj video z disku (MP4 / WebM / MOV, max ~150 MB) alebo vlož odkaz na
        YouTube / Vimeo (odporúčané pre dlhé videá). Na Vercel ide veľký súbor
        priamo do Blob (obíde limit 4,5 MB na API).
      </p>

      <form className="admin-form" onSubmit={save}>
        <div className="admin-form__grid">
          <label>
            Názov
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </label>
          <label>
            Album
            <select
              value={albumId}
              onChange={(e) => setAlbumId(e.target.value)}
            >
              <option value="">Bez albumu</option>
              {albums.map((album) => (
                <option key={album.id} value={album.id}>
                  {album.date ? `${album.date} · ` : ""}
                  {album.title}
                </option>
              ))}
            </select>
          </label>
          <label className="admin-form__wide">
            Súbor z disku
            <input
              type="file"
              accept="video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov,.m4v"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </label>
          <label className="admin-form__wide">
            Alebo URL (YouTube / Vimeo / …)
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://..."
              disabled={Boolean(file)}
            />
          </label>
          <label className="admin-form__wide">
            Popis
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Krátky popis videa"
            />
          </label>
        </div>
        {file ? (
          <p className="admin-muted">
            Vybraný súbor: {file.name} ({Math.round(file.size / 1024 / 1024)} MB)
            {uploadMode === "blob-client" ? " · priamy Blob upload" : ""}
          </p>
        ) : null}
        {progress !== null ? (
          <p className="admin-muted">Nahrávam… {progress}%</p>
        ) : null}
        {error ? <p className="admin-error">{error}</p> : null}
        <button className="btn btn--primary" type="submit" disabled={loading}>
          {loading ? "Nahrávam…" : "Pridať video"}
        </button>
      </form>

      <div className="admin-table">
        {videos.map((video) => (
          <article key={video.id} className="admin-row">
            <div>
              <strong>{video.title}</strong>
              <p>
                {albumTitle(video.albumId)}
                {video.description ? ` · ${video.description}` : ""}
                {isManagedUploadUrl(video.url) ? " · súbor" : " · odkaz"}
              </p>
              <p>
                {video.url.startsWith("http") || video.url.startsWith("/") ? (
                  <a href={video.url} target="_blank" rel="noopener noreferrer">
                    {video.url}
                  </a>
                ) : (
                  <span>{video.url}</span>
                )}
              </p>
            </div>
            <div className="admin-row__actions">
              <button type="button" onClick={() => remove(video.id)}>
                Zmazať
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
