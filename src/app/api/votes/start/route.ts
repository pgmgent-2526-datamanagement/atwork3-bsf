// app/api/votes/start/route.ts
import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function POST(req: Request) {
  const supabase = await supabaseServer();
  const { source } = await req.json(); // "zaal" | "online"

  const now = new Date();
  const end = new Date(now.getTime() + 60_000); // 1 minuut

  // Sluit oude sessies van dit type
  await supabase
    .from("vote_session")
    .update({ is_active: false })
    .eq("type", source);

  // Start nieuwe sessie
  const { data, error } = await supabase
    .from("vote_session")
    .insert({
      type: source,
      is_active: true,
      start_time: now.toISOString(),
      end_time: end.toISOString(),
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true, session: data });
}