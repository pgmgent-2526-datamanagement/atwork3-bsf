import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { voteService } from "@/services/voteService";

export async function GET() {
  const supabase = supabaseServer();
  const results = await voteService.getResultsForSource(supabase, "online");
  return NextResponse.json(results);
}
