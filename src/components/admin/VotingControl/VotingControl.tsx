"use client";

import { useEffect, useState } from "react";
import styles from "./VotingControl.module.css";
import { Button } from "@/components/ui/Button";
import { Home, Building2 } from "lucide-react";

type ActiveSession = {
  type: "zaal" | "online";
};

export default function VotingControl() {
  const [active, setActive] = useState({
    zaal: false,
    online: false,
  });

  /* ----------------------------- */
  /* Fetch echte status uit backend */
  /* ----------------------------- */
  async function fetchStatus() {
    const res = await fetch("/api/votes/status");
    const data: ActiveSession[] = await res.json();

    setActive({
      zaal: data.some((s) => s.type === "zaal"),
      online: data.some((s) => s.type === "online"),
    });
  }

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 1000); // live sync
    return () => clearInterval(interval);
  }, []);

  /* ----------------------------- */
  /* Start / stop helpers          */
  /* ----------------------------- */
  async function start(source: "zaal" | "online") {
    await fetch("/api/votes/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ source }),
    });
    fetchStatus();
  }

  async function stop(source: "zaal" | "online") {
    await fetch("/api/votes/stop", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ source }),
    });
    fetchStatus();
  }

  async function openAll() {
    await Promise.all([start("zaal"), start("online")]);
  }

  async function closeAll() {
    await Promise.all([stop("zaal"), stop("online")]);
  }

  /* ----------------------------- */
  /* Status berekening (UI only)   */
  /* ----------------------------- */
  const allOpen = active.zaal && active.online;
  const allClosed = !active.zaal && !active.online;
  const partialOpen = !allOpen && !allClosed;

  return (
    <div className={styles.container}>
      <h2>Stemming Controle</h2>
      <p className={styles.subtext}>Beheer de stemming per locatie</p>

      {/* Status box */}
      <div
        className={`${styles.statusBox} ${
          allOpen ? styles.open : allClosed ? styles.closed : styles.partial
        }`}
      >
        <strong>
          {allOpen && "Alle stemmingen zijn OPEN"}
          {allClosed && "Alle stemmingen zijn GESLOTEN"}
          {partialOpen && "Gedeeltelijk open"}
        </strong>
        <p>
          {allOpen && "Iedereen kan stemmen (1 minuut)."}
          {allClosed && "Niemand kan momenteel stemmen."}
          {partialOpen && "Slechts één locatie is open."}
        </p>
      </div>

      {/* ZAAL */}
      <div className={styles.controlRow}>
        <div className={styles.controlInfo}>
          <div
            className={`${styles.iconBox} ${
              active.zaal ? styles.iconGreen : styles.iconRed
            }`}
          >
            <Building2 />
          </div>
          <div>
            <p className={styles.controlTitle}>Event Hall</p>
            <p className={styles.controlDescription}>
              {active.zaal ? "Open (1 minuut)" : "Gesloten"}
            </p>
          </div>
        </div>

        <label className={styles.switch}>
          <input
            type="checkbox"
            checked={active.zaal}
            onChange={(e) =>
              e.target.checked ? start("zaal") : stop("zaal")
            }
          />
          <span className={styles.slider} />
        </label>
      </div>

      {/* ONLINE */}
      <div className={styles.controlRow}>
        <div className={styles.controlInfo}>
          <div
            className={`${styles.iconBox} ${
              active.online ? styles.iconGreen : styles.iconRed
            }`}
          >
            <Home />
          </div>
          <div>
            <p className={styles.controlTitle}>Online</p>
            <p className={styles.controlDescription}>
              {active.online ? "Open (1 minuut)" : "Gesloten"}
            </p>
          </div>
        </div>

        <label className={styles.switch}>
          <input
            type="checkbox"
            checked={active.online}
            onChange={(e) =>
              e.target.checked ? start("online") : stop("online")
            }
          />
          <span className={styles.slider} />
        </label>
      </div>

      {/* Alles open / sluiten */}
      <div className={styles.actionButtons}>
        {!allOpen && <Button onClick={openAll}>Alles Open</Button>}

        {!allClosed && (
          <Button
            onClick={closeAll}
            style={{ background: "#dc2626" }}
          >
            Alles Sluiten
          </Button>
        )}
      </div>
    </div>
  );
}
