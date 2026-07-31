"use client";

import { useEffect, useState } from "react";
import type { Album, Photo } from "@/lib/cms/types";
import { sortByDateDesc } from "@/lib/cms/dates";

export default function AdminGalleryPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [alt, setAlt] = useState("");
  const [caption, setCaption] = useState("");
  const [albumId, setAlbumId] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function load() {
    const [photosRes, albumsRes] = await Promise.all([
      fetch("/api/admin/photos"),
      fetch("/api/admin/albums"),
    ]);
    if (photosRes.ok) {
      const data = (await photosRes.json()) as { photos: Photo[] };
      setPhotos(data.photos);
    }
    if (albumsRes.ok) {
      const data = (await albumsRes.json()) as { albums: Album[] };
      setAlbums(sortByDateDesc(data.albums));
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function upload(e: React.FormEvent) {
    e.preventDefault();
    if (!file) {
      setError("Vyber súbor");
      return;
    }
    setLoading(true);
    setError("");
    const form = new FormData();
    form.set("file", file);
    form.set("alt", alt);
    form.set("caption", caption);
    form.set("albumId", albumId);
    const res = await fetch("/api/admin/photos", { method: "POST", body: form });
    setLoading(false);
    if (!res.ok) {
      setError("Upload zlyhal");
      return;
    }
    const data = (await res.json()) as { photos: Photo[] };
    setPhotos(data.photos);
    setFile(null);
    setAlt("");
    setCaption("");
  }

  async function remove(id: string) {
    if (!confirm("Zmazať fotku?")) return;
    const res = await fetch(`/api/admin/photos?id=${id}`, { method: "DELETE" });
    if (!res.ok) return;
    const data = (await res.json()) as { photos: Photo[] };
    setPhotos(data.photos);
  }

  function albumTitle(id: string) {
    if (!id) return "Bez albumu";
    return albums.find((album) => album.id === id)?.title || "Album";
  }

  return (
    <div className="admin-page">
      <h1>Fotky</h1>
      <p className="admin-lead">
        Nahraj fotku a priraď ju k albumu (akcii). Albumy spravuješ v Admin →
        Albumy.
      </p>

      <form className="admin-form" onSubmit={upload}>
        <div className="admin-form__grid">
          <label className="admin-form__wide">
            Súbor
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
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
          <label>
            Alt text
            <input value={alt} onChange={(e) => setAlt(e.target.value)} />
          </label>
          <label className="admin-form__wide">
            Popis
            <input
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
          </label>
        </div>
        {error ? <p className="admin-error">{error}</p> : null}
        <button className="btn btn--primary" type="submit" disabled={loading}>
          {loading ? "Nahrávam…" : "Nahrať fotku"}
        </button>
      </form>

      <div className="admin-photo-grid">
        {photos.map((photo) => (
          <article key={photo.id} className="admin-photo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photo.src} alt={photo.alt} />
            <div>
              <p>{photo.caption || photo.alt}</p>
              <p className="admin-muted">{albumTitle(photo.albumId)}</p>
              <button type="button" onClick={() => remove(photo.id)}>
                Zmazať
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
