"use client";

import Papa, { ParseResult } from "papaparse";
import { useMemo, useState } from "react";
import styles from "./FilmImportPanel.module.css";
import { Button } from "@/components/ui/Button";

type CsvRow = {
  title?: string;
  maker?: string;
  image_text?: string;
  tagline?: string;
  thumbnail_url?: string;
  image_url?: string;
};

type PreviewRow = {
  title: string;
  maker: string;
  image_text: string;
  tagline: string | null;
  thumbnail_url: string | null;
  image_url: string | null;
};

type ImportResponse =
  | { success: true; inserted: number; edition_id: number }
  | { success: false; error: string };

function clean(value: unknown): string {
  return String(value ?? "").trim();
}

export function FilmImportPanel() {
  const [file, setFile] = useState<File | null>(null);
  const [rawRows, setRawRows] = useState<CsvRow[]>([]);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [isImporting, setIsImporting] = useState(false);

  const preview: PreviewRow[] = useMemo(() => {
    return rawRows.map((r) => {
      const title = clean(r.title);
      const maker = clean(r.maker);
      const image_text = clean(r.image_text);
      const tagline = clean(r.tagline);

      return {
        title,
        maker,
        image_text,
        tagline: tagline || null,
        thumbnail_url: r.thumbnail_url ? clean(r.thumbnail_url) : null,
        image_url: r.image_url ? clean(r.image_url) : null,
      };
    });
  }, [rawRows]);

  const previewTop = useMemo(() => preview.slice(0, 15), [preview]);

  const validatePreview = () => {
    for (let i = 0; i < preview.length; i++) {
      const row = preview[i];
      if (!row.title || !row.maker || !row.image_text) {
        throw new Error(`Rij ${i + 2}: ontbreekt title, maker of image_text.`);
      }
    }
  };

  const onPickFile = async (f: File | null) => {
    setError("");
    setInfo("");
    setRawRows([]);
    setFile(f);

    if (!f) return;

    if (!f.name.toLowerCase().endsWith(".csv")) {
      setError("Alleen .csv bestanden zijn toegestaan.");
      return;
    }

    const text = await f.text();

    const parsed: ParseResult<CsvRow> = Papa.parse<CsvRow>(text, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (h: string) => h.trim(),
      transform: (v: string) => v.trim(),
    });

    if (parsed.errors.length) {
      setError(parsed.errors[0].message);
      return;
    }

    const rows = parsed.data ?? [];
    if (!rows.length) {
      setError("CSV bevat geen rijen.");
      return;
    }

    setRawRows(rows);
    setInfo(
      `Preview geladen: ${rows.length} rij(en). Vereist: title, maker, image_text`,
    );
  };

  const doImport = async () => {
    try {
      setError("");
      setInfo("");

      if (!file) {
        setError("Kies eerst een CSV bestand.");
        return;
      }

      validatePreview();
      setIsImporting(true);

      const fd = new FormData();
      fd.append("file", file);

      const res = await fetch("/api/films/import", {
        method: "POST",
        body: fd,
      });

      const data: ImportResponse = await res.json();

      if (!res.ok || !data.success) {
        setError(data.success ? "Onbekende fout" : data.error);
        return;
      }

      setInfo(
        `✅ Import gelukt: ${data.inserted} films toegevoegd (edition ${data.edition_id})`,
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Onbekende fout");
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Films importeren (CSV)</h2>
      <p className={styles.subtext}>
        Upload een CSV, bekijk preview en importeer naar actieve editie.
      </p>

      <div className={styles.controls}>
        <input
          className={styles.file}
          type="file"
          accept=".csv"
          onChange={(e) => onPickFile(e.target.files?.[0] ?? null)}
        />

        <Button
          className={styles.importButton}
          onClick={doImport}
          disabled={!file || !rawRows.length || isImporting}
        >
          {isImporting ? "Importeren..." : "Importeer films"}
        </Button>
      </div>

      {error && <p className={styles.error}>{error}</p>}
      {info && <p className={styles.info}>{info}</p>}

      {!!preview.length && (
        <div className={styles.preview}>
          <h3>Preview (eerste 15 rijen)</h3>

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>title</th>
                  <th>maker</th>
                  <th>image_text</th>
                  <th>tagline</th>
                  <th>thumbnail_url</th>
                  <th>image_url</th>
                </tr>
              </thead>
              <tbody>
                {previewTop.map((r, i) => (
                  <tr key={i}>
                    <td>{r.title}</td>
                    <td>{r.maker}</td>
                    <td>{r.image_text}</td>
                    <td>{r.tagline ?? ""}</td>
                    <td>{r.thumbnail_url ?? ""}</td>
                    <td>{r.image_url ?? ""}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
