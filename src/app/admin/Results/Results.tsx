"use client";

import { useState, useEffect } from "react";
import { TrendingUp, Users, Trophy, Building2, Home } from "lucide-react";
import styles from "./Results.module.css";

interface FilmResult {
  id: string;
  title: string;
  votes: number;
  votesEventHall: number;
  votesHome: number;
  percentage: number;
}

export default function Results() {
  const [activeTab, setActiveTab] = useState<"all" | "eventhall" | "home">(
    "all"
  );

  const [results, setResults] = useState<FilmResult[]>([
    {
      id: "1",
      title: "The Shawshank Redemption",
      votes: 45,
      votesEventHall: 28,
      votesHome: 17,
      percentage: 39.1,
    },
    {
      id: "2",
      title: "The Godfather",
      votes: 38,
      votesEventHall: 21,
      votesHome: 17,
      percentage: 33.0,
    },
    {
      id: "3",
      title: "Pulp Fiction",
      votes: 32,
      votesEventHall: 18,
      votesHome: 14,
      percentage: 27.8,
    },
  ]);

  // LIVE updates simulatie
  useEffect(() => {
    const interval = setInterval(() => {
      setResults((prev) => {
        const updated = prev.map((film) => {
          const randomChangeEventHall = Math.random() > 0.6 ? 1 : 0;
          const randomChangeHome = Math.random() > 0.6 ? 1 : 0;

          const newEvent = film.votesEventHall + randomChangeEventHall;
          const newHome = film.votesHome + randomChangeHome;

          return {
            ...film,
            votesEventHall: newEvent,
            votesHome: newHome,
            votes: newEvent + newHome,
          };
        });

        const totalVotes = updated.reduce((s, f) => s + f.votes, 0);

        return updated.map((film) => ({
          ...film,
          percentage:
            totalVotes > 0 ? (film.votes / totalVotes) * 100 : film.percentage,
        }));
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Aggregates
  const totalVotes = results.reduce((s, f) => s + f.votes, 0);
  const totalEventHallVotes = results.reduce((s, f) => s + f.votesEventHall, 0);
  const totalHomeVotes = results.reduce((s, f) => s + f.votesHome, 0);

  const sortedTotal = [...results].sort((a, b) => b.votes - a.votes);
  const sortedEventHall = [...results].sort(
    (a, b) => b.votesEventHall - a.votesEventHall
  );
  const sortedHome = [...results].sort((a, b) => b.votesHome - a.votesHome);

  return (
    <div className={styles.container}>
      {/* STATS CARDS */}
      <div className={styles.statsGrid}>
        <div className={`${styles.card}`}>
          <div className={styles.statHeader}>
            <span>Totaal Stemmen</span>
            <Users className={styles.statIcon} />
          </div>
          <div className={styles.statValue}>{totalVotes}</div>
          <p className={styles.statDescription}>
            <span className={styles.statTrend}>
              <TrendingUp className={styles.trendIcon} /> +12%
            </span>{" "}
            vs vorig uur
          </p>
        </div>

        <div className={styles.card}>
          <div className={styles.statHeader}>
            <span>Event Hall</span>
            <Building2 className={styles.statIcon} />
          </div>
          <div className={styles.statValue}>{totalEventHallVotes}</div>
          <p className={styles.statDescription}>
            {((totalEventHallVotes / totalVotes) * 100).toFixed(1)}% van totaal
          </p>
        </div>

        <div className={styles.card}>
          <div className={styles.statHeader}>
            <span>Thuis</span>
            <Home className={styles.statIcon} />
          </div>
          <div className={styles.statValue}>{totalHomeVotes}</div>
          <p className={styles.statDescription}>
            {((totalHomeVotes / totalVotes) * 100).toFixed(1)}% van totaal
          </p>
        </div>

        <div className={styles.card}>
          <div className={styles.statHeader}>
            <span>Meest Populair</span>
            <Trophy className={styles.statIcon} />
          </div>
          <div className={styles.statValue}>
            {sortedTotal[0]?.title.split(" ")[0] || "N/A"}
          </div>
          <p className={styles.statDescription}>
            {sortedTotal[0]?.votes || 0} stemmen (
            {sortedTotal[0]?.percentage.toFixed(1) || 0}%)
          </p>
        </div>
      </div>

      {/* TABS */}
      <div className={styles.tabs}>
        <button
          onClick={() => setActiveTab("all")}
          className={`${styles.tab} ${
            activeTab === "all" ? styles.tabActive : ""
          }`}
        >
          Alle Stemmen
        </button>

        <button
          onClick={() => setActiveTab("eventhall")}
          className={`${styles.tab} ${
            activeTab === "eventhall" ? styles.tabActive : ""
          }`}
        >
          <Building2 className={styles.tabIcon} />
          Event Hall
        </button>

        <button
          onClick={() => setActiveTab("home")}
          className={`${styles.tab} ${
            activeTab === "home" ? styles.tabActive : ""
          }`}
        >
          <Home className={styles.tabIcon} />
          Thuis
        </button>
      </div>

      {/* TAB CONTENT */}
      {activeTab === "all" && (
        <div className={styles.rankingList}>
          {sortedTotal.map((film, index) => (
            <div key={film.id} className={styles.rankingItem}>
              <div className={styles.rankingRow}>
                <div
                  className={`${styles.rankBadge} ${
                    index === 0
                      ? styles.rankBadgeGold
                      : index === 1
                      ? styles.rankBadgeSilver
                      : index === 2
                      ? styles.rankBadgeBronze
                      : styles.rankBadgeDefault
                  }`}
                >
                  {index + 1}
                </div>

                <div className={styles.rankingContent}>
                  <div className={styles.rankingHeader}>
                    <span className={styles.rankingTitle}>{film.title}</span>
                  </div>

                  <div className={styles.progressBar}>
                    <div
                      className={`${styles.progressFill} ${
                        index === 0
                          ? styles.progressFillGold
                          : index === 1
                          ? styles.progressFillSilver
                          : index === 2
                          ? styles.progressFillBronze
                          : styles.progressFillDefault
                      }`}
                      style={{ width: `${film.percentage}%` }}
                    ></div>
                  </div>

                  <div className={styles.rankingFooter}>
                    <div className={styles.rankingStats}>
                      <span className={styles.rankingStat}>
                        <Building2 className={styles.statIconSmall} />
                        {film.votesEventHall}
                      </span>
                      <span className={styles.rankingStat}>
                        <Home className={styles.statIconSmall} />
                        {film.votesHome}
                      </span>
                    </div>

                    <span className={styles.rankingPercentage}>
                      {film.percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* EVENT HALL ONLY */}
      {activeTab === "eventhall" && (
        <div className={styles.rankingList}>
          {sortedEventHall.map((film, index) => (
            <div key={film.id} className={styles.listItem}>
              <div className={styles.listItemLeft}>
                <div
                  className={`${styles.listItemBadge} ${styles.listItemBadgeBlue}`}
                >
                  {index + 1}
                </div>
                <span className={styles.listItemTitle}>{film.title}</span>
              </div>

              <div className={styles.listItemRight}>
                <div className={styles.listItemVotes}>
                  <Building2 className={styles.listItemIcon} />
                  {film.votesEventHall} stemmen
                </div>
                <span className={styles.listItemPercentage}>
                  {totalEventHallVotes > 0
                    ? (
                        (film.votesEventHall / totalEventHallVotes) *
                        100
                      ).toFixed(1)
                    : 0}
                  %
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* HOME ONLY */}
      {activeTab === "home" && (
        <div className={styles.rankingList}>
          {sortedHome.map((film, index) => (
            <div key={film.id} className={styles.listItem}>
              <div className={styles.listItemLeft}>
                <div
                  className={`${styles.listItemBadge} ${styles.listItemBadgePurple}`}
                >
                  {index + 1}
                </div>
                <span className={styles.listItemTitle}>{film.title}</span>
              </div>

              <div className={styles.listItemRight}>
                <div className={styles.listItemVotes}>
                  <Home className={styles.listItemIcon} />
                  {film.votesHome} stemmen
                </div>
                <span className={styles.listItemPercentage}>
                  {totalHomeVotes > 0
                    ? ((film.votesHome / totalHomeVotes) * 100).toFixed(1)
                    : 0}
                  %
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
