// import { requireAdmin } from "@/lib/adminGuard";
// import { exportService } from "@/helpers/exportService";
// import { makeTxt } from "@/helpers/exportFile";

// export const runtime = "nodejs";

// export async function GET(req: Request) {
//   try {
//     const { supabase } = await requireAdmin();
//     const format = new URL(req.url).searchParams.get("format");

//     const rows = await exportService.getVoteExportRows(supabase);
//     const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

//     if (format === "txt") {
//       const txt = makeTxt(rows);
//       return new Response(txt, {
//         headers: {
//           "Content-Type": "text/plain",
//           "Content-Disposition": `attachment; filename="results-${timestamp}.txt"`,
//         },
//       });
//     }

//     // default = excel
//     // return new Response(Buffer.from(buffer), {
//     //   headers: {
//     //     "Content-Type":
//     //       "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//     //     "Content-Disposition": `attachment; filename="results-${timestamp}.xlsx"`,
//     //   },
//     // });
//   } catch (err) {
//     if (err instanceof Error) {
//       if (err.message === "UNAUTHORIZED") {
//         return Response.json(
//           { success: false, error: "Not authenticated" },
//           { status: 401 }
//         );
//       }

//       if (err.message === "FORBIDDEN") {
//         return Response.json(
//           { success: false, error: "Admin access required" },
//           { status: 403 }
//         );
//       }

//       return Response.json(
//         { success: false, error: err.message },
//         { status: 400 }
//       );
//     }

//     return Response.json(
//       { success: false, error: "Unexpected server error" },
//       { status: 500 }
//     );
//   }
// }
import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({ message: "This is an example response" });
}