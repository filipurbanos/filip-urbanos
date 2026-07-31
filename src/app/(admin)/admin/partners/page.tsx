"use client";

import { useEffect, useState } from "react";
import type { Partner, PartnerTier } from "@/lib/cms/types";

const blank = {
  name: "",
  url: "",
  description: "",
  tier: "partner" as PartnerTier,
  order: 10,
};

export default function AdminPartnersPage() {
  const [items, setItems] = useState<Partner[]>([]);
  const [form, setForm] = useState(blank);
  const [logo, setLogo] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function load() {
    const res = await fetch("/api/admin/partners");
    if (!res.ok) return;
    const data = (await res.json()) as { partners: Partner[] };
    setItems(data.partners);
  }

  useEffect(() => {
    void load();
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const body = new FormData();
    if (editingId) body.set("id", editingId);
    body.set("name", form.name);
    body.set("url", form.url);
    body.set("description", form.description);
    body.set("tier", form.tier);
    body.set("order", String(form.order));
    if (logo) body.set("logo", logo);

    const res = await fetch("/api/admin/partners", { method: "POST", body });
    setLoading(false);
    if (!res.ok) {
      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      setError(data?.error || "Uloženie zlyhalo");
      return;
    }
    const data = (await res.json()) as { partners: Partner[] };
    setItems(data.partners);
    setForm(blank);
    setLogo(null);
    setEditingId(null);
  }

  async function remove(id: string) {
    if (!confirm("Zmazať partnera?")) return;
    const res = await fetch(`/api/admin/partners?id=${id}`, { method: "DELETE" });
    if (!res.ok) return;
    const data = (await res.json()) as { partners: Partner[] };
    setItems(data.partners);
  }

  function edit(item: Partner) {
    setEditingId(item.id);
    setForm({
      name: item.name,
      url: item.url,
      description: item.description,
      tier: item.tier,
      order: item.order,
    });
    setLogo(null);
  }

  return (
    <div className="admin-page">
      <h1>Partneri</h1>
      <p className="admin-lead">
        Hlavný partner a ďalší sponzori. Logo je voliteľné — bez loga sa zobrazí
        názov.
      </p>

      <form className="admin-form" onSubmit={save}>
        <div className="admin-form__grid">
          <label>
            Názov
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </label>
          <label>
            Web URL
            <input
              value={form.url}
              onChange={(e) => setForm({ ...form, url: e.target.value })}
              placeholder="https://"
            />
          </label>
          <label>
            Úroveň
            <select
              value={form.tier}
              onChange={(e) =>
                setForm({ ...form, tier: e.target.value as PartnerTier })
              }
            >
              <option value="main">Hlavný partner</option>
              <option value="partner">Partner</option>
            </select>
          </label>
          <label>
            Poradie
            <input
              type="number"
              value={form.order}
              onChange={(e) =>
                setForm({ ...form, order: Number(e.target.value) })
              }
            />
          </label>
          <label className="admin-form__wide">
            Popis
            <input
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </label>
          <label className="admin-form__wide">
            Logo (voliteľné)
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setLogo(e.target.files?.[0] || null)}
            />
          </label>
        </div>
        {error ? <p className="admin-error">{error}</p> : null}
        <div className="admin-form__actions">
          <button className="btn btn--primary" type="submit" disabled={loading}>
            {loading
              ? "Ukladám…"
              : editingId
                ? "Uložiť zmeny"
                : "Pridať partnera"}
          </button>
          {editingId ? (
            <button
              type="button"
              className="btn btn--admin-ghost"
              onClick={() => {
                setEditingId(null);
                setForm(blank);
                setLogo(null);
              }}
            >
              Zrušiť
            </button>
          ) : null}
        </div>
      </form>

      <div className="admin-table">
        {items.map((item) => (
          <article key={item.id} className="admin-row">
            <div className="admin-partner-preview">
              {item.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.logo} alt="" />
              ) : null}
              <div>
                <strong>
                  {item.name}
                  {item.tier === "main" ? " · hlavný" : ""}
                </strong>
                <p>
                  {item.description || item.url || "Bez popisu"}
                </p>
              </div>
            </div>
            <div className="admin-row__actions">
              <button type="button" onClick={() => edit(item)}>
                Upraviť
              </button>
              <button type="button" onClick={() => remove(item.id)}>
                Zmazať
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
