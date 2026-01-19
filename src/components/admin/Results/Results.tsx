"use client";

import { useState, useEffect, useMemo } from "react";
import { TrendingUp, Users, Trophy, Building2, Home } from "lucide-react";
import { Button } from "@/components/ui/Button";
import styles from "./Results.module.css";

interface FilmResult {
  id: number;
  title: string;
  votes: number;
  votesEventHall: number;
  votesHome: number;
  percentage: number;
}

type CombinedApiResponse =
  | { success: true; results: FilmResult[] }
  | { success: false; error: string };

export default function Results() {
  const [activeTab, setActiveTab] = useState<"all" | "eventhall" | "home">(
    "all",
  );
  const [results, setResults] = useState<FilmResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    const load = async () => {
      try {
        setError(null);

        const res = await fetch("/api/votes/results/combined", {
          cache: "no-store",
        });
        const json = (await res.json()) as CombinedApiResponse;

        if (!res.ok || !json.success) {
          const msg = !json.success ? json.error : "Failed to load results";
          throw new Error(msg);
        }

        if (alive) setResults(json.results);
      } catch (e) {
        if (alive)
          setError(e instanceof Error ? e.message : "Unexpected error");
      } finally {
        if (alive) setLoading(false);
      }
    };

    load();
    const interval = setInterval(load, 5000);

    return () => {
      alive = false;
      clearInterval(interval);
    };
  }, []);

  const totalVotes = useMemo(
    () => results.reduce((s, f) => s + f.votes, 0),
    [results],
  );
  const totalEventHallVotes = useMemo(
    () => results.reduce((s, f) => s + f.votesEventHall, 0),
    [results],
  );
  const totalHomeVotes = useMemo(
    () => results.reduce((s, f) => s + f.votesHome, 0),
    [results],
  );

  const sortedTotal = useMemo(
    () => [...results].sort((a, b) => b.votes - a.votes),
    [results],
  );
  const sortedEventHall = useMemo(
    () => [...results].sort((a, b) => b.votesEventHall - a.votesEventHall),
    [results],
  );
  const sortedHome = useMemo(
    () => [...results].sort((a, b) => b.votesHome - a.votesHome),
    [results],
  );

  const keyOf = (film: FilmResult, tab: string, index: number) =>
    film.id != null ? `${film.id}-${tab}` : `${film.title}-${tab}-${index}`;

  return (
    <div className={styles.container}>
      {loading && <div className={styles.card}>Resultaten laden…</div>}
      {error && <div className={styles.card}>Error: {error}</div>}

      <div className={styles.statsGrid}>
        <div className={styles.card}>
          <div className={styles.statHeader}>
            <span>Totaal Stemmen</span>
            <Users className={styles.statIcon} />
          </div>
          <div className={styles.statValue}>{totalVotes}</div>
          <p className={styles.statDescription}>
            <span className={styles.statTrend}>
              <TrendingUp className={styles.trendIcon} /> live
            </span>{" "}
            (auto refresh)
          </p>
        </div>

        <div className={styles.card}>
          <div className={styles.statHeader}>
            <span>Event Hall</span>
            <Building2 className={styles.statIcon} />
          </div>
          <div className={styles.statValue}>{totalEventHallVotes}</div>
          <p className={styles.statDescription}>
            {totalVotes > 0
              ? ((totalEventHallVotes / totalVotes) * 100).toFixed(1)
              : "0.0"}
            % van totaal
          </p>
        </div>

        <div className={styles.card}>
          <div className={styles.statHeader}>
            <span>Thuis</span>
            <Home className={styles.statIcon} />
          </div>
          <div className={styles.statValue}>{totalHomeVotes}</div>
          <p className={styles.statDescription}>
            {totalVotes > 0
              ? ((totalHomeVotes / totalVotes) * 100).toFixed(1)
              : "0.0"}
            % van totaal
          </p>
        </div>

        <div className={styles.card}>
          <div className={styles.statHeader}>
            <span>Meest Populair</span>
            <Trophy className={styles.statIcon} />
          </div>
          <div className={styles.statValue}>
            {sortedTotal[0]?.title?.split(" ")[0] || "N/A"}
          </div>
          <p className={styles.statDescription}>
            {sortedTotal[0]?.votes || 0} stemmen (
            {(sortedTotal[0]?.percentage ?? 0).toFixed(1)}%)
          </p>
        </div>
      </div>

      <div className={styles.tabs}>
        <Button
          onClick={() => setActiveTab("all")}
          className={`${styles.tab} ${
            activeTab === "all" ? styles.tabActive : ""
          }`}
        >
          Alle Stemmen
        </Button>

        <Button
          onClick={() => setActiveTab("eventhall")}
          className={`${styles.tab} ${
            activeTab === "eventhall" ? styles.tabActive : ""
          }`}
        >
          <Building2 className={styles.tabIcon} />
          Event Hall
        </Button>

        <Button
          onClick={() => setActiveTab("home")}
          className={`${styles.tab} ${
            activeTab === "home" ? styles.tabActive : ""
          }`}
        >
          <Home className={styles.tabIcon} />
          Thuis
        </Button>
      </div>

      {activeTab === "all" && (
        <div className={styles.rankingList}>
          {sortedTotal.map((film, index) => (
            <div key={keyOf(film, "all", index)} className={styles.rankingItem}>
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
                    />
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

      {activeTab === "eventhall" && (
        <div className={styles.rankingList}>
          {sortedEventHall.map((film, index) => (
            <div
              key={keyOf(film, "eventhall", index)}
              className={styles.listItem}
            >
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
                    : "0.0"}
                  %
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "home" && (
        <div className={styles.rankingList}>
          {sortedHome.map((film, index) => (
            <div key={keyOf(film, "home", index)} className={styles.listItem}>
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
                    : "0.0"}
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
