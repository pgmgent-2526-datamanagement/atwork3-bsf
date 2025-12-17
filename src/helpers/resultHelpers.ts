import type { VoteResult, CombinedVoteResult } from "@/types/vote";

export function countVotes(votes: { film_id: number | null }[]): VoteResult[] {
  const map = new Map<number, number>();

  votes.forEach((v) => {
    if (v.film_id == null) return;
    map.set(v.film_id, (map.get(v.film_id) ?? 0) + 1);
  });

  return [...map].map(([filmId, count]) => ({ filmId, count }));
}

export function combineResults(
  zaal: VoteResult[],
  online: VoteResult[]
): CombinedVoteResult[] {
  const map = new Map<number, CombinedVoteResult>();

  zaal.forEach((z) =>
    map.set(z.filmId, {
      filmId: z.filmId,
      zaalCount: z.count,
      onlineCount: 0,
      total: z.count,
    })
  );

  online.forEach((o) => {
    const ex = map.get(o.filmId) ?? {
      filmId: o.filmId,
      zaalCount: 0,
      onlineCount: 0,
      total: 0,
    };

    ex.onlineCount = o.count;
    ex.total = ex.zaalCount + ex.onlineCount;
    map.set(o.filmId, ex);
  });

  return [...map.values()];
}
