import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

/**
 * Checks if device is blocked.
 */
export async function checkRateLimit(
  supabase: SupabaseClient<Database>,
  deviceHash: string
) {
  const { data: blocked } = await supabase
    .from("device_blocklist")
    .select("id")
    .eq("device_hash", deviceHash)
    .maybeSingle();

  if (blocked) {
    return { allowed: false, reason: "DEVICE_BLOCKED" };
  }

  return { allowed: true };
}
