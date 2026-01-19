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

export async function updateFilm(input: UpdateFilmInput): Promise<Film> {
  const res = await fetch("/api/films/update", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

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
