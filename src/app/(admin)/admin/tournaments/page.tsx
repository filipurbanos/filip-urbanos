"use client";

import { useEffect, useMemo, useState } from "react";
import type {
  Album,
  Match,
  MatchResult,
  Tournament,
  TournamentStatus,
} from "@/lib/cms/types";
import { sortByDateDesc } from "@/lib/cms/dates";

const blankTournament = {
  date: "",
  event: "",
  place: "",
  surface: "Hard",
  status: "upcoming" as TournamentStatus,
  resultSingles: "",
  resultDoubles: "",
  notes: "",
  url: "",
  albumId: "",
  matches: [] as Match[],
};

const blankMatch = {
  round: "",
  opponent: "",
  score: "",
  result: "scheduled" as MatchResult,
  date: "",
  notes: "",
};

function statusLabel(status: TournamentStatus) {
  if (status === "live") return "aktuálny";
  if (status === "completed") return "ukončený";
  return "nadchádzajúci";
}

export default function AdminTournamentsPage() {
  const [items, setItems] = useState<Tournament[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [form, setForm] = useState(blankTournament);
  const [matchForm, setMatchForm] = useState(blankMatch);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingMatchId, setEditingMatchId] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function load() {
    const [tournamentsRes, albumsRes] = await Promise.all([
      fetch("/api/admin/tournaments"),
      fetch("/api/admin/albums"),
    ]);
    if (tournamentsRes.ok) {
      const data = (await tournamentsRes.json()) as {
        tournaments: Tournament[];
      };
      setItems(data.tournaments);
    }
    if (albumsRes.ok) {
      const data = (await albumsRes.json()) as { albums: Album[] };
      setAlbums(data.albums);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  const sortedItems = useMemo(() => sortByDateDesc(items), [items]);
  const sortedAlbums = useMemo(() => sortByDateDesc(albums), [albums]);

  function albumTitle(id: string) {
    if (!id) return "";
    return sortedAlbums.find((album) => album.id === id)?.title || "";
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/admin/tournaments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingId ? { ...form, id: editingId } : form),
    });
    if (!res.ok) {
      setError("Uloženie zlyhalo");
      return;
    }
    const data = (await res.json()) as { tournaments: Tournament[] };
    setItems(data.tournaments);
    setForm(blankTournament);
    setMatchForm(blankMatch);
    setEditingId(null);
    setEditingMatchId(null);
  }

  async function remove(id: string) {
    if (!confirm("Zmazať turnaj?")) return;
    const res = await fetch(`/api/admin/tournaments?id=${id}`, {
      method: "DELETE",
    });
    if (!res.ok) return;
    const data = (await res.json()) as { tournaments: Tournament[] };
    setItems(data.tournaments);
  }

  async function quickStatus(item: Tournament, status: TournamentStatus) {
    setError("");
    const res = await fetch("/api/admin/tournaments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...item,
        status,
      }),
    });
    if (!res.ok) {
      setError("Zmena stavu turnaja zlyhala");
      return;
    }
    const data = (await res.json()) as { tournaments: Tournament[] };
    setItems(data.tournaments);
  }

  function edit(item: Tournament) {
    setEditingId(item.id);
    setForm({
      date: item.date,
      event: item.event,
      place: item.place,
      surface: item.surface,
      status: item.status,
      resultSingles: item.resultSingles,
      resultDoubles: item.resultDoubles,
      notes: item.notes,
      url: item.url,
      albumId: item.albumId || "",
      matches: item.matches,
    });
    setMatchForm(blankMatch);
    setEditingMatchId(null);
  }

  function saveMatch(e: React.FormEvent) {
    e.preventDefault();
    if (!matchForm.opponent.trim() && !matchForm.round.trim()) return;

    const payload = {
      ...matchForm,
      date: matchForm.date.trim() || form.date.trim(),
    };

    if (editingMatchId) {
      setForm({
        ...form,
        matches: form.matches.map((match) =>
          match.id === editingMatchId
            ? { ...match, ...payload }
            : match,
        ),
      });
    } else {
      setForm({
        ...form,
        matches: [
          ...form.matches,
          {
            id: `m_${Date.now().toString(36)}`,
            ...payload,
          },
        ],
      });
    }
    setMatchForm(blankMatch);
    setEditingMatchId(null);
  }

  async function createAlbumFromTournament() {
    if (!form.event.trim()) return;
    setError("");
    const res = await fetch("/api/admin/albums", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.event.trim(),
        date: form.date.trim(),
        description: [form.place, form.notes].filter(Boolean).join(" · "),
      }),
    });
    if (!res.ok) {
      setError("Vytvorenie albumu zlyhalo");
      return;
    }
    const data = (await res.json()) as { albums: Album[] };
    setAlbums(data.albums);
    const created = data.albums[0];
    if (created) {
      setForm((prev) => ({ ...prev, albumId: created.id }));
    }
  }

  function editMatch(match: Match) {
    setEditingMatchId(match.id);
    setMatchForm({
      round: match.round,
      opponent: match.opponent,
      score: match.score,
      result: match.result,
      date: match.date,
      notes: match.notes,
    });
  }

  function removeMatch(id: string) {
    setForm({
      ...form,
      matches: form.matches.filter((match) => match.id !== id),
    });
    if (editingMatchId === id) {
      setEditingMatchId(null);
      setMatchForm(blankMatch);
    }
  }

  return (
    <div className="admin-page">
      <h1>Turnaje</h1>
      <p className="admin-lead">
        Môžeš pridávať aj staršie turnaje spätne: nastav stav „Ukončený“, vyplň
        dátum, miesto, povrch a umiestnenie 2hra / 4hra. Aktuálny = živé zápasy;
        po skončení prepni na „Ukončený“. Na webe sa odohrané zoraďujú od
        najnovšieho. Ak má turnaj popis, zápasy alebo album s fotkami/videami,
        riadok sa na webe dá otvoriť.
      </p>
      <p className="admin-muted">
        Live môže byť vždy len jeden turnaj naraz. Tlačidlo „Nastaviť live“
        automaticky vypne predošlý aktuálny turnaj.
      </p>

      <form className="admin-form" onSubmit={save}>
        <div className="admin-form__grid">
          <label>
            Dátum
            <input
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              placeholder="2026-08-01 alebo 2026-08"
              required
            />
          </label>
          <label>
            Turnaj
            <input
              value={form.event}
              onChange={(e) => setForm({ ...form, event: e.target.value })}
              required
            />
          </label>
          <label>
            Miesto
            <input
              value={form.place}
              onChange={(e) => setForm({ ...form, place: e.target.value })}
            />
          </label>
          <label>
            Povrch
            <input
              value={form.surface}
              onChange={(e) => setForm({ ...form, surface: e.target.value })}
            />
          </label>
          <label>
            Stav
            <select
              value={form.status}
              onChange={(e) =>
                setForm({
                  ...form,
                  status: e.target.value as TournamentStatus,
                })
              }
            >
              <option value="upcoming">Nadchádzajúci</option>
              <option value="live">Aktuálny (live)</option>
              <option value="completed">Ukončený</option>
            </select>
          </label>
          <label>
            Umiestnenie 2hra
            <input
              value={form.resultSingles}
              onChange={(e) =>
                setForm({ ...form, resultSingles: e.target.value })
              }
              placeholder="R16 / W / —"
            />
          </label>
          <label>
            Umiestnenie 4hra
            <input
              value={form.resultDoubles}
              onChange={(e) =>
                setForm({ ...form, resultDoubles: e.target.value })
              }
              placeholder="F / Vicemajster / —"
            />
          </label>
          <label className="admin-form__wide">
            Odkaz (UTR / ITF)
            <input
              value={form.url}
              onChange={(e) => setForm({ ...form, url: e.target.value })}
              placeholder="https://app.utrsports.net/events/..."
            />
          </label>
          <label className="admin-form__wide">
            Poznámka / popis
            <input
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Krátky popis turnaja (zobrazí sa v detaile)"
            />
          </label>
          <label className="admin-form__wide">
            Album (fotky / videá)
            <div className="admin-inline-row">
              <select
                value={form.albumId}
                onChange={(e) => setForm({ ...form, albumId: e.target.value })}
              >
                <option value="">— bez albumu —</option>
                {sortedAlbums.map((album) => (
                  <option key={album.id} value={album.id}>
                    {album.title}
                    {album.date ? ` · ${album.date}` : ""}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className="btn btn--admin-ghost"
                disabled={!form.event.trim()}
                onClick={() => void createAlbumFromTournament()}
              >
                Vytvoriť album
              </button>
            </div>
          </label>
        </div>

        <div className="admin-matches">
          <h2>
            Zápasy na turnaji
            {form.status === "live" ? (
              <span className="admin-live-pill">LIVE</span>
            ) : null}
          </h2>
          {form.status === "live" ? (
            <p className="admin-muted">
              Po zápase doplň výsledok tu — na webe sa zobrazí v sekcii Aktuálny
              turnaj.
            </p>
          ) : null}
          <div className="admin-form__grid">
            <label>
              Kolo
              <input
                value={matchForm.round}
                onChange={(e) =>
                  setMatchForm({ ...matchForm, round: e.target.value })
                }
                placeholder="R32 / QF / F"
              />
            </label>
            <label>
              Súper
              <input
                value={matchForm.opponent}
                onChange={(e) =>
                  setMatchForm({ ...matchForm, opponent: e.target.value })
                }
                placeholder="Meno súpera"
              />
            </label>
            <label>
              Skóre
              <input
                value={matchForm.score}
                onChange={(e) =>
                  setMatchForm({ ...matchForm, score: e.target.value })
                }
                placeholder="6-4 7-5"
              />
            </label>
            <label>
              Výsledok zápasu
              <select
                value={matchForm.result}
                onChange={(e) =>
                  setMatchForm({
                    ...matchForm,
                    result: e.target.value as MatchResult,
                  })
                }
              >
                <option value="scheduled">Naplánovaný</option>
                <option value="win">Výhra</option>
                <option value="loss">Prehra</option>
                <option value="retired">Retired</option>
                <option value="walkover">Walkover</option>
              </select>
            </label>
            <label>
              Dátum zápasu
              <input
                value={matchForm.date}
                onChange={(e) =>
                  setMatchForm({ ...matchForm, date: e.target.value })
                }
                placeholder="2026-08-01"
              />
            </label>
            <label>
              Poznámka
              <input
                value={matchForm.notes}
                onChange={(e) =>
                  setMatchForm({ ...matchForm, notes: e.target.value })
                }
              />
            </label>
          </div>
          <div className="admin-form__actions">
            <button
              type="button"
              className="btn btn--admin-ghost"
              onClick={saveMatch}
            >
              {editingMatchId ? "Uložiť zápas" : "Pridať zápas"}
            </button>
            {editingMatchId ? (
              <button
                type="button"
                className="btn btn--admin-ghost"
                onClick={() => {
                  setEditingMatchId(null);
                  setMatchForm(blankMatch);
                }}
              >
                Zrušiť zápas
              </button>
            ) : null}
          </div>

          <div className="admin-match-list">
            {form.matches.length === 0 ? (
              <p className="admin-lead">Zatiaľ žiadne zápasy.</p>
            ) : (
              form.matches.map((match) => (
                <article key={match.id} className="admin-row">
                  <div>
                    <strong>
                      {match.round || "Zápas"} · {match.opponent || "TBC"}
                    </strong>
                    <p>
                      {match.result}
                      {match.score ? ` · ${match.score}` : ""}
                      {match.date ? ` · ${match.date}` : ""}
                    </p>
                  </div>
                  <div className="admin-row__actions">
                    <button type="button" onClick={() => editMatch(match)}>
                      Upraviť
                    </button>
                    <button type="button" onClick={() => removeMatch(match.id)}>
                      Zmazať
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>

        {error ? <p className="admin-error">{error}</p> : null}
        <div className="admin-form__actions">
          <button className="btn btn--primary" type="submit">
            {editingId ? "Uložiť turnaj" : "Pridať turnaj"}
          </button>
          {editingId ? (
            <button
              type="button"
              className="btn btn--admin-ghost"
              onClick={() => {
                setEditingId(null);
                setForm(blankTournament);
                setMatchForm(blankMatch);
                setEditingMatchId(null);
              }}
            >
              Zrušiť
            </button>
          ) : null}
        </div>
      </form>

      <div className="admin-table">
        {sortedItems.map((item) => (
          <article key={item.id} className="admin-row">
            <div>
              <strong>
                {item.date} · {item.event}
              </strong>
              <p>
                {item.place} · {item.surface} · {statusLabel(item.status)}
                {item.resultSingles ? ` · 2hra ${item.resultSingles}` : ""}
                {item.resultDoubles ? ` · 4hra ${item.resultDoubles}` : ""}
                {item.matches.length
                  ? ` · ${item.matches.length} zápasov`
                  : ""}
                {item.albumId ? ` · album ${albumTitle(item.albumId) || "priradený"}` : ""}
              </p>
            </div>
            <div className="admin-row__actions">
              {item.status !== "live" ? (
                <button
                  type="button"
                  onClick={() => quickStatus(item, "live")}
                >
                  Nastaviť live
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => quickStatus(item, "completed")}
                >
                  Ukončiť
                </button>
              )}
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
