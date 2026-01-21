// types/film.ts
import type { Tables } from "./supabase";

export type FilmRow = Tables<"film"> & {
  /**
   * Computed at runtime from Storage paths (Option B).
   * Not stored in DB, but handy so UI can keep using image_url fields.
   */
  image_url?: string | null;
  thumbnail_url?: string | null;
};

export interface CreateFilmInput {
  title: string;
  maker?: string | null;
  tagline?: string | null;
  edition_id?: number | null;
  image?: File | null;
  /**
   * Option B (recommended): Storage object paths in bucket `film-images`
   * Example: "2026/the-godfather.jpg"
   */
  thumbnail_path?: string | null;
  image_path?: string | null;
  /**
   * Legacy Option A fields (keep optional during transition)
   * You can remove later once everything uses paths.
   */
  thumbnail_url?: string | null;
}

export type NewFilm = {
  title: string;
  tagline: string;
  maker: string;
  image: File | null;
};

export interface UpdateFilmInput {
  id: number;
  title?: string;
  maker?: string | null;
  tagline?: string | null;
  edition_id?: number | null;

  // Option B paths
  image_path?: string | null;
  thumbnail_path?: string | null;

  // legacy (optional)
  image?: File;
  thumbnail_url?: string | null;
}

/**
 * Data that comes in via import (CSV/Excel/JSON).
 * For Option B, import should provide image_path/thumbnail_path.
 */
export interface ImportFilmInput {
  number: number;
  title: string;
  maker?: string | null;
  tagline?: string | null;

  image_path?: string | null;
  image_text?: string | null;
  thumbnail_path?: string | null;
}

export interface VoteExportRow {
  filmId: number;
  title: string;
  zaalCount: number;
  onlineCount: number;
  total: number;
}

export interface FilmVoteResult {
  filmId: number;
  title: string;
  votes: number;
  votesEventHall: number;
  votesHome: number;
  percentage: number;
}

export type CombinedApiResponse =
  | { success: true; results: FilmVoteResult[] }
  | { success: false; error: string };


export type Film = FilmRow & {
  votesTotal?: number | null;
  imageUrl?: string | null;
  thumbnailUrl?: string | null;
};

export type FilmsResponse = {
  success: boolean;
  films: Film[];
  error?: string;
};

export type CreateFilmResponse =
  | { success: true; film: Film }
  | { success: false; error: string };


  