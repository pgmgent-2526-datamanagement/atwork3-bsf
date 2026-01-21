import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { authService } from "@/services/authService";

export async function POST(req: Request) {
  try {
    const supabase = await supabaseServer();
    const { email, password, first_name, last_name } = await req.json();

    if (!email || !password || !first_name || !last_name) {
      return NextResponse.json(
        { error: "All fields required" },
        { status: 400 },
      );
    }

    await authService.registerAdmin(
      supabase,
      email,
      password,
      first_name,
      last_name,
    );

    return NextResponse.json({
      success: true,
      message: "Admin registered successfully",
    });
  } catch (err) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }

    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
