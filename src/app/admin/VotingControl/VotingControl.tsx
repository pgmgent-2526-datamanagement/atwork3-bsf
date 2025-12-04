"use client";

import styles from "./VotingControl.module.css";
import { Button } from "@/components/ui/Button";
import { Home, Building2 } from "lucide-react"; // alleen icons blijven

interface Props {
  votingOpenEventHall: boolean;
  setVotingOpenEventHall: (open: boolean) => void;
  votingOpenHome: boolean;
  setVotingOpenHome: (open: boolean) => void;
}

export default function VotingControl({
  votingOpenEventHall,
  setVotingOpenEventHall,
  votingOpenHome,
  setVotingOpenHome,
}: Props) {
  const allOpen = votingOpenEventHall && votingOpenHome;
  const allClosed = !votingOpenEventHall && !votingOpenHome;
  const partialOpen = !allOpen && !allClosed;

  return (
    <div className={styles.container}>
      <h2>Stemming Controle</h2>
      <p className={styles.subtext}>Beheer de stemming status per locatie</p>

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
          {allOpen && "Zowel event hall als thuiskiezers kunnen stemmen."}
          {allClosed && "Niemand kan momenteel stemmen."}
          {partialOpen && "Sommige kiezers kunnen stemmen, anderen niet."}
        </p>
      </div>

      {/* Event Hall */}
      <div className={styles.controlRow}>
        <div className={styles.controlInfo}>
          <div
            className={`${styles.iconBox} ${
              votingOpenEventHall ? styles.iconGreen : styles.iconRed
            }`}
          >
            <Building2 />
          </div>
          <div>
            <p className={styles.controlTitle}>Event Hall Stemming</p>
            <p className={styles.controlDescription}>
              {votingOpenEventHall
                ? "Open voor fysieke aanwezigen"
                : "Gesloten voor fysieke aanwezigen"}
            </p>
          </div>
        </div>

        <label className={styles.switch}>
          <input
            type="checkbox"
            checked={votingOpenEventHall}
            onChange={() => setVotingOpenEventHall(!votingOpenEventHall)}
          />
          <span className={styles.slider}></span>
        </label>
      </div>

      {/* Home */}
      <div className={styles.controlRow}>
        <div className={styles.controlInfo}>
          <div
            className={`${styles.iconBox} ${
              votingOpenHome ? styles.iconGreen : styles.iconRed
            }`}
          >
            <Home />
          </div>
          <div>
            <p className={styles.controlTitle}>Thuis Stemming</p>
            <p className={styles.controlDescription}>
              {votingOpenHome
                ? "Open voor thuiskiezers"
                : "Gesloten voor thuiskiezers"}
            </p>
          </div>
        </div>

        <label className={styles.switch}>
          <input
            type="checkbox"
            checked={votingOpenHome}
            onChange={() => setVotingOpenHome(!votingOpenHome)}
          />
          <span className={styles.slider}></span>
        </label>
      </div>

      {/* Buttons */}
      <div className={styles.actionButtons}>
        {!allOpen && (
          <Button
            onClick={() => {
              setVotingOpenEventHall(true);
              setVotingOpenHome(true);
            }}
          >
            Alles Open
          </Button>
        )}

        {!allClosed && (
          <Button
            onClick={() => {
              setVotingOpenEventHall(false);
              setVotingOpenHome(false);
            }}
            style={{ background: "#dc2626" }}
          >
            Alles Sluiten
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className={styles.statsGrid}>
        <div className={styles.statsBox}>
          <h4>Event Hall</h4>
          <p>Totaal stemmen: 67</p>
          <p>Unieke kiezers: 52</p>
          <p>
            Status:{" "}
            <span
              className={
                votingOpenEventHall ? styles.statGreen : styles.statRed
              }
            >
              {votingOpenEventHall ? "Open" : "Gesloten"}
            </span>
          </p>
        </div>

        <div className={styles.statsBox}>
          <h4>Thuis</h4>
          <p>Totaal stemmen: 48</p>
          <p>Unieke kiezers: 35</p>
          <p>
            Status:{" "}
            <span
              className={votingOpenHome ? styles.statGreen : styles.statRed}
            >
              {votingOpenHome ? "Open" : "Gesloten"}
            </span>
          </p>
        </div>
      </div>

      {/* Overall */}
      <div className={styles.overallGrid}>
        <div>
          <p className={styles.overallValue}>3</p>
          <p className={styles.overallLabel}>Totaal Films</p>
        </div>
        <div>
          <p className={styles.overallValue}>115</p>
          <p className={styles.overallLabel}>Totaal Stemmen</p>
        </div>
        <div>
          <p className={styles.overallValue}>87</p>
          <p className={styles.overallLabel}>Unieke Kiezers</p>
        </div>
      </div>
    </div>
  );
}
