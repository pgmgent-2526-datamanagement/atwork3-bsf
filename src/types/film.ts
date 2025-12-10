// types/film.ts
import type { Tables } from "./supabase";

export type FilmRow = Tables<"film">;

export interface CreateFilmInput {
  title: string;
  number: number;
  maker?: string | null;
  tagline?: string | null;
  thumbnail_url?: string | null;
  image_text?: string | null; 
  edition_id?: number | null;
}

export interface UpdateFilmInput {
  id: number;
  title?: string;
  maker?: string | null;
  tagline?: string | null;
  thumbnail_url?: string | null;
  image_text?: string | null;
  number?: number;
}

/**
 * Data die via import (CSV/Excel/JSON) binnenkomt.
 * Vereist: number, title, maker, image_text
 */
export interface ImportFilmInput {
  number: number;
  title: string;
  maker: string;
  image_text: string;
  tagline?: string | null;
  thumbnail_url?: string | null;
}

export interface VoteExportRow {
  filmId: number;
  filmNumber: number | null;
  title: string;
  zaalCount: number;
  onlineCount: number;
  total: number;
}
