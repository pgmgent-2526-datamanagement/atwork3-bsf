import { supabaseServer } from "@/lib/supabaseServer";

export async function requireAdmin() {
  const supabase = await supabaseServer();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("UNAUTHORIZED");
  }

  const { data: admin, error } = await supabase
    .from("admin_users")
    .select("id")
    .eq("id", user.id)
    .single();

  if (error || !admin) {
    throw new Error("FORBIDDEN");
  }

  return { supabase, user };
}
