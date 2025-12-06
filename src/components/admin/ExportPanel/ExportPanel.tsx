"use client";

import {
  Download,
  FileSpreadsheet,
  FileText,
  FileJson,
  Calendar,
} from "lucide-react";
import styles from "./ExportPanel.module.css";
import { Button } from "@/components/ui/Button";

export default function ExportPanel() {
  const handleExport = (format: string) => {
    const data = [
      {
        title: "The Shawshank Redemption",
        director: "Frank Darabont",
        year: 1994,
        votes: 45,
        votesEventHall: 28,
        votesHome: 17,
      },
      {
        title: "The Godfather",
        director: "Francis Ford Coppola",
        year: 1972,
        votes: 38,
        votesEventHall: 21,
        votesHome: 17,
      },
      {
        title: "Pulp Fiction",
        director: "Quentin Tarantino",
        year: 1994,
        votes: 32,
        votesEventHall: 18,
        votesHome: 14,
      },
    ];

    let content = "";
    let filename = "";
    let mimeType = "";

    switch (format) {
      case "csv":
        content =
          "Titel,Regisseur,Jaar,Totaal Stemmen,Event Hall,Thuis\n" +
          data
            .map(
              (d) =>
                `"${d.title}","${d.director}",${d.year},${d.votes},${d.votesEventHall},${d.votesHome}`
            )
            .join("\n");
        filename = "stemming-resultaten.csv";
        mimeType = "text/csv";
        break;

      case "json":
        content = JSON.stringify(data, null, 2);
        filename = "stemming-resultaten.json";
        mimeType = "application/json";
        break;

      case "txt":
        content = data
          .map(
            (d) =>
              `${d.title} (${d.year}) - ${d.director}\n  ${d.votes} stemmen (Event Hall: ${d.votesEventHall}, Thuis: ${d.votesHome})`
          )
          .join("\n\n");
        filename = "stemming-resultaten.txt";
        mimeType = "text/plain";
        break;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = filename;
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className={styles.container}>
      <h2>Export Resultaten</h2>
      <p className={styles.subtext}>
        Download stemming data in verschillende formaten (met locatie breakdown)
      </p>

      {/* Export Options */}
      <div className={styles.exportGrid}>
        <button
          className={styles.exportButton}
          onClick={() => handleExport("csv")}
        >
          <FileSpreadsheet
            className={`${styles.exportIcon} ${styles.exportIconGreen}`}
          />
          <h3 className={styles.exportTitle}>CSV Export</h3>
          <p className={styles.exportDescription}>Excel spreadsheet formaat</p>
        </button>

        <button
          className={styles.exportButton}
          onClick={() => handleExport("json")}
        >
          <FileJson
            className={`${styles.exportIcon} ${styles.exportIconPurple}`}
          />
          <h3 className={styles.exportTitle}>JSON Export</h3>
          <p className={styles.exportDescription}>
            Gestructureerde data voor developers
          </p>
        </button>

        <button
          className={styles.exportButton}
          onClick={() => handleExport("txt")}
        >
          <FileText
            className={`${styles.exportIcon} ${styles.exportIconBlue}`}
          />
          <h3 className={styles.exportTitle}>Text Export</h3>
          <p className={styles.exportDescription}>
            Eenvoudig leesbaar tekstbestand
          </p>
        </button>
      </div>

      {/* Quick Export */}
      <div className={styles.quickExport}>
        <Button
          onClick={() => handleExport("csv")}
          className={styles.quickExportButton}
        >
          <Download className="w-4 h-4 mr-2" />
          Volledige Export Downloaden (CSV)
        </Button>
      </div>

      {/* Export History */}
      <div>
        <h3 className={styles.optionsTitle}>Export Geschiedenis</h3>

        <div className={styles.historyList}>
          {[
            { date: "2025-11-20 14:30", format: "CSV", size: "2.3 KB" },
            { date: "2025-11-20 10:15", format: "JSON", size: "4.1 KB" },
            { date: "2025-11-19 16:45", format: "CSV", size: "2.1 KB" },
          ].map((item, i) => (
            <div key={i} className={styles.historyItem}>
              <div className={styles.historyItemLeft}>
                <Calendar className={styles.historyIcon} />
                <div>
                  <p className={styles.historyFormat}>{item.format} Export</p>
                  <p className={styles.historyDate}>{item.date}</p>
                </div>
              </div>

              <div className={styles.historyItemRight}>
                <span className={styles.historySize}>{item.size}</span>
                <button className={styles.historyDownload}>
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
