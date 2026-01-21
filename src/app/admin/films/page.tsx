import { FilmManagement } from "@/components/admin/film-management/FilmManagement";
import { requireAdmin } from "@/lib/adminGuard";
import { filmService } from "@/services/filmService";

export const dynamic = "force-dynamic";

export default async function FilmsPage() {
  const { supabase } = await requireAdmin();
  const films = await filmService.getFilms(supabase);
  return <FilmManagement initialFilms={films} />;
}
