"use client";

import Papa, { ParseResult } from "papaparse";
import { useEffect, useMemo, useRef, useState } from "react";
import { Calendar, Download, FileSpreadsheet, Upload } from "lucide-react";

import styles from "./ExportPanel.module.css";
import { Button } from "@/components/ui/Button";
import {
  addExportHistoryItem,
  formatExportHistoryDate,
  getExportHistory,
  clearExportHistory,
  subscribeExportHistoryUpdated,
  type ExportHistoryItem,
} from "@/lib/exportHistory";

type CsvRow = {
  title?: string;
  maker?: string;
  tagline?: string;
};

type PreviewRow = {
  title: string;
  maker: string;
  tagline: string | null;
};

type ImportResponse =
  | { success: true; inserted: number; edition_id: number }
  | { success: false; error: string };

function clean(value: unknown): string {
  return String(value ?? "").trim();
}

export default function ExportPanel() {
  const handleExport = () => {
    const exportUrl = "/api/films/export";

    addExportHistoryItem({
      format: "Excel",
      url: exportUrl,
      maxItems: 20,
    });

    window.location.href = exportUrl;
  };

  // --- IMPORT STATE ---
  const [file, setFile] = useState<File | null>(null);
  const [rawRows, setRawRows] = useState<CsvRow[]>([]);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [history, setHistory] = useState<ExportHistoryItem[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const preview: PreviewRow[] = useMemo(() => {
    return rawRows.map((r) => {
      const title = clean(r.title);
      const maker = clean(r.maker);
      const tagline = clean(r.tagline);

      return {
        title,
        maker,
        tagline: tagline || null,
      };
    });
  }, [rawRows]);

  useEffect(() => {
    setHistory(getExportHistory());

    const unsub = subscribeExportHistoryUpdated(() => {
      setHistory(getExportHistory());
    });

    return unsub;
  }, []);

  const previewTop = useMemo(() => preview.slice(0, 10), [preview]);

  const validatePreview = () => {
    for (let i = 0; i < preview.length; i++) {
      const row = preview[i];
      if (!row.title || !row.maker) {
        throw new Error(`Rij ${i + 2}: ontbreekt title, maker.`);
      }
    }
  };
  const resetImport = () => {
    setFile(null);
    setRawRows([]);
    setError("");
    setInfo("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
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

    const allowed = new Set(["title", "maker", "tagline"]);
    const headers = parsed.meta.fields ?? [];
    const unknown = headers.filter((h) => !allowed.has(h));
    if (unknown.length) {
      setError(
        `Onbekende kolommen: ${unknown.join(", ")}. Alleen title, maker, tagline.`,
      );
      return;
    }

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
      `Preview geladen: ${rows.length} rij(en). Vereist: title, maker, tagline`,
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
      <h2>Export Resultaten</h2>
      <p className={styles.subtext}>Download stemming data in Excel formaat</p>

      {/* Export + Import cards next to each other */}
      <div className={styles.exportGrid}>
        {/* Excel Export Card */}
        <article className={styles.exportButton}>
          <FileSpreadsheet
            className={`${styles.exportIcon} ${styles.exportIconGreen}`}
          />
          <h3 className={styles.exportTitle}>Excel Export</h3>
          <p className={styles.exportDescription}>.xlsx (Excel)</p>
          <Button onClick={handleExport} className={styles.quickExportButton}>
            <Download size={16} />
            Volledige Export Downloaden
          </Button>
        </article>

        {/* CSV Import Card */}
        <article className={styles.importCard}>
          <Upload
            className={`${styles.exportIcon} ${styles.exportIconPurple}`}
          />
          <h3 className={styles.exportTitle}>Films Import (CSV)</h3>
          <p className={styles.exportDescription}>
            Upload CSV en importeer naar actieve editie
          </p>

          <div className={styles.importControls}>
            <label className={styles.uploadButton}>
              <Upload size={16} /> Kies CSV bestand
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                className={styles.hiddenFileInput}
                onChange={(e) => onPickFile(e.target.files?.[0] ?? null)}
              />
            </label>
            <div className={styles.importActionButtons}>
              <Button
                className={styles.importPrimaryButton}
                onClick={doImport}
                disabled={!file || !rawRows.length || isImporting}
              >
                <Upload size={16} />
                {isImporting ? "Importeren..." : "Importeer films"}
              </Button>
              <Button
                className={styles.importSecondaryButton}
                onClick={resetImport}
                disabled={!file && !rawRows.length}
              >
                Annuleren
              </Button>
            </div>
          </div>

          {error && <p className={styles.importError}>{error}</p>}
          {info && <p className={styles.importInfo}>{info}</p>}

          {!!previewTop.length && (
            <div className={styles.previewWrap}>
              <table className={styles.previewTable}>
                <thead>
                  <tr>
                    <th>title</th>
                    <th>maker</th>
                    <th>tagline</th>
                  </tr>
                </thead>
                <tbody>
                  {previewTop.map((r, i) => (
                    <tr key={i}>
                      <td>{r.title}</td>
                      <td>{r.maker}</td>
                      <td>{r.tagline ?? ""}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </article>
      </div>

      <div>
        <div className={styles.historyContainer}>
          <header className={styles.historyList}>
            <h3 className={styles.optionsTitle}>Export Geschiedenis</h3>
            <Button
              className={styles.importSecondaryButton}
              onClick={() => clearExportHistory()}
              disabled={!history.length}
            >
              Wis alle exports
            </Button>
          </header>

          {!history.length ? (
            <p className={styles.subtext}>Nog geen exports gedaan.</p>
          ) : (
            history.map((item) => (
              <div key={item.id} className={styles.historyItem}>
                <div className={styles.historyItemLeft}>
                  <Calendar className={styles.historyIcon} />
                  <div>
                    <p className={styles.historyFormat}>{item.format} Export</p>
                    <p className={styles.historyDate}>
                      {formatExportHistoryDate(item.dateIso)}
                    </p>
                  </div>
                </div>

                <div className={styles.historyItemRight}>
                  <Button
                    className={styles.historyDownload}
                    onClick={() => (window.location.href = item.url)}
                    title="Opnieuw downloaden"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
