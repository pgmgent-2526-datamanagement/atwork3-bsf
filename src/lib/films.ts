// lib/films.ts
import { Film, UpdateFilmInput } from "@/types/film";

type ApiOk<T> = { success: true } & T;
type ApiErr = { success: false; error: string };

export async function getFilms(): Promise<Film[]> {
  const res = await fetch("/api/films/get", { cache: "no-store" });
  const json = (await res.json()) as ApiOk<{ films: Film[] }> | ApiErr;

  if (!res.ok || !json.success) {
    throw new Error(!json.success ? json.error : "Failed to load films");
  }
  return json.films;
}

function isFile(v: unknown): v is File {
  return typeof File !== "undefined" && v instanceof File;
}
function asString(v: unknown, fallback = ""): string {
  return typeof v === "string" ? v : fallback;
}


export async function updateFilm(input: UpdateFilmInput): Promise<Film> {
  let res: Response;

  if (isFile(input.image)) {
    const fd = new FormData();
    fd.append("id", String(input.id));
    fd.append("title", asString(input.title));
    fd.append("maker", asString(input.maker ?? ""));
    fd.append("tagline", asString(input.tagline ?? ""));
    fd.append("image", input.image); // <-- nu zeker File

    res = await fetch("/api/films/update", {
      method: "PUT",
      body: fd,
      credentials: "include",
    });
  } else {
    res = await fetch("/api/films/update", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: input.id,
        title: input.title,
        maker: input.maker,
        tagline: input.tagline,
      }),
      credentials: "include",
    });
  }

  const json = (await res.json()) as ApiOk<{ film: Film }> | ApiErr;

  if (!res.ok || !json.success) {
    throw new Error(!json.success ? json.error : "Update failed");
  }
  return json.film;
}


export async function deleteFilm(id: number): Promise<void> {
  const res = await fetch("/api/films/delete", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });

  const json = (await res.json()) as ApiOk<Record<string, never>> | ApiErr;

  if (!res.ok || !json.success) {
    throw new Error(!json.success ? json.error : "Delete failed");
  }
}
