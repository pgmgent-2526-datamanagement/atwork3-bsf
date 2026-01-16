import ExcelJS from "exceljs";
import type { ImportFilmInput } from "@/types/film";

async function parseCsv(file: File): Promise<ImportFilmInput[]> {
  const text = await file.text();
  const lines = text.split(/\r?\n/).filter(Boolean);

  const headers = lines[0].split(",").map((h) => h.trim());

  return lines.slice(1).map((line) => {
    const values = line.split(",").map((v) => v.trim());
    const row = Object.fromEntries(headers.map((h, i) => [h, values[i]]));

    const number = Number(row["number"]);
    const title = String(row["title"] ?? "");
    const maker = String(row["maker"] ?? "");
    const image_text = String(row["image_text"] ?? "");

    if (!number || !title || !maker || !image_text) {
      throw new Error(
        "CSV moet kolommen bevatten: number,title,maker,image_text"
      );
    }

    return {
      number,
      title,
      maker,
      image_text,
      tagline: row["tagline"] ? String(row["tagline"]) : null,
      thumbnail_url: row["thumbnail_url"] ? String(row["thumbnail_url"]) : null,
    };
  });
}

async function parseExcel(file: File): Promise<ImportFilmInput[]> {
  const buffer = await file.arrayBuffer();
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.load(buffer);

  const ws = wb.worksheets[0];
  if (!ws) return [];

  const headers: string[] = [];
  const out: ImportFilmInput[] = [];

  ws.eachRow((row, idx) => {
    if (idx === 1) {
      row.eachCell((cell) => headers.push(String(cell.value ?? "").trim()));
      return;
    }

    const rec: Record<string, string> = {};
    row.eachCell((cell, col) => {
      rec[headers[col - 1]] = String(cell.value ?? "").trim();
    });

    const number = Number(rec["number"]);
    const title = rec["title"] ?? "";
    const maker = rec["maker"] ?? "";
    const image_text = rec["image_text"] ?? "";

    if (!number || !title || !maker || !image_text) {
      throw new Error(
        "Excel moet kolommen bevatten: number,title,maker,image_text"
      );
    }

    out.push({
      number,
      title,
      maker,
      image_text,
      tagline: rec["tagline"] ? String(rec["tagline"]) : null,
      thumbnail_path: rec["thumbnail_url"] ? String(rec["thumbnail_url"]) : null,
    });
  });

  return out;
}

export async function parseFilmFile(file: File): Promise<ImportFilmInput[]> {
  const name = file.name.toLowerCase();

  if (name.endsWith(".xlsx")) return parseExcel(file);
  if (name.endsWith(".csv")) return parseCsv(file);

  throw new Error("Alleen .xlsx en .csv import wordt ondersteund.");
}
