import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";
import type { VoteExportRow } from "@/types/film";
import { voteService } from "@/services/voteService";
import { filmService } from "@/services/filmService";

type DB = SupabaseClient<Database>;

export const exportService = {
  async getVoteExportRows(supabase: DB): Promise<VoteExportRow[]> {
    const [results, films] = await Promise.all([
      voteService.getCombinedResults(supabase),
      filmService.getFilms(supabase),
    ]);

    const filmMap = new Map(films.map((f) => [f.id, f]));

    return results.map((r) => {
      const f = filmMap.get(r.filmId);
      return {
        filmId: r.filmId,
        title: f?.title ?? "Onbekend",
        zaalCount: r.zaalCount,
        onlineCount: r.onlineCount,
        total: r.total,
      };
    });
  },
};
