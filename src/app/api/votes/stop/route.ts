// app/api/votes/stop/route.ts
import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { getActiveEditionId } from "@/helpers/sessionHelpers";

export async function POST(req: Request) {
  try {
    const supabase = await supabaseServer();
    const { source } = await req.json();

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

    const { error } = await supabase
      .from("vote_session")
      .update({ is_active: false })
      .eq("type", source)
      .eq("edition_id", editionId)
      .eq("is_active", true);

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
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
