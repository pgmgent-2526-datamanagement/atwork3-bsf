import { NextResponse, NextRequest } from "next/server";
import { supabaseMiddleware } from "@/lib/supabaseMiddleware";

export async function middleware(req: NextRequest) {
  const { supabase, response } = supabaseMiddleware(req);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL("/auth/sign-in", req.url));
  }

  const { data: admin } = await supabase
    .from("admin_users")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (!admin) {
    await supabase.auth.signOut();
    return NextResponse.redirect(
      new URL("/auth/sign-in?error=no-admin", req.url)
    );
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
