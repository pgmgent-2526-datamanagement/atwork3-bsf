import { requireAdmin } from "@/lib/adminGuard";
import { exportService } from "@/helpers/exportService";
import { makeCsv, makeExcel } from "@/helpers/exportFile";

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const { supabase } = await requireAdmin();
    const format = new URL(req.url).searchParams.get("format"); // "csv" | "xlsx"

    const rows = await exportService.getVoteExportRows(supabase);
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

    if (format === "csv") {
      const csv = makeCsv(rows);
      return new Response(csv, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="results-${timestamp}.csv"`,
        },
      });
    }

    // default: xlsx
    const buffer = await makeExcel(rows);
    return new Response(Buffer.from(buffer), {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="results-${timestamp}.xlsx"`,
      },
    });
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === "UNAUTHORIZED") {
        return Response.json(
          { success: false, error: "Not authenticated" },
          { status: 401 }
        );
      }
      if (err.message === "FORBIDDEN") {
        return Response.json(
          { success: false, error: "Admin access required" },
          { status: 403 }
        );
      }
      return Response.json(
        { success: false, error: err.message },
        { status: 400 }
      );
    }

    return Response.json(
      { success: false, error: "Unexpected server error" },
      { status: 500 }
    );
  }
}
