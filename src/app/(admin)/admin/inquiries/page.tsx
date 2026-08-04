"use client";

import { useEffect, useState } from "react";
import type { Inquiry } from "@/lib/cms/inquiries";

function topicLabel(topic: Inquiry["topic"]) {
  if (topic === "partner") return "Partnerstvo";
  if (topic === "media") return "Médiá";
  return "Iné";
}

export default function AdminInquiriesPage() {
  const [items, setItems] = useState<Inquiry[]>([]);
  const [error, setError] = useState("");

  async function load() {
    const res = await fetch("/api/admin/inquiries");
    if (!res.ok) {
      setError("Načítanie správ zlyhalo");
      return;
    }
    const data = (await res.json()) as { inquiries: Inquiry[] };
    setItems(data.inquiries);
  }

  useEffect(() => {
    void load();
  }, []);

  async function remove(id: string) {
    if (!confirm("Zmazať správu?")) return;
    const res = await fetch(`/api/admin/inquiries?id=${id}`, {
      method: "DELETE",
    });
    if (!res.ok) return;
    const data = (await res.json()) as { inquiries: Inquiry[] };
    setItems(data.inquiries);
  }

  return (
    <div className="admin-page">
      <h1>Správy z kontaktu</h1>
      <p className="admin-lead">
        Formulár z /contact. Správy sú uložené v CMS (lokálne alebo Blob) —
        nie sú vo verejnom content.json.
      </p>
      {error ? <p className="admin-error">{error}</p> : null}
      {items.length === 0 ? (
        <p className="admin-muted">Zatiaľ žiadne správy.</p>
      ) : (
        <div className="admin-table">
          {items.map((item) => (
            <article key={item.id} className="admin-row">
              <div>
                <strong>
                  {item.name} · {topicLabel(item.topic)}
                </strong>
                <p>
                  <a href={`mailto:${item.email}`}>{item.email}</a>
                  {" · "}
                  {new Date(item.createdAt).toLocaleString("sk-SK")}
                </p>
                <p style={{ whiteSpace: "pre-wrap" }}>{item.message}</p>
              </div>
              <div className="admin-row__actions">
                <button
                  type="button"
                  className="btn btn--admin-ghost"
                  onClick={() => void remove(item.id)}
                >
                  Zmazať
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
