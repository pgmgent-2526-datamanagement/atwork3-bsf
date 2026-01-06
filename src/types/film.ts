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
  number: number;
  maker?: string | null;
  tagline?: string | null;
  edition_id?: number | null;

  /**
   * Option B (recommended): Storage object paths in bucket `film-images`
   * Example: "2026/the-godfather.jpg"
   */
  image_path?: string | null;
  thumbnail_path?: string | null;

  /**
   * Legacy Option A fields (keep optional during transition)
   * You can remove later once everything uses paths.
   */
  image_url?: string | null;
  thumbnail_url?: string | null;
}

export interface UpdateFilmInput {
  id: number;
  title?: string;
  maker?: string | null;
  tagline?: string | null;
  edition_id?: number | null;
  number?: number;

  // Option B paths
  image_path?: string | null;
  thumbnail_path?: string | null;

  // legacy (optional)
  image_url?: string | null;
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
  thumbnail_path?: string | null;
}

export interface VoteExportRow {
  filmId: number;
  filmNumber: number | null;
  title: string;
  zaalCount: number;
  onlineCount: number;
  total: number;
}
