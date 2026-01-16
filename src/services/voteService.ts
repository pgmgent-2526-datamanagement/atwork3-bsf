// src/services/voteService.ts

import type { SupabaseClient, PostgrestError } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";
import type {
  CastVoteParams,
  VoteSource,
  AdminSourceResult,
  AdminCombinedResult,
} from "@/types/vote";

import { checkRateLimit } from "@/lib/rateLimit";
import { getActiveSession, getActiveEditionId } from "@/helpers/sessionHelpers";
import { checkDuplicateVote, insertVote } from "@/helpers/voteHelpers";

type DB = SupabaseClient<Database>;

// --- helpers (local) ---
function pct(part: number, total: number) {
  return total > 0 ? (part / total) * 100 : 0;
}

type VoteFilmRow = { film_id: number | null };

type QueryResult<T> = {
  data: T[] | null;
  error: PostgrestError | null;
};

const emptyResult = <T>(): QueryResult<T> => ({ data: [], error: null });

// --- service ---
export const voteService = {
  // CAST VOTE
  async castVote(supabase: DB, params: CastVoteParams) {
    const { filmId, deviceHash, ipAddress, source } = params;

    // 1. Session check (edition-scoped in helper)
    const session = await getActiveSession(supabase, source);
    if (!session) {
      throw new Error("Geen actieve stemronde.");
    }

    // 2. Device blocklist / rate limit check
    const rate = await checkRateLimit(supabase, deviceHash);
    if (!rate.allowed) {
      return insertVote(
        supabase,
        session.id,
        filmId,
        deviceHash,
        ipAddress,
        false,
        "DEVICE_BLOCKED"
      );
    }

    // 3. Duplicate vote check
    const alreadyVoted = await checkDuplicateVote(
      supabase,
      session.id,
      deviceHash
    );

    if (alreadyVoted) {
      return insertVote(
        supabase,
        session.id,
        filmId,
        deviceHash,
        ipAddress,
        false,
        "DUPLICATE_VOTE"
      );
    }

    // 4. Insert valid vote
    return insertVote(
      supabase,
      session.id,
      filmId,
      deviceHash,
      ipAddress,
      true
    );
  },

  /**
   * RESULTS FOR ONE SOURCE (ADMIN)
   * - scoped to active edition
   * - based on active session for that source
   * - returns titles + percentages
   */
  async getResultsForSource(
    supabase: DB,
    source: VoteSource
  ): Promise<AdminSourceResult[]> {
    const editionId = await getActiveEditionId(supabase);
    if (!editionId) return [];

    const session = await getActiveSession(supabase, source);
    if (!session) return [];

    // Films for active edition
    const { data: films, error: filmErr } = await supabase
      .from("film")
      .select("id,title")
      .eq("edition_id", editionId)
      .order("id", { ascending: true });

    if (filmErr) throw filmErr;

    // Valid votes for this session
    const { data: votes, error: voteErr } = await supabase
      .from("vote")
      .select("film_id")
      .eq("vote_session_id", session.id)
      .eq("is_valid", true);

    if (voteErr) throw voteErr;

    // Count per film
    const counts = new Map<number, number>();
    for (const v of (votes ?? []) as VoteFilmRow[]) {
      const filmId = v.film_id;
      if (!filmId) continue;
      counts.set(filmId, (counts.get(filmId) ?? 0) + 1);
    }

    const rows: AdminSourceResult[] = (films ?? []).map((f) => ({
      id: f.id,
      title: f.title,
      votes: counts.get(f.id) ?? 0,
      percentage: 0,
    }));

    const total = rows.reduce((s, r) => s + r.votes, 0);

    return rows
      .map((r) => ({ ...r, percentage: pct(r.votes, total) }))
      .sort((a, b) => b.votes - a.votes);
  },

  /**
   * COMBINED RESULTS (ADMIN)
   * - scoped to active edition
   * - sums votes from active zaal session + active online session
   * - returns titles + split + total + combined percentage
   */
  async getCombinedResults(supabase: DB): Promise<AdminCombinedResult[]> {
    const editionId = await getActiveEditionId(supabase);
    if (!editionId) return [];

    // Films for active edition
    const { data: films, error: filmErr } = await supabase
      .from("film")
      .select("id,title")
      .eq("edition_id", editionId)
      .order("id", { ascending: true });

    if (filmErr) throw filmErr;

    // Active sessions (edition-scoped in helper)
    const [zaalSession, onlineSession] = await Promise.all([
      getActiveSession(supabase, "zaal"),
      getActiveSession(supabase, "online"),
    ]);

    const zaalSessionId = zaalSession?.id ?? null;
    const onlineSessionId = onlineSession?.id ?? null;

    const [zaalVotesRes, onlineVotesRes]: [
      QueryResult<VoteFilmRow>,
      QueryResult<VoteFilmRow>
    ] = await Promise.all([
      zaalSessionId
        ? supabase
            .from("vote")
            .select("film_id")
            .eq("vote_session_id", zaalSessionId)
            .eq("is_valid", true)
        : Promise.resolve(emptyResult<VoteFilmRow>()),

      onlineSessionId
        ? supabase
            .from("vote")
            .select("film_id")
            .eq("vote_session_id", onlineSessionId)
            .eq("is_valid", true)
        : Promise.resolve(emptyResult<VoteFilmRow>()),
    ]);

    if (zaalVotesRes.error) throw zaalVotesRes.error;
    if (onlineVotesRes.error) throw onlineVotesRes.error;

    const zaalCounts = new Map<number, number>();
    for (const v of zaalVotesRes.data ?? []) {
      const filmId = v.film_id;
      if (!filmId) continue;
      zaalCounts.set(filmId, (zaalCounts.get(filmId) ?? 0) + 1);
    }

    const onlineCounts = new Map<number, number>();
    for (const v of onlineVotesRes.data ?? []) {
      const filmId = v.film_id;
      if (!filmId) continue;
      onlineCounts.set(filmId, (onlineCounts.get(filmId) ?? 0) + 1);
    }

    const rows: AdminCombinedResult[] = (films ?? []).map((f) => {
      const zaalCount = zaalCounts.get(f.id) ?? 0;
      const onlineCount = onlineCounts.get(f.id) ?? 0;
      const total = zaalCount + onlineCount;

      return {
        filmId: f.id,
        title: f.title,
        zaalCount,
        onlineCount,
        total,
        percentage: 0,
      };
    });

    const grandTotal = rows.reduce((s, r) => s + r.total, 0);

    return rows
      .map((r) => ({ ...r, percentage: pct(r.total, grandTotal) }))
      .sort((a, b) => b.total - a.total);
  },

  // RESET VOTES + DEACTIVATE SESSIONS
  async resetVotes(supabase: DB) {
    // 1. Find all active sessions
    const { data: sessions, error } = await supabase
      .from("vote_session")
      .select("id")
      .eq("is_active", true);

    if (error) throw error;

    if (!sessions || sessions.length === 0) {
      throw new Error("Geen actieve stemrondes om te resetten.");
    }

    const sessionIds = sessions.map((s) => s.id);

    // 2. Delete all votes for these sessions
    const { error: delError } = await supabase
      .from("vote")
      .delete()
      .in("vote_session_id", sessionIds);

    if (delError) throw delError;

    // 3. Deactivate all active sessions
    const { error: deactivateError } = await supabase
      .from("vote_session")
      .update({ is_active: false })
      .eq("is_active", true);

    if (deactivateError) throw deactivateError;

    return {
      success: true,
      resetSessions: sessionIds.length,
      sessionIds,
      message: "Stemmen gereset en sessies gedeactiveerd.",
    };
  },
};
