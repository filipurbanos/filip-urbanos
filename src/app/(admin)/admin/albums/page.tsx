"use client";

import { useEffect, useMemo, useState } from "react";
import type { Album, Photo, Tournament, Video } from "@/lib/cms/types";
import { sortByDateDesc } from "@/lib/cms/dates";

const blank = {
  title: "",
  date: "",
  description: "",
};

export default function AdminAlbumsPage() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [form, setForm] = useState(blank);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [syncNote, setSyncNote] = useState("");
  const [syncing, setSyncing] = useState(false);

  async function load() {
    const [albumsRes, tournamentsRes, photosRes, videosRes] = await Promise.all([
      fetch("/api/admin/albums"),
      fetch("/api/admin/tournaments"),
      fetch("/api/admin/photos"),
      fetch("/api/admin/videos"),
    ]);

    if (albumsRes.ok) {
      const data = (await albumsRes.json()) as { albums: Album[] };
      setAlbums(data.albums);
    }
    if (tournamentsRes.ok) {
      const data = (await tournamentsRes.json()) as { tournaments: Tournament[] };
      setTournaments(data.tournaments);
    }
    if (photosRes.ok) {
      const data = (await photosRes.json()) as { photos: Photo[] };
      setPhotos(data.photos);
    }
    if (videosRes.ok) {
      const data = (await videosRes.json()) as { videos: Video[] };
      setVideos(data.videos);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  const sorted = useMemo(() => sortByDateDesc(albums), [albums]);

  async function syncFromSeed() {
    setError("");
    setSyncNote("");
    setSyncing(true);
    try {
      const res = await fetch("/api/admin/albums/sync-seed", { method: "POST" });
      if (!res.ok) {
        setError("Sync zo seedu zlyhal");
        return;
      }
      const data = (await res.json()) as {
        addedAlbums: string[];
        linkedTournaments: string[];
        linkedVideos: string[];
        albums?: Album[];
      };
      const parts = [
        data.addedAlbums.length
          ? `albumy: ${data.addedAlbums.join(", ")}`
          : "žiadne nové albumy",
        data.linkedTournaments.length
          ? `turnaje: ${data.linkedTournaments.length}`
          : null,
        data.linkedVideos.length
          ? `videá: ${data.linkedVideos.length}`
          : null,
      ].filter(Boolean);
      setSyncNote(`Sync hotový — ${parts.join(" · ")}`);
      if (data.albums) {
        setAlbums(data.albums);
      }
      await load();
    } finally {
      setSyncing(false);
    }
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/admin/albums", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingId ? { ...form, id: editingId } : form),
    });
    if (!res.ok) {
      setError("Uloženie zlyhalo");
      return;
    }
    const data = (await res.json()) as { albums: Album[] };
    setAlbums(data.albums);
    setForm(blank);
    setEditingId(null);
  }

  async function remove(id: string) {
    if (
      !confirm(
        "Zmazať album? Fotky a videá ostanú, len sa odpoja od albumu.",
      )
    ) {
      return;
    }
    const res = await fetch(`/api/admin/albums?id=${id}`, { method: "DELETE" });
    if (!res.ok) return;
    const data = (await res.json()) as { albums: Album[] };
    setAlbums(data.albums);
  }

  function edit(item: Album) {
    setEditingId(item.id);
    setForm({
      title: item.title,
      date: item.date,
      description: item.description,
    });
  }

  function albumStats(albumId: string) {
    return {
      photos: photos.filter((photo) => photo.albumId === albumId).length,
      videos: videos.filter((video) => video.albumId === albumId).length,
      tournaments: tournaments.filter((tournament) => tournament.albumId === albumId),
    };
  }

  return (
    <div className="admin-page">
      <h1>Albumy</h1>
      <p className="admin-lead">
        Zoskup fotky a videá z jednej akcie (turnaj, tréning, USA…). Na webe sa
        zobrazia ako záložky. Keď album priradíš turnaju v admin → Turnaje,
        zobrazí sa aj po rozkliknutí výsledku.
      </p>
      <div className="admin-form__actions" style={{ marginBottom: "1.25rem" }}>
        <button
          type="button"
          className="btn btn--admin-action"
          disabled={syncing}
          onClick={() => void syncFromSeed()}
        >
          {syncing ? "Sync…" : "Doplniť albumy zo seedu"}
        </button>
      </div>
      {syncNote ? <p className="admin-success">{syncNote}</p> : null}

      <form className="admin-form" onSubmit={save}>
        <div className="admin-form__grid">
          <label>
            Názov
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="UTR Florida 2026"
              required
            />
          </label>
          <label>
            Dátum
            <input
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              placeholder="2026-08"
            />
          </label>
          <label className="admin-form__wide">
            Popis
            <input
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Krátky popis akcie"
            />
          </label>
        </div>
        {error ? <p className="admin-error">{error}</p> : null}
        <div className="admin-form__actions">
          <button className="btn btn--primary" type="submit">
            {editingId ? "Uložiť album" : "Pridať album"}
          </button>
          {editingId ? (
            <button
              type="button"
              className="btn btn--admin-ghost"
              onClick={() => {
                setEditingId(null);
                setForm(blank);
              }}
            >
              Zrušiť
            </button>
          ) : null}
        </div>
      </form>

      <div className="admin-table">
        {sorted.map((album) => {
          const stats = albumStats(album.id);
          return (
            <article key={album.id} className="admin-row">
              <div>
                <strong>
                  {album.date ? `${album.date} · ` : ""}
                  {album.title}
                </strong>
                {album.description ? <p>{album.description}</p> : null}
                <p className="admin-muted">
                  {stats.photos} fotiek · {stats.videos} videí
                  {stats.tournaments.length
                    ? ` · turnaj: ${stats.tournaments.map((t) => t.event).join(", ")}`
                    : " · zatiaľ bez priradeného turnaja"}
                </p>
              </div>
              <div className="admin-row__actions">
                <button type="button" onClick={() => edit(album)}>
                  Upraviť
                </button>
                <button type="button" onClick={() => remove(album.id)}>
                  Zmazať
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
