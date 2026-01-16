// app/api/votes/status/route.ts
import { supabaseServer } from "@/lib/supabaseServer";
import { NextResponse } from "next/server";
import { getActiveEditionId } from "@/helpers/sessionHelpers";

export async function GET() {
  try {
    const supabase = await supabaseServer();
    const editionId = await getActiveEditionId(supabase);
    if (!editionId) {
      return NextResponse.json([], { status: 200 });
    }

    const nowIso = new Date().toISOString();

    // Sluit verlopen sessies (binnen actieve editie)
    await supabase
      .from("vote_session")
      .update({ is_active: false })
      .eq("edition_id", editionId)
      .eq("is_active", true)
      .lt("end_time", nowIso);

    // Haal actieve sessies op (binnen actieve editie)
    const { data, error } = await supabase
      .from("vote_session")
      .select("id, type, end_time")
      .eq("edition_id", editionId)
      .eq("is_active", true);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data ?? []);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Unexpected error" },
      { status: 500 }
    );
  }
}
