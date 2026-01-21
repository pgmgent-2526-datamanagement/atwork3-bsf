import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminGuard";
import { filmService } from "@/services/filmService";
import { UpdateFilmInput } from "@/types/film";

export async function PUT(req: Request) {
  try {
    const { supabase } = await requireAdmin();

    const ct = req.headers.get("content-type") ?? "";

    // ✅ 1) multipart/form-data (met of zonder file)
    if (ct.includes("multipart/form-data")) {
      const fd = await req.formData();

      const idRaw = fd.get("id");
      const title = String(fd.get("title") ?? "");
      const maker = String(fd.get("maker") ?? "");
      const tagline = String(fd.get("tagline") ?? "");
      const image = fd.get("image"); // File | null

      const id = Number(idRaw);
      if (!id || !title || !maker) {
        return NextResponse.json(
          {
            success: false,
            error: "Missing required fields: id, title, maker",
          },
          { status: 400 },
        );
      }

      // Bouw payload voor filmService
      const payload: UpdateFilmInput = {
        id,
        title,
        maker,
        tagline: tagline || null,
      };

      // als er een file is, geef die door
      if (image && typeof image !== "string") {
        payload.image = image; // dit is een File
      }

      const film = await filmService.updateFilm(supabase, payload);

      return NextResponse.json({ success: true, film });
    }

    // ✅ 2) JSON fallback (oude behaviour)
    const body = await req.json();
    const film = await filmService.updateFilm(supabase, body);

    return NextResponse.json({ success: true, film });
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
      { success: false, error: JSON.stringify(err) },
      { status: 500 },
    );
  }
}
