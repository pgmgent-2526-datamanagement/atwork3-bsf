// app/api/films/import/route.ts
import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { parseFilmFile } from "@/helpers/parseFilmFile";
import { filmService } from "@/services/filmService";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const form = await req.formData();
  const file = form.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json(
      { success: false, error: "Upload een bestand via 'file' veld." },
      { status: 400 }
    );
  }

  try {
    const supabase = await supabaseServer();
    const films = await parseFilmFile(file);

    const inserted = await filmService.importFilmsForActiveEdition(
      supabase,
      films
    );

    return NextResponse.json({
      success: true,
      count: inserted.length,
      films: inserted,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}




