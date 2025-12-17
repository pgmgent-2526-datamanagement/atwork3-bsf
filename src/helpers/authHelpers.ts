import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

export async function assertAdmin(
  supabase: SupabaseClient<Database>,
  userId: string
) {
  const { data, error } = await supabase
    .from("admin_users")
    .select("id")
    .eq("id", userId)
    .single();

  if (error || !data) {
    throw new Error("FORBIDDEN");
  }
}
