import ExcelJS from "exceljs";
import type { VoteExportRow } from "@/types/film";

export async function makeExcel(rows: VoteExportRow[]): Promise<ArrayBuffer> {
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet("Results");

  ws.columns = [
    { header: "filmId", key: "filmId", width: 12 },
    { header: "title", key: "title", width: 40 },
    { header: "zaalCount", key: "zaalCount", width: 12 },
    { header: "onlineCount", key: "onlineCount", width: 12 },
    { header: "total", key: "total", width: 10 },
  ];

  ws.getRow(1).font = { bold: true };
  ws.views = [{ state: "frozen", ySplit: 1 }];

  ws.addRows(
    rows.map((r) => ({
      filmId: r.filmId ?? "",
      title: r.title ?? "",
      zaalCount: r.zaalCount ?? 0,
      onlineCount: r.onlineCount ?? 0,
      total: r.total ?? 0,
    })),
  );

  ws.autoFilter = {
    from: { row: 1, column: 1 },
    to: { row: 1, column: ws.columns.length },
  };

  const buffer = await wb.xlsx.writeBuffer();
  return buffer as ArrayBuffer;
}
