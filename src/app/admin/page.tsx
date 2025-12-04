"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Film, Settings, BarChart3, Download, LogOut } from "lucide-react";

import { FilmManagement } from "@/app/admin/FilmManagement/FilmManagement";
import VotingControl from "@/app/admin/VotingControl/VotingControl";
import Results from "@/app/admin/Results/Results";
import  ExportPanel  from "@/app/admin/ExportPanel/ExportPanel";

import styles from "./Dashboard.module.css";

type View = "films" | "voting" | "results" | "export";

export default function Dashboard() {
  const [activeView, setActiveView] = useState<View>("films");
  const [votingOpenEventHall, setVotingOpenEventHall] = useState(false);
  const [votingOpenHome, setVotingOpenHome] = useState(false);

  const navigation = [
    { id: "films" as View, label: "Films Beheren", icon: Film },
    { id: "voting" as View, label: "Stemming Controle", icon: Settings },
    { id: "results" as View, label: "Resultaten", icon: BarChart3 },
    { id: "export" as View, label: "Export", icon: Download },
  ];

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.left}>
          <Film className={styles.logoIcon} />
          <h1>Admin Dashboard</h1>
        </div>

        <div className={styles.right}>
          <span className={styles.status}>
            <span
              className={`${styles.dot} ${
                votingOpenEventHall ? styles.open : styles.closed
              }`}
            />
            Event Hall {votingOpenEventHall ? "Open" : "Gesloten"}
          </span>

          <span className={styles.status}>
            <span
              className={`${styles.dot} ${
                votingOpenHome ? styles.open : styles.closed
              }`}
            />
            Thuis {votingOpenHome ? "Open" : "Gesloten"}
          </span>

          <Button >
            <LogOut className="flex items-center gap-4" />
            Uitloggen
          </Button>
        </div>
      </header>

      {/* Navigation */}
      <nav className={styles.nav}>
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              className={`${styles.navButton} ${
                activeView === item.id ? styles.active : ""
              }`}
              onClick={() => setActiveView(item.id)}
            >
              <Icon size={18} />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Content */}
      <main className={styles.content}>
        {activeView === "films" && <FilmManagement />}
        {activeView === "voting" && (
          <VotingControl
            votingOpenEventHall={votingOpenEventHall}
            setVotingOpenEventHall={setVotingOpenEventHall}
            votingOpenHome={votingOpenHome}
            setVotingOpenHome={setVotingOpenHome}
          />
        )}
        {activeView === "results" && <Results />}
        {activeView === "export" && <ExportPanel />}
      </main>
    </div>
  );
}
