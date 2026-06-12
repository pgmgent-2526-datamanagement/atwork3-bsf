import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"
import dotenv from "dotenv";
import path from "path";

// Load environment variables for standalone scripts (e.g. seed.ts)
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

export const supabaseService = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      persistSession: false,
    },
  }
)
