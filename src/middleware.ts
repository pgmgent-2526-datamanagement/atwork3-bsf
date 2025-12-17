import { NextResponse } from "next/server";
import { supabaseMiddleware } from "@/lib/supabaseMiddleware";
import { NextRequest } from "next/server";


// Routes die admin-only zijn
const ADMIN_PATHS = ["/admin"];

export async function middleware(req: NextRequest) {
  const url = new URL(req.url);
  const pathname = url.pathname;

  // Only protect /admin routes
  if (!ADMIN_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const { supabase, response } = supabaseMiddleware(req);

  // 1. Get session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // Not logged in
    return NextResponse.redirect(new URL("/auth/sign-in", req.url));
  }

  const userId = user.id;

  // 2. Check admin record
  const { data: admin } = await supabase
    .from("admin_users")
    .select("id")
    .eq("id", userId)
    .single();

  if (!admin) {
    // Log out user
    await supabase.auth.signOut();
    return NextResponse.redirect(new URL("/auth/sign-in?error=no-admin", req.url));
  }

  // OK — user is admin
  return response;
}

// Apply middleware only to admin routes
export const config = {
  matcher: ["/admin/:path*"],
};
