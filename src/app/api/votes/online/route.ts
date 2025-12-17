import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { voteService } from "@/services/voteService";

export async function POST(req: Request) {
  const supabase = await supabaseServer();
  const body = await req.json();

  try {
    const vote = await voteService.castVote(supabase, {
      filmId: body.filmId,
      deviceHash: body.deviceHash,
      ipAddress: req.headers.get("x-forwarded-for") ?? null,
      source: "online",
    });

    return NextResponse.json({ success: true, vote });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 400 }
    );
  }
}
