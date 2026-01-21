import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminGuard";

export async function GET() {
  try {
    const { supabase } = await requireAdmin();

    const { data: edition, error: editionError } = await supabase
      .from("edition")
      .select("*")
      .eq("is_active", true)
      .order("year", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (editionError) throw editionError;

    if (!edition) {
      return NextResponse.json({ success: true, edition: null, films: [] });
    }

    const { data: films, error: filmsError } = await supabase
      .from("film")
      .select("id,title,maker,tagline,created_at")
      .eq("edition_id", edition.id)
      .order("id", { ascending: true });

    if (filmsError) throw filmsError;

    return NextResponse.json({ success: true, edition, films: films ?? [] });
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === "UNAUTHORIZED") {
        return NextResponse.json(
          { success: false, error: "Not authenticated" },
          { status: 401 },
        );
      }
      if (err.message === "FORBIDDEN") {
        return NextResponse.json(
          { success: false, error: "Admin access required" },
          { status: 403 },
        );
      }
      return NextResponse.json(
        { success: false, error: err.message },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { success: false, error: "Unexpected server error" },
      { status: 500 },
    );
  }
}
