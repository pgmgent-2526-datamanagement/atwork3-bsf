// src/helpers/sessionHelpers.ts
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";
import type { VoteSource } from "@/types/vote";

type DB = SupabaseClient<Database>;

/**
 * Get active edition id (edition.is_active = true)
 */
export async function getActiveEditionId(supabase: DB): Promise<number | null> {
  const { data, error } = await supabase
    .from("edition")
    .select("id")
    .eq("is_active", true)
    .order("year", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data?.id ?? null;
}

/**
 * Get active vote session for a source (zaal/online) AND active edition.
 */
export async function getActiveSession(
  supabase: DB,
  source: VoteSource
): Promise<Database["public"]["Tables"]["vote_session"]["Row"] | null> {
  const editionId = await getActiveEditionId(supabase);
  if (!editionId) return null;

  const { data, error } = await supabase
    .from("vote_session")
    .select("*")
    .eq("is_active", true)
    .eq("type", source)
    .eq("edition_id", editionId)
    .order("start_time", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data ?? null;
}
