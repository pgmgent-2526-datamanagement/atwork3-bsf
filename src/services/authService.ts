import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";
import { assertAdmin } from "@/helpers/authHelpers";

type DB = SupabaseClient<Database>;

export const authService = {
  async loginAdmin(supabase: DB, email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error("INVALID_CREDENTIALS");
    }

    const userId = data.user.id;

    await assertAdmin(supabase, userId);

    return data.user;
  },

  async registerAdmin(
    supabase: DB,
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error || !data.user) {
      throw new Error("REGISTER_FAILED");
    }

    const { error: insertError } = await supabase
      .from("admin_users")
      .insert({
        id: data.user.id,
        first_name: firstName,
        last_name: lastName,
        role: "admin",
      });

    if (insertError) {
      throw new Error("ADMIN_INSERT_FAILED");
    }

    return data.user;
  },

  async logout(supabase: DB) {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error("LOGOUT_FAILED");
  },
};
