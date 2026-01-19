import { Film, UpdateFilmInput } from "../types/film";
import { supabase } from "./supabaseClient";

export async function getFilms(): Promise<Film[]> {
  const { data, error } = await supabase
    .from("film") // <-- jouw table naam
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data as Film[];
}

export async function updateFilm(input: UpdateFilmInput): Promise<Film> {
  const { id, ...patch } = input;

  // patch bevat alleen de velden die je wil updaten (optioneel)
  const { data, error } = await supabase
    .from("film")
    .update(patch)
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return data as Film;
}

export async function deleteFilm(id: number): Promise<void> {
  const { error } = await supabase.from("film").delete().eq("id", id);

  if (error) throw new Error(error.message);
}