// app/api/votes/stop/route.ts
import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function POST(req: Request) {
  const supabase = await supabaseServer();
  const { source } = await req.json();

  await supabase
    .from("vote_session")
    .update({ is_active: false })
    .eq("type", source);

  return NextResponse.json({ success: true });
}
