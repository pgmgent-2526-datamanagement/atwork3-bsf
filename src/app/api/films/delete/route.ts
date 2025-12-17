import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { filmService } from "@/services/filmService";

export async function DELETE(req: Request) {
  const supabase = await supabaseServer();
  const body = await req.json();

  try {
    await filmService.deleteFilm(supabase, body.id);
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 400 }
    );
  }
}
