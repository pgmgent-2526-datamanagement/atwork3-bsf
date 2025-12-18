// services/filmService.ts
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";
import type {
  CreateFilmInput,
  UpdateFilmInput,
  FilmRow,
  ImportFilmInput,
} from "@/types/film";

type DB = SupabaseClient<Database>;

export const filmService = {
  // GET ALL FILMS

  async getFilms(supabase: DB): Promise<FilmRow[]> {
    const { data, error } = await supabase
      .from("film")
      .select("*")
      .order("number", { ascending: true });

    if (error) throw error;
    return data ?? [];
  },

  // CREATE FILM

  async createFilm(supabase: DB, input: CreateFilmInput): Promise<FilmRow> {
    const { data, error } = await supabase
      .from("film")
      .insert(input)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // UPDATE FILM

async updateFilm(
  supabase: DB,
  input: UpdateFilmInput
): Promise<FilmRow> {
  const {
    id,
    edition_id,
    number,
    title,
    tagline,
    maker,
    thumbnail_url,
    image_url,
  } = input;

  if (!id) {
    throw new Error("Film id is required");
  }

  const updates = {
    ...(edition_id !== undefined && { edition_id }),
    ...(number !== undefined && { number }),
    ...(title !== undefined && { title }),
    ...(tagline !== undefined && { tagline }),
    ...(maker !== undefined && { maker }),
    ...(thumbnail_url !== undefined && { thumbnail_url }),
    ...(image_url !== undefined && { image_url }),
  };

  const { data, error } = await supabase
    .from("film")
    .update(updates)
    .eq("id", id)
    .select()
    .maybeSingle();

  if (error) {
    console.error("updateFilm error:", error);
    throw new Error(error.message);
  }
  if (!data) {
    throw new Error("Film not found");
  }

  return data;
}
,

  // DELETE FILM

  async deleteFilm(supabase: DB, id: number): Promise<void> {
    const { error } = await supabase.from("film").delete().eq("id", id);
    if (error) throw error;
  },

  // IMPORT FILMS → ACTIVE EDITION

  async importFilmsForActiveEdition(
    supabase: DB,
    films: ImportFilmInput[]
  ): Promise<FilmRow[]> {
    if (!Array.isArray(films) || films.length === 0) {
      throw new Error("Geen films om te importeren.");
    }

    // 1. Haal de actieve editie op
    const { data: edition, error: editionError } = await supabase
      .from("edition")
      .select("id, year")
      .eq("is_active", true)
      .maybeSingle();

    if (editionError) throw editionError;
    if (!edition) {
      throw new Error(
        "Geen actieve editie gevonden om films in te importeren."
      );
    }

    // 2. Map import data naar film rows
    const rowsToInsert = films.map((f) => ({
      number: f.number,
      title: f.title,
      maker: f.maker,
      image_text: f.image_text,
      tagline: f.tagline ?? null,
      thumbnail_url: f.thumbnail_url ?? null,
      edition_id: edition.id,
    }));

    // 3. Insert in bulk
    const { data, error } = await supabase
      .from("film")
      .insert(rowsToInsert)
      .select();

    if (error) throw error;
    return data ?? [];
  },
};
