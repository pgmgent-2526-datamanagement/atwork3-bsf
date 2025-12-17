import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";
import type { VoteSource } from "@/types/vote";

export async function getActiveSession(
  supabase: SupabaseClient<Database>,
  source: VoteSource
) {
  const { data, error } = await supabase
    .from("vote_session")
    .select("*")
    .eq("type", source)
    .eq("is_active", true)
    .maybeSingle();

  if (error) throw error;
  return data;
}
