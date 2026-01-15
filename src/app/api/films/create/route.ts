import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminGuard";
import { filmService } from "@/services/filmService";

const BUCKET = "film-images";

export async function POST(req: Request) {
  try {
    const { supabase } = await requireAdmin();
    

    // ✅ multipart/form-data (voor file uploads)
    const formData = await req.formData();

    const title = (formData.get("title") || "").toString().trim();
    const tagline = (formData.get("tagline") || "").toString().trim();
    const maker = (formData.get("maker") || "").toString().trim();
    const image = formData.get("image");

    if (!title || !tagline || !maker) {
      return NextResponse.json(
        { success: false, error: "Missing fields: title/tagline/maker" },
        { status: 400 }
      );
    }

    if (!(image instanceof File)) {
      return NextResponse.json(
        { success: false, error: "Image file is required" },
        { status: 400 }
      );
    }

    if (!image.type.startsWith("image/")) {
      return NextResponse.json(
        { success: false, error: "File must be an image" },
        { status: 400 }
      );
    }

    // ✅ uniek bestandspad in bucket
    const ext = image.name.split(".").pop()?.toLowerCase() || "jpg";
    const fileName =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? `${crypto.randomUUID()}.${ext}`
        : `${Date.now()}.${ext}`;

    // Je kan mapnaam kiezen zoals je wil:
    const image_path = `films/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(image_path, image, {
        contentType: image.type,
        upsert: false,
      });

    if (uploadError) {
      return NextResponse.json(
        { success: false, error: uploadError.message },
        { status: 400 }
      );
    }

    // ✅ film record opslaan met image_path
    const film = await filmService.createFilm(supabase, {
      title,
      tagline,
      maker,
      image_path,
    });

    return NextResponse.json({ success: true, film });
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
