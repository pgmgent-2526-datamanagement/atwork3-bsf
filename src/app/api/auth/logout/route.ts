import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { authService } from "@/services/authService";

export async function POST() {
  try {
    const supabase = await supabaseServer();
    await authService.logout(supabase);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Logout failed" }, { status: 400 });
  }
}
