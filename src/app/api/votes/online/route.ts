import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { voteService } from "@/services/voteService";

export async function POST(req: Request) {
  const supabase = supabaseServer();
  const body = await req.json();

  try {
    const vote = await voteService.castVote(supabase, {
      filmId: body.filmId,
      deviceHash: body.deviceHash,
      ipAddress: req.headers.get("x-forwarded-for"),
      source: "online",
    });

    return NextResponse.json({ success: true, vote });

  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json({ success: false, error: err.message }, { status: 400 });
    }
    return NextResponse.json(
      { success: false, error: "Unknown error occurred" },
      { status: 400 }
    );
  }
}

