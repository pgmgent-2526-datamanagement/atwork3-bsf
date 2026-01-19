import "server-only";
import { SupabaseClient } from "@supabase/supabase-js";

export async function fetchCurrentEditionWithFilms(supabase: SupabaseClient) {
  const { data: edition, error: e1 } = await supabase
    .from("edition")
    .select("*")
    .eq("is_active", true)
    .maybeSingle();

  if (e1) throw new Error(e1.message);

  const { data: films, error: e2 } = edition
    ? await supabase
        .from("film")
        .select("*")
        .eq("edition_id", edition.id)
        .order("created_at", { ascending: false })
    : { data: [], error: null };

  if (e2) throw new Error(e2.message);

  return { edition, films: films ?? [] };
}
