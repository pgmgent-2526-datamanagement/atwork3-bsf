import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";
import type { VoteSource } from "@/types/vote";

export async function getActiveSession(
  supabase: SupabaseClient<Database>,
  source: VoteSource
) {
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("vote_session")
    .select("*")
    .eq("type", source)
    .eq("is_active", true)
    .lte("start_time", now)   // ✅ gestart
    .gte("end_time", now)     // ✅ nog niet verlopen
    .order("created_at", { ascending: false })
    .limit(1);

  if (error) throw error;

  return data?.[0] ?? null;
}
