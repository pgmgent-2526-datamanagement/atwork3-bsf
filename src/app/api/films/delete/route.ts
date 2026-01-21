import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminGuard";
import { filmService } from "@/services/filmService";

export async function DELETE(req: Request) {
  try {
    const { supabase } = await requireAdmin();
    const body = await req.json();

    if (!body?.id) {
      return NextResponse.json(
        { success: false, error: "Film id is required" },
        { status: 400 },
      );
    }

    await filmService.deleteFilm(supabase, body.id);

    return NextResponse.json({ success: true });
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
