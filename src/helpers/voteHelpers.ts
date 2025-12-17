import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

export async function checkDuplicateVote(
  supabase: SupabaseClient<Database>,
  sessionId: number,
  deviceHash: string
) {
  const { data, error } = await supabase
    .from("vote")
    .select("id")
    .eq("vote_session_id", sessionId)
    .eq("device_hash", deviceHash)
    .limit(1); // ✅ BELANGRIJK

  if (error) throw error;

  return data.length > 0;
}

export async function insertVote(
  supabase: SupabaseClient<Database>,
  sessionId: number,
  filmId: number,
  deviceHash: string,
  ipAddress: string | null,
  isValid: boolean,
  reason?: string
) {
  const { data, error } = await supabase
    .from("vote")
    .insert({
      film_id: filmId,
      device_hash: deviceHash,
      ip_address: ipAddress,
      vote_session_id: sessionId,
      is_valid: isValid,
      fraud_reason: reason ?? null,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}
