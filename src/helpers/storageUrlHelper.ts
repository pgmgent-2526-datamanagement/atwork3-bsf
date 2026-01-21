// helpers/storageUrl.ts
import type { SupabaseClient } from "@supabase/supabase-js";

export function publicStorageUrl(
  supabase: SupabaseClient,
  bucket: string,
  path?: string | null
) {
  if (!path) return null;
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl ?? null;
}
