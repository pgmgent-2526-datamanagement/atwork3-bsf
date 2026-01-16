"use client";

import { useCallback, useEffect, useState } from "react";
import styles from "./VotingControl.module.css";
import { Button } from "@/components/ui/Button";
import { Home, Building2 } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

type ActiveSession = { type: "zaal" | "online" };

const DURATION_SECONDS = 300;

function durationLabel(seconds: number) {
  return seconds >= 60
    ? `${Math.round(seconds / 60)} minuten`
    : `${seconds} seconden`;
}

export default function VotingControl() {
  const toast = useToast();
  const [active, setActive] = useState({ zaal: false, online: false });

  const fetchStatus = useCallback(async (signal?: AbortSignal) => {
    const res = await fetch("/api/votes/status", { cache: "no-store", signal });
    if (!res.ok) return;

    const data = (await res.json()) as ActiveSession[];
    if (!Array.isArray(data)) return;

    setActive({
      zaal: data.some((s) => s.type === "zaal"),
      online: data.some((s) => s.type === "online"),
    });
  }, []);

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();
    let interval: ReturnType<typeof setInterval> | null = null;

    (async () => {
      try {
        await fetchStatus(controller.signal);
        if (!mounted) return;

        interval = setInterval(() => {
          fetchStatus().catch(() => {});
        }, 1000);
      } catch {
        // ignore
      }
    })();

    return () => {
      mounted = false;
      controller.abort();
      if (interval) clearInterval(interval);
    };
  }, [fetchStatus]);

  async function start(source: "zaal" | "online") {
    try {
      const res = await fetch("/api/votes/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source, durationSeconds: DURATION_SECONDS }),
      });

      const json = await res.json().catch(() => null);

      if (!res.ok || !json?.success) {
        toast.error(json?.error ?? "Kon stemming niet openen.", "Fout");
        return;
      }

      toast.success(
        `${
          source === "zaal" ? "Event Hall" : "Online"
        } is open (${durationLabel(DURATION_SECONDS)}).`,
        "Stemming geopend"
      );
      fetchStatus().catch(() => {});
    } catch {
      toast.error("Netwerkfout bij openen van stemming.", "Fout");
    }
  }

  async function stop(source: "zaal" | "online") {
    try {
      const res = await fetch("/api/votes/stop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source }),
      });

      const json = await res.json().catch(() => null);

      if (!res.ok || !json?.success) {
        toast.error(json?.error ?? "Kon stemming niet sluiten.", "Fout");
        return;
      }

      toast.info(
        `${source === "zaal" ? "Event Hall" : "Online"} is gesloten.`,
        "Stemming gesloten"
      );
      fetchStatus().catch(() => {});
    } catch {
      toast.error("Netwerkfout bij sluiten van stemming.", "Fout");
    }
  }

  async function openAll() {
    await Promise.all([start("zaal"), start("online")]);
  }

  async function closeAll() {
    await Promise.all([stop("zaal"), stop("online")]);
  }

  const allOpen = active.zaal && active.online;
  const allClosed = !active.zaal && !active.online;
  const partialOpen = !allOpen && !allClosed;
  const durLabel = durationLabel(DURATION_SECONDS);

  return (
    <div className={styles.container}>
      <h2>Stemming Controle</h2>
      <p className={styles.subtext}>Beheer de stemming per locatie</p>

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
          {allOpen && `Iedereen kan stemmen (${durLabel}).`}
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
              {active.zaal ? `Open (${durLabel})` : "Gesloten"}
            </p>
          </div>
        </div>

        <label className={styles.switch}>
          <input
            type="checkbox"
            checked={active.zaal}
            onChange={(e) => (e.target.checked ? start("zaal") : stop("zaal"))}
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
              {active.online ? `Open (${durLabel})` : "Gesloten"}
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

      <div className={styles.actionButtons}>
        {!allOpen && <Button onClick={openAll}>Alles Open</Button>}
        {!allClosed && (
          <Button onClick={closeAll} style={{ background: "#dc2626" }}>
            Alles Sluiten
          </Button>
        )}
      </div>
    </div>
  );
}
