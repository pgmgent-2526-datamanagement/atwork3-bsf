"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SuccessPage } from "@/components/succes/SuccesPage";

import { supabase } from "@/lib/supabaseClient";
import { filmService } from "@/services/filmService";
import type { FilmRow } from "@/types/film";

export default function Page() {
  const params = useSearchParams();
  const filmParam = params.get("film");

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

        // Only ~10 films, fetching all is fine and simple
        const films = await filmService.getFilms(supabase);
        const found = films.find((f) => f.id === filmId) ?? null;
        

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
