// helpers/parseFilmFile.ts
import * as XLSX from "xlsx";
import type { ImportFilmInput } from "@/types/film";

function parseTxt(content: string): ImportFilmInput[] {
  const lines = content.split(/\r?\n/).filter(Boolean);

  return lines.map((line) => {
    const parts = line.split(",").map((x) => x.trim());

    if (parts.length < 4) {
      throw new Error("TXT regel moet zijn: number,title,maker,image_text");
    }

    const [numberStr, title, maker, image_text] = parts;

    return {
      number: Number(numberStr),
      title,
      maker,
      image_text,
    };
  });
}

// TYPE-SAFE Excel parsing
async function parseXlsx(file: File): Promise<ImportFilmInput[]> {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];

  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet);

  return rows.map((row: Record<string, unknown>) => {
    const number = Number(row["number"]);
    const title = String(row["title"] ?? "");
    const maker = String(row["maker"] ?? "");
    const image_text = String(row["image_text"] ?? "");

    if (!number || !title || !maker || !image_text) {
      throw new Error(
        "Excel file moet kolommen bevatten: number, title, maker, image_text"
      );
    }

    return {
      number,
      title,
      maker,
      image_text,
      tagline: row["tagline"] ? String(row["tagline"]) : null,
      thumbnail_url: row["thumbnail_url"]
        ? String(row["thumbnail_url"])
        : null,
    };
  });
}

export async function parseFilmFile(file: File): Promise<ImportFilmInput[]> {
  const name = file.name.toLowerCase();

  if (name.endsWith(".xlsx")) {
    return parseXlsx(file);
  }

  if (name.endsWith(".txt")) {
    const text = await file.text();
    return parseTxt(text);
  }

  throw new Error("Alleen .xlsx en .txt import wordt ondersteund.");
}
