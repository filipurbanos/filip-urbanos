"use client";

import { useEffect, useMemo, useState } from "react";
import type { Album } from "@/lib/cms/types";
import { sortByDateDesc } from "@/lib/cms/dates";

const blank = {
  title: "",
  date: "",
  description: "",
};

export default function AdminAlbumsPage() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [form, setForm] = useState(blank);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function load() {
    const res = await fetch("/api/admin/albums");
    if (!res.ok) return;
    const data = (await res.json()) as { albums: Album[] };
    setAlbums(data.albums);
  }

  useEffect(() => {
    void load();
  }, []);

  const sorted = useMemo(() => sortByDateDesc(albums), [albums]);

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

  return (
    <div className="admin-page">
      <h1>Albumy</h1>
      <p className="admin-lead">
        Zoskup fotky a videá z jednej akcie (turnaj, tréning, USA…). Na webe sa
        zobrazia ako záložky.
      </p>

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
        {sorted.map((album) => (
          <article key={album.id} className="admin-row">
            <div>
              <strong>
                {album.date ? `${album.date} · ` : ""}
                {album.title}
              </strong>
              {album.description ? <p>{album.description}</p> : null}
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
        ))}
      </div>
    </div>
  );
}
