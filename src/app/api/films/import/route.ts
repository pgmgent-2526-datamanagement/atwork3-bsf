import Papa, { ParseResult } from "papaparse";
import { requireAdmin } from "@/lib/adminGuard";

export const runtime = "nodejs";

type CsvRow = {
  number?: string;
  title?: string;
  maker?: string;
  image_text?: string;
  tagline?: string;
  thumbnail_url?: string;
  image_url?: string;
};

function clean(s: unknown): string {
  return String(s ?? "").trim();
}

export async function POST(req: Request) {
  try {
    const { supabase } = await requireAdmin();

    const form = await req.formData();
    const file = form.get("file");

    if (!(file instanceof File)) {
      return Response.json(
        { success: false, error: "No file uploaded" },
        { status: 400 }
      );
    }

    const name = file.name.toLowerCase();
    if (!name.endsWith(".csv")) {
      return Response.json(
        { success: false, error: "Alleen .csv import wordt ondersteund." },
        { status: 400 }
      );
    }

    // 1) Get active edition_id (auto attach)
    const { data: edition, error: editionErr } = await supabase
      .from("edition")
      .select("id,is_active")
      .eq("is_active", true)
      .order("id", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (editionErr) {
      return Response.json(
        { success: false, error: editionErr.message },
        { status: 500 }
      );
    }

    if (!edition?.id) {
      return Response.json(
        {
          success: false,
          error:
            "Geen actieve editie gevonden. Zet eerst een editie op actief.",
        },
        { status: 400 }
      );
    }

    // 2) Parse CSV
    const text = await file.text();

    const parsed: ParseResult<CsvRow> = Papa.parse<CsvRow>(text, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (h: string) => h.trim(),
      transform: (v: string) => v.trim(),
    });

    if (parsed.errors.length) {
      return Response.json(
        { success: false, error: parsed.errors[0].message },
        { status: 400 }
      );
    }

    const rows = parsed.data;

    if (!rows.length) {
      return Response.json(
        { success: false, error: "CSV bevat geen rijen." },
        { status: 400 }
      );
    }

    // 3) Validate + map to DB "film" columns
    // NOTE: your DB film table has: title, maker, tagline, thumbnail_url, image_url, edition_id
    const films = rows.map((r, idx) => {
      const title = clean(r.title);
      const maker = clean(r.maker);
      const image_text = clean(r.image_text);
      const tagline = clean(r.tagline);

      if (!title || !maker || !image_text) {
        throw new Error(
          `Rij ${idx + 2}: CSV moet kolommen bevatten: title,maker,image_text (en optioneel tagline,thumbnail_url,image_url)`
        );
      }

      return {
        edition_id: edition.id,
        title,
        maker,
        // if tagline empty, use image_text as fallback (so you don't lose it)
        tagline: tagline || image_text || null,
        thumbnail_url: r.thumbnail_url ? clean(r.thumbnail_url) : null,
        image_url: r.image_url ? clean(r.image_url) : null,
      };
    });

    // 4) Insert (bulk)
    const { error: insertErr } = await supabase.from("film").insert(films);

    if (insertErr) {
      return Response.json(
        { success: false, error: insertErr.message },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
      inserted: films.length,
      edition_id: edition.id,
    });
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === "UNAUTHORIZED") {
        return Response.json(
          { success: false, error: "Not authenticated" },
          { status: 401 }
        );
      }
      if (err.message === "FORBIDDEN") {
        return Response.json(
          { success: false, error: "Admin access required" },
          { status: 403 }
        );
      }
      return Response.json(
        { success: false, error: err.message },
        { status: 400 }
      );
    }

    return Response.json(
      { success: false, error: "Unexpected server error" },
      { status: 500 }
    );
  }
}
