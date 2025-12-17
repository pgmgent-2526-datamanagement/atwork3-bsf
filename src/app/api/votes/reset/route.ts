import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminGuard";
import { voteService } from "@/services/voteService";

export async function POST() {
  try {
    const { supabase } = await requireAdmin();

    const result = await voteService.resetVotes(supabase);

    return NextResponse.json(result);
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
