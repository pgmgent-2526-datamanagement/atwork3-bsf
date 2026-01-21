// services/filmService.ts
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";
import type {
  CreateFilmInput,
  UpdateFilmInput,
  FilmRow,
  ImportFilmInput,
} from "@/types/film";
import { publicStorageUrl } from "@/helpers/storageUrlHelper";

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
      .order("created_at", { ascending: false });

    if (error) throw error;
    return (data ?? []).map((film) => withImageUrl(supabase, film));
  },
  // GET FILM BY ID
  async getFilmById(supabase: DB, id: number): Promise<FilmRow | null> {
    const { data, error } = await supabase
      .from("film")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      // als niet gevonden: return null (PGRST116 komt vaak voor bij single)
      return null;
    }
    return withImageUrl(supabase, data);
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
  // UPDATE FILM
  async updateFilm(supabase: DB, input: UpdateFilmInput): Promise<FilmRow> {
    const { id, image, ...updates } = input;
    if (!id) throw new Error("Film id is required");

    // 1) update tekstvelden (zonder image)
    const { data: base, error: e1 } = await supabase
      .from("film")
      .update(updates)
      .eq("id", id)
      .select("*")
      .maybeSingle<FilmDbRow>();

    if (e1) throw e1;
    if (!base) throw new Error("Film not found");

    // 2) als er een nieuwe image is: upload + image_path updaten
    if (image && image instanceof File && image.size > 0) {
      if (!image.type.startsWith("image/")) {
        throw new Error("File must be an image");
      }

      const ext = image.name.split(".").pop()?.toLowerCase() || "jpg";
      const fileName =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? `${crypto.randomUUID()}.${ext}`
          : `${Date.now()}.${ext}`;

      // ✅ zelfde map als POST:
      const image_path = `films/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(BUCKET) // "film-images"
        .upload(image_path, image, {
          contentType: image.type,
          upsert: false, // bij update mag dit true zijn
        });

      if (uploadError) throw uploadError;

      const { data: withPath, error: e2 } = await supabase
        .from("film")
        .update({ image_path })
        .eq("id", id)
        .select("*")
        .maybeSingle<FilmDbRow>();

      if (e2) throw e2;
      if (!withPath) throw new Error("Film not found after image update");

      return withImageUrl(supabase, withPath);
    }

    return withImageUrl(supabase, base);
  },

  // DELETE FILM
  async deleteFilm(supabase: DB, id: number): Promise<void> {
    const { error } = await supabase.from("film").delete().eq("id", id);
    if (error) throw error;
  },

  // IMPORT FILMS → ACTIVE EDITION
  async importFilmsForActiveEdition(
    supabase: DB,
    films: ImportFilmInput[],
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
