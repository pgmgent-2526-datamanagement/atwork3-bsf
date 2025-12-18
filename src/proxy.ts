import { NextResponse, NextRequest } from "next/server";
import { supabaseMiddleware } from "@/lib/supabaseMiddleware";

export async function proxy(req: NextRequest) {
  const { supabase, response } = supabaseMiddleware(req);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  const { data: admin } = await supabase
    .from("admin_users")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (!admin) {
    await supabase.auth.signOut();
    return NextResponse.redirect(
      new URL("/auth/login?error=no-admin", req.url)
    );
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
