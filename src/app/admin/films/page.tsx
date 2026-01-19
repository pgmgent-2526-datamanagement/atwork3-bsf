import { FilmManagement } from "@/components/admin/FilmManagement/FilmManagement";
import { getFilms } from "@/lib/films";

export default async function FilmsPage() {
  const films = await getFilms();
  return <FilmManagement initialFilms={films} />;
}
