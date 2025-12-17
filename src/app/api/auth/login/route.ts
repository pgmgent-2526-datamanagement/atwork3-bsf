import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function POST(req: Request) {
  const supabase = await supabaseServer();
  const { email, password } = await req.json();

  // 1. Login
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }

  const userId = data.user.id;

  // 2. Check admin_users
  const { data: admin } = await supabase
    .from("admin_users")
    .select("*")
    .eq("id", userId)
    .single();

  if (!admin) {
    await supabase.auth.signOut();
    return NextResponse.json(
      { error: "You are not an admin" },
      { status: 403 }
    );
  }

  return NextResponse.json({ success: true, admin, message: "Login successful" });
}
