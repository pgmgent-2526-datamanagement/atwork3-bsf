import { supabaseServer } from "@/lib/supabaseServer";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await supabaseServer();
  const now = new Date().toISOString();

  // 1️⃣ Sluit verlopen sessies
  await supabase
    .from("vote_session")
    .update({ is_active: false })
    .lt("end_time", now)
    .eq("is_active", true);

  // 2️⃣ Haal actieve sessies op
  const { data, error } = await supabase
    .from("vote_session")
    .select("id, type, end_time")
    .eq("is_active", true);

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json(data);
}
