import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { authService } from "@/services/authService";

export async function POST(req: Request) {
  try {
    const supabase = await supabaseServer();
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password required" },
        { status: 400 }
      );
    }

    await authService.loginAdmin(supabase, email, password);

    return NextResponse.json({
      success: true,
      message: "Login successful",
    });
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === "INVALID_CREDENTIALS") {
        return NextResponse.json(
          { error: "Invalid credentials" },
          { status: 401 }
        );
      }

      if (err.message === "FORBIDDEN") {
        return NextResponse.json(
          { error: "You are not an admin" },
          { status: 403 }
        );
      }
    }

    return NextResponse.json(
      { error: "Login failed" },
      { status: 500 }
    );
  }
}
