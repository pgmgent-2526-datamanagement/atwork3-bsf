"use client";

import {
  Download,
  FileSpreadsheet,
  Calendar,
} from "lucide-react";
import styles from "./ExportPanel.module.css";
import { Button } from "@/components/ui/Button";

export default function ExportPanel() {
const handleExport = (format: "csv" | "xlsx") => {
  // zet hier jouw echte endpoint path:
  const url = `/api/admin/export?format=${format}`;
  window.location.href = url;
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
            className={`${styles.exportIcon} ${styles.exportIconBlue}`}
          />
          <h3 className={styles.exportTitle}>CSV Export</h3>
          <p className={styles.exportDescription}>Spreadsheet (CSV)</p>
        </button>

        <button
          className={styles.exportButton}
          onClick={() => handleExport("xlsx")}
        >
          <FileSpreadsheet
            className={`${styles.exportIcon} ${styles.exportIconGreen}`}
          />
          <h3 className={styles.exportTitle}>Excel Export</h3>
          <p className={styles.exportDescription}>.xlsx (Excel)</p>
        </button>
      </div>

      {/* Quick Export */}
      <div className={styles.quickExport}>
        <Button
          onClick={() => handleExport("xlsx")}
          className={styles.quickExportButton}
        >
          <Download className="w-4 h-4 mr-2" />
          Volledige Export Downloaden (Excel)
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
