import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function POST(req: Request) {
  const supabase = await supabaseServer();
  const body = await req.json();

  const { email, password, first_name, last_name } = body;

  // 1. Maak auth user
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  const userId = data.user?.id;

  if (!userId) {
    return NextResponse.json(
      { error: "User was not created" },
      { status: 400 }
    );
  }

  // 2. Voeg admin record toe in public.admin_users
  const { error: insertError } = await supabase.from("admin_users").insert({
    id: userId,
    first_name,
    last_name,
    role: "admin",
  });

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 400 });
  }

  return NextResponse.json({
    success: true,
    message: "User registered successfully",
  });
}
