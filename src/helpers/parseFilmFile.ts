import Papa, { ParseResult } from "papaparse";
import type { ImportFilmInput } from "@/types/film";

type CsvRow = {
  number?: string;
  title?: string;
  maker?: string;
  image_text?: string;
  tagline?: string;
  thumbnail_url?: string;
};

export async function parseFilmFile(file: File): Promise<ImportFilmInput[]> {
  const name = file.name.toLowerCase();

  if (!name.endsWith(".csv")) {
    throw new Error("Alleen .csv import wordt ondersteund.");
  }

  const text = await file.text();

  const parsed: ParseResult<CsvRow> = Papa.parse<CsvRow>(text, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h: string) => h.trim(),
    transform: (v: string) => v.trim(),
  });

  if (parsed.errors.length) {
    throw new Error(parsed.errors[0].message);
  }

  return parsed.data.map((row: CsvRow) => {
    const number = Number(row.number);
    const title = String(row.title ?? "");
    const maker = String(row.maker ?? "");
    const image_text = String(row.image_text ?? "");

    if (
      !Number.isFinite(number) ||
      number <= 0 ||
      !title ||
      !maker ||
      !image_text
    ) {
      throw new Error(
        "CSV moet kolommen bevatten: number,title,maker,image_text",
      );
    }

    return {
      number,
      title,
      maker,
      image_text,
      tagline: row.tagline ? String(row.tagline) : null,
      thumbnail_url: row.thumbnail_url ? String(row.thumbnail_url) : null,
    };
  });
}
