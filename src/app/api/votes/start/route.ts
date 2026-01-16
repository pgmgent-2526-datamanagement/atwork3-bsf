// app/api/votes/start/route.ts
import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { getActiveEditionId } from "@/helpers/sessionHelpers";

export async function POST(req: Request) {
  try {
    const supabase = await supabaseServer();
    const { source, durationSeconds } = await req.json(); // "zaal" | "online"

    if (source !== "zaal" && source !== "online") {
      return NextResponse.json(
        { success: false, error: "Invalid source" },
        { status: 400 }
      );
    }

    const editionId = await getActiveEditionId(supabase);
    if (!editionId) {
      return NextResponse.json(
        { success: false, error: "No active edition" },
        { status: 400 }
      );
    }

    const now = new Date();
    const seconds = typeof durationSeconds === "number" ? durationSeconds : 60; // default 60s
    const end = new Date(now.getTime() + seconds * 1000);

    // Sluit oude sessies van dit type BINNEN dezelfde editie
    const { error: closeErr } = await supabase
      .from("vote_session")
      .update({ is_active: false })
      .eq("type", source)
      .eq("edition_id", editionId)
      .eq("is_active", true);

    if (closeErr) {
      return NextResponse.json(
        { success: false, error: closeErr.message },
        { status: 400 }
      );
    }

    // Start nieuwe sessie (MET edition_id!)
    const { data, error } = await supabase
      .from("vote_session")
      .insert({
        type: source,
        edition_id: editionId,
        is_active: true,
        start_time: now.toISOString(),
        end_time: end.toISOString(),
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, session: data });
  } catch (e) {
    return NextResponse.json(
      {
        success: false,
        error: e instanceof Error ? e.message : "Unexpected error",
      },
      { status: 500 }
    );
  }
}
