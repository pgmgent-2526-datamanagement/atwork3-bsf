// app/api/votes/export/route.ts
import { supabaseServer } from "@/lib/supabaseServer";
import { exportService } from "@/helpers/exportService";
import { makeTxt, makeExcel } from "@/helpers/exportFile";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const supabase = supabaseServer();
  const format = new URL(req.url).searchParams.get("format");

  try {
    const rows = await exportService.getVoteExportRows(supabase);
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

    if (format === "txt") {
      const txt = makeTxt(rows);
      return new Response(txt, {
        headers: {
          "Content-Type": "text/plain",
          "Content-Disposition": `attachment; filename="results-${timestamp}.txt"`,
        },
      });
    }

    // default = excel
    const buffer = makeExcel(rows);
    return new Response(Buffer.from(buffer), {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="results-${timestamp}.xlsx"`,
      },
    });
  } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      return Response.json({ success: false, error: message }, { status: 400 });
    }
}
