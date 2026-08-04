"use client";

import { useEffect, useState } from "react";
import { emptyRankingsTemplate } from "@/lib/cms/rankings";
import type { Ranking } from "@/lib/cms/types";

const defaultRankings: Ranking[] = emptyRankingsTemplate().map((item) =>
  item.system === "Tennis Europe"
    ? {
        ...item,
        value: "~150",
        note: "Historický juniorský míľnik",
      }
    : item,
);

function rankingLabel(system: Ranking["system"]) {
  if (system === "ITF Junior") return "ITF 2-hra";
  if (system === "ITF Doubles") return "ITF 4-hra";
  if (system === "UTR") return "UTR 2-hra";
  if (system === "UTR Doubles") return "UTR 4-hra";
  return system;
}

export default function AdminSettingsPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [rankings, setRankings] = useState<Ranking[]>(defaultRankings);
  const [rankingsError, setRankingsError] = useState("");
  const [rankingsSuccess, setRankingsSuccess] = useState("");
  const [rankingsLoading, setRankingsLoading] = useState(false);

  useEffect(() => {
    async function loadRankings() {
      const res = await fetch("/api/admin/rankings");
      if (!res.ok) return;
      const data = (await res.json()) as { rankings?: Ranking[] };
      if (Array.isArray(data.rankings) && data.rankings.length > 0) {
        setRankings(data.rankings);
      }
    }
    void loadRankings();
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("Nové heslá sa nezhodujú");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/admin/password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    setLoading(false);

    if (!res.ok) {
      const data = (await res.json().catch(() => null)) as {
        error?: string;
      } | null;
      setError(data?.error || "Zmena hesla zlyhala");
      return;
    }

    setSuccess("Heslo bolo zmenené.");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  }

  async function saveRankings(e: React.FormEvent) {
    e.preventDefault();
    setRankingsError("");
    setRankingsSuccess("");
    setRankingsLoading(true);

    const res = await fetch("/api/admin/rankings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rankings }),
    });
    setRankingsLoading(false);

    if (!res.ok) {
      const data = (await res.json().catch(() => null)) as
        | { error?: string }
        | null;
      setRankingsError(data?.error || "Uloženie rebríčkov zlyhalo");
      return;
    }

    const data = (await res.json()) as { rankings: Ranking[] };
    setRankings(data.rankings);
    setRankingsSuccess("Rebríčky boli uložené.");
  }

  function updateRanking(system: Ranking["system"], patch: Partial<Ranking>) {
    setRankings((prev) =>
      prev.map((item) => (item.system === system ? { ...item, ...patch } : item)),
    );
  }

  return (
    <div className="admin-page">
      <h1>Nastavenia</h1>
      <p className="admin-lead">
        Zmena admin hesla. Po zmene platí nové heslo namiesto defaultu z
        prostredia.
      </p>

      <form className="admin-form" onSubmit={onSubmit}>
        <div className="admin-form__grid">
          <label className="admin-form__wide">
            Aktuálne heslo
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </label>
          <label>
            Nové heslo
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="new-password"
              minLength={8}
              required
            />
          </label>
          <label>
            Potvrdiť nové heslo
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              minLength={8}
              required
            />
          </label>
        </div>
        {error ? <p className="admin-error">{error}</p> : null}
        {success ? <p className="admin-success">{success}</p> : null}
        <button className="btn btn--primary" type="submit" disabled={loading}>
          {loading ? "Ukladám…" : "Zmeniť heslo"}
        </button>
      </form>

      <form className="admin-form" onSubmit={saveRankings}>
        <h2>Rebríčky na webe</h2>
        <p className="admin-lead">
          Na webe sa zobrazia len vyplnené hodnoty (nie Live / TBC / Cieľ /
          prázdne). Tennis Europe ~150 je overený míľnik; ITF/UTR doplň, keď máš
          aktuálne číslo.
        </p>
        <div className="admin-table">
          {rankings.map((item) => (
            <article className="admin-row" key={item.system}>
              <div className="admin-form__grid">
                <label>
                  Systém
                  <input value={rankingLabel(item.system)} disabled />
                </label>
                <label>
                  Hodnota
                  <input
                    value={item.value}
                    onChange={(e) =>
                      updateRanking(item.system, { value: e.target.value })
                    }
                    placeholder="napr. #178 / 8.5 / ~150"
                  />
                </label>
                <label className="admin-form__wide">
                  Poznámka
                  <input
                    value={item.note}
                    onChange={(e) =>
                      updateRanking(item.system, { note: e.target.value })
                    }
                    placeholder="krátky popis pod hodnotou"
                  />
                </label>
              </div>
            </article>
          ))}
        </div>
        {rankingsError ? <p className="admin-error">{rankingsError}</p> : null}
        {rankingsSuccess ? <p className="admin-success">{rankingsSuccess}</p> : null}
        <button className="btn btn--primary" type="submit" disabled={rankingsLoading}>
          {rankingsLoading ? "Ukladám…" : "Uložiť rebríčky"}
        </button>
      </form>
    </div>
  );
}
