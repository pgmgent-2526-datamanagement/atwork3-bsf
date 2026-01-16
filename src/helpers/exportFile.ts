// helpers/exportFile.ts
import type { VoteExportRow } from "@/types/film";
// import * as XLSX from "xlsx";

export function makeTxt(rows: VoteExportRow[]): string {
  return rows
    .map(
      (r) =>
        `Film #${r.filmNumber ?? "-"} - Title: ${r.title} - Zaal: ${r.zaalCount} - Online: ${r.onlineCount} - Total: ${r.total}`
    )
    .join("\n");
}

// export function makeExcel(rows: VoteExportRow[]): ArrayBuffer {
//   const sheet = XLSX.utils.json_to_sheet(rows);
//   const wb = XLSX.utils.book_new();
//   XLSX.utils.book_append_sheet(wb, sheet, "Results");
//   return XLSX.write(wb, { type: "array", bookType: "xlsx" });
// }
