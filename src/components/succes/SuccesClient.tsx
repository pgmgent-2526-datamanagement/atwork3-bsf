"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SuccessPage } from "@/components/succes/SuccesPage";
import { supabase } from "@/lib/supabaseClient";
import { filmService } from "@/services/filmService";
import type { FilmRow } from "@/types/film";

export function SuccessClient() {
  const params = useSearchParams();
  const filmParam = params.get("filmId");

  const filmId = useMemo(() => {
    const n = filmParam ? Number(filmParam) : NaN;
    return Number.isFinite(n) ? n : null;
  }, [filmParam]);

  const [film, setFilm] = useState<FilmRow | null>(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        if (filmId === null) {
          if (mounted) setFilm(null);
          return;
        }

        const found = await filmService.getFilmById(supabase, filmId);
        if (mounted) setFilm(found);
      } catch (err) {
        console.error("Failed to load film for success page:", err);
        if (mounted) setFilm(null);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [filmId]);

  return <SuccessPage film={film} />;
}
