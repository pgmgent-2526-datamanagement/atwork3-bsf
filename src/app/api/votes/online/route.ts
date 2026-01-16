import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { voteService } from "@/services/voteService";

export async function POST(req: Request) {
  try {
    const supabase = await supabaseServer();
    const body = await req.json();

    if (!body?.filmId || !body?.deviceHash) {
      return NextResponse.json(
        { success: false, error: "filmId and deviceHash are required" },
        { status: 400 }
      );
    }

    const vote = await voteService.castVote(supabase, {
      filmId: body.filmId,
      deviceHash: body.deviceHash,
      ipAddress: req.headers.get("x-forwarded-for") ?? null,
      source: "online",
    });

    return NextResponse.json({ success: true, vote });
  } catch (err: unknown) {
    const message =
      err instanceof Error
        ? err.message
        : typeof err === "string"
        ? err
        : "Unexpected server error";

    return NextResponse.json(
      { success: false, error: message },
      { status: 400 }
    );
  }
}
