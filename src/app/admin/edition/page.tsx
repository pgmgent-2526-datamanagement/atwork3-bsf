"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "../Dashboard.module.css"; 

type EditionRow = {
  id: number;
  name: string;
  year: number;
  is_active: boolean | null;
  start_time: string | null;
  end_time: string | null;
};

type FilmRow = {
  id: number;
  title: string;
  maker: string | null;
  tagline: string | null;
  created_at: string | null;
};

type CurrentEditionResponse =
  | { success: true; edition: EditionRow | null; films: FilmRow[] }
  | { success: false; error: string };

type ResetResponse =
  | { success: true; message: string; newEdition: EditionRow }
  | { success: false; error: string };

export default function AdminEditionPage() {
  const [edition, setEdition] = useState<EditionRow | null>(null);
  const [films, setFilms] = useState<FilmRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filmCount = films.length;

  const load = async () => {
    setError(null);
    const res = await fetch("/api/admin/edition/current", { cache: "no-store" });
    const json = (await res.json()) as CurrentEditionResponse;

    if (!res.ok || !json.success) {
      setError(!json.success ? json.error : "Failed to load");
      return;
    }

    setEdition(json.edition);
    setFilms(json.films);
  };

  useEffect(() => {
    (async () => {
      try {
        await load();
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const subtitle = useMemo(() => {
    if (!edition) return "Geen actieve editie";
    return `${edition.name} (${edition.year})`;
  }, [edition]);

  const onReset = async () => {
    if (!edition) return;

    const ok = window.confirm(
      `⚠️ Dit verwijdert ALLE films, stem-sessies en stemmen van de actieve editie "${edition.name} (${edition.year})".\n\nDaarna wordt automatisch een nieuwe editie aangemaakt.\n\nDoorgaan?`
    );
    if (!ok) return;

    setBusy(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/edition/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const json = (await res.json()) as ResetResponse;

      if (!res.ok || !json.success) {
        throw new Error(!json.success ? json.error : "Reset failed");
      }

      // reload page data
      await load();
      alert(json.message);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unexpected error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 6 }}>
        Editie beheer
      </h1>
      <p style={{ marginBottom: 18, opacity: 0.85 }}>{subtitle}</p>

      {loading && <div className={styles.card}>Laden…</div>}
      {error && <div className={styles.card}>Error: {error}</div>}

      <div className={styles.card} style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
          <div>
            <div style={{ fontWeight: 600 }}>Actieve editie</div>
            <div style={{ opacity: 0.85 }}>
              {edition ? `${edition.name} — ${edition.year}` : "Geen"}
            </div>
            <div style={{ opacity: 0.75, marginTop: 6 }}>
              Films in editie: <b>{filmCount}</b>
            </div>
          </div>

          <button
            onClick={onReset}
            disabled={!edition || busy}
            style={{
              padding: "10px 14px",
              borderRadius: 10,
              fontWeight: 700,
              cursor: !edition || busy ? "not-allowed" : "pointer",
              opacity: !edition || busy ? 0.6 : 1,
              border: "1px solid rgba(255,255,255,0.15)",
              background: "rgba(255,0,0,0.12)",
            }}
          >
            {busy ? "Bezig..." : "Reset editie (alles wissen + nieuwe editie)"}
          </button>
        </div>
      </div>

      <div className={styles.card}>
        <div style={{ fontWeight: 700, marginBottom: 10 }}>Films</div>
        {films.length === 0 ? (
          <div style={{ opacity: 0.8 }}>Geen films in de actieve editie.</div>
        ) : (
          <div style={{ display: "grid", gap: 10 }}>
            {films.map((f) => (
              <div
                key={f.id}
                style={{
                  padding: 12,
                  borderRadius: 12,
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <div style={{ fontWeight: 700 }}>{f.title}</div>
                <div style={{ opacity: 0.8, marginTop: 4 }}>
                  {f.maker ? `Maker: ${f.maker}` : "Maker: —"}
                </div>
                {f.tagline && (
                  <div style={{ opacity: 0.8, marginTop: 2 }}>{f.tagline}</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
