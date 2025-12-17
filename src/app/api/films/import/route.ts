import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminGuard";
import { parseFilmFile } from "@/helpers/parseFilmFile";
import { filmService } from "@/services/filmService";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { supabase } = await requireAdmin();

    const form = await req.formData();
    const file = form.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { success: false, error: "Upload een bestand via 'file' veld." },
        { status: 400 }
      );
    }

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
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === "UNAUTHORIZED") {
        return NextResponse.json(
          { success: false, error: "Not authenticated" },
          { status: 401 }
        );
      }

      if (err.message === "FORBIDDEN") {
        return NextResponse.json(
          { success: false, error: "Admin access required" },
          { status: 403 }
        );
      }

      return NextResponse.json(
        { success: false, error: err.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Unexpected server error" },
      { status: 500 }
    );
  }
}
