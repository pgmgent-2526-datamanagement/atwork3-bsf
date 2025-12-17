import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { voteService } from "@/services/voteService";

export async function GET() {
  const supabase = supabaseServer();

  try {
    const results = await voteService.getResultsForSource(supabase, "online");
    return NextResponse.json(results);

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
