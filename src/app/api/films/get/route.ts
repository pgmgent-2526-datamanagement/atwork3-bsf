import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { filmService } from "@/services/filmService";

export async function GET() {
  const supabase = await supabaseServer();

  try {
    const films = await filmService.getFilms(supabase);
    return NextResponse.json({ success: true, films });
  } catch (err: unknown) {
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 400 }
    );
  }
}
