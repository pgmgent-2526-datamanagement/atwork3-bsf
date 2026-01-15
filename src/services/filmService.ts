// services/filmService.ts
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";
import type {
  CreateFilmInput,
  UpdateFilmInput,
  FilmRow,
  ImportFilmInput,
} from "@/types/film";
import { publicStorageUrl } from "@/helpers/storageUrl";

type DB = SupabaseClient<Database>;
type FilmDbRow = Database["public"]["Tables"]["film"]["Row"];

const BUCKET = "film-images";

function withImageUrl(supabase: DB, film: FilmDbRow): FilmRow {
  return {
    ...film,
    image_url: publicStorageUrl(supabase, BUCKET, film.image_path),
  };
}

export const filmService = {
  // GET ALL FILMS
  async getFilms(supabase: DB): Promise<FilmRow[]> {
    const { data, error } = await supabase
      .from("film")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) throw error;
    return (data ?? []).map((film) => withImageUrl(supabase, film));
  },

  // CREATE FILM
  async createFilm(supabase: DB, input: CreateFilmInput): Promise<FilmRow> {
    const { data, error } = await supabase
      .from("film")
      .insert(input)
      .select("*")
      .single<FilmDbRow>();

    if (error) throw error;
    return withImageUrl(supabase, data);
  },

  // UPDATE FILM
  async updateFilm(supabase: DB, input: UpdateFilmInput): Promise<FilmRow> {
    const { id, ...updates } = input;
    if (!id) throw new Error("Film id is required");

    const { data, error } = await supabase
      .from("film")
      .update(updates)
      .eq("id", id)
      .select("*")
      .maybeSingle<FilmDbRow>();

    if (error) throw error;
    if (!data) throw new Error("Film not found");

    return withImageUrl(supabase, data);
  },

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

    const { data: edition, error: editionError } = await supabase
      .from("edition")
      .select("id")
      .eq("is_active", true)
      .maybeSingle();

    if (editionError) throw editionError;
    if (!edition) {
      throw new Error("Geen actieve editie gevonden.");
    }

    const rowsToInsert = films.map((f) => ({
      number: f.number,
      title: f.title,
      maker: f.maker ?? null,
      tagline: f.tagline ?? null,
      edition_id: edition.id,
      image_path: f.image_path ?? null,
    }));

    const { data, error } = await supabase
      .from("film")
      .insert(rowsToInsert)
      .select("*")
      .returns<FilmDbRow[]>();

    if (error) throw error;

    return (data ?? []).map((film) => withImageUrl(supabase, film));
  },
};
