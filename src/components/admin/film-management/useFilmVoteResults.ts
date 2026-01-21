"use client";

import { useEffect, useMemo, useState } from "react";
import { FilmVoteResult, CombinedApiResponse } from "@/types/film";


export function useFilmVoteResults(pollMs = 5000) {
  const [results, setResults] = useState<FilmVoteResult[]>([]);
  const [votesLoading, setVotesLoading] = useState(true);
  const [votesError, setVotesError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    const load = async () => {
      try {
        setVotesError(null);

        const res = await fetch("/api/votes/results/combined", {
          cache: "no-store",
          credentials: "include", // handig als je admin auth via cookies doet
        });

        const json = (await res.json()) as CombinedApiResponse;

        if (!res.ok || !json.success) {
          const msg = !json.success
            ? json.error
            : "Failed to load vote results";
          throw new Error(msg);
        }

        if (alive) setResults(json.results);
      } catch (e) {
        if (alive) {
          setVotesError(e instanceof Error ? e.message : "Unexpected error");
        }
      } finally {
        if (alive) setVotesLoading(false);
      }
    };

    load();
    const t = setInterval(load, pollMs);

    return () => {
      alive = false;
      clearInterval(t);
    };
  }, [pollMs]);

  // ✅ KEY FIX: map op filmId, niet op id
  const voteMap = useMemo(() => {
    return new Map<number, FilmVoteResult>(results.map((r) => [r.filmId, r]));
  }, [results]);

  return { voteMap, votesLoading, votesError };
}
