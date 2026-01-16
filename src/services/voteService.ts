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
import {
  getActiveEditionId,
  getActiveSession,
  getLatestSession,
} from "@/helpers/sessionHelpers";
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
  async castVote(supabase: DB, params: CastVoteParams) {
    const { filmId, deviceHash, ipAddress, source } = params;

    const session = await getActiveSession(supabase, source);
    if (!session) {
      throw new Error("Geen actieve stemronde.");
    }

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

    return insertVote(
      supabase,
      session.id,
      filmId,
      deviceHash,
      ipAddress,
      true
    );
  },

  async getResultsForSource(
    supabase: DB,
    source: VoteSource
  ): Promise<AdminSourceResult[]> {
    const editionId = await getActiveEditionId(supabase);
    if (!editionId) return [];

    const session = await getLatestSession(supabase, source);
    if (!session) return [];

    const { data: films, error: filmErr } = await supabase
      .from("film")
      .select("id,title")
      .eq("edition_id", editionId)
      .order("id", { ascending: true });

    if (filmErr) throw filmErr;

    const { data: votes, error: voteErr } = await supabase
      .from("vote")
      .select("film_id")
      .eq("vote_session_id", session.id)
      .eq("is_valid", true);

    if (voteErr) throw voteErr;

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
   * Returns the same field names your Results.tsx uses:
   * { id, title, votes, votesEventHall, votesHome, percentage }
   */
  async getCombinedResults(supabase: DB): Promise<AdminCombinedResult[]> {
    const editionId = await getActiveEditionId(supabase);
    if (!editionId) return [];

    const { data: films, error: filmErr } = await supabase
      .from("film")
      .select("id,title")
      .eq("edition_id", editionId)
      .order("id", { ascending: true });

    if (filmErr) throw filmErr;

    const [zaalSession, onlineSession] = await Promise.all([
      getLatestSession(supabase, "zaal"),
      getLatestSession(supabase, "online"),
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
      const zaalCount = zaalCounts.get(f.id) ?? 0; // zaal -> eventhall
      const onlineCount = onlineCounts.get(f.id) ?? 0; // online -> home
      const votes = zaalCount + onlineCount;

      return {
        filmId: f.id,
        title: f.title,
        votes,
        zaalCount,
        onlineCount,
        total: votes,
        percentage: 0,
      };
    });

    const grandTotal = rows.reduce((s, r) => s + r.votes, 0);

    return rows
      .map((r) => ({ ...r, percentage: pct(r.votes, grandTotal) }))
      .sort((a, b) => b.votes - a.votes);
  },

  async resetVotes(supabase: DB) {
    const editionId = await getActiveEditionId(supabase);
    if (!editionId) {
      throw new Error("Geen actieve editie gevonden.");
    }

    const { data: sessions, error: sessionsErr } = await supabase
      .from("vote_session")
      .select("id,is_active,type")
      .eq("edition_id", editionId);

    if (sessionsErr) throw sessionsErr;

    const sessionIds = (sessions ?? []).map((s) => s.id);

    let deletedVotes = 0;
    if (sessionIds.length > 0) {
      const { error: delError, count } = await supabase
        .from("vote")
        .delete({ count: "exact" })
        .in("vote_session_id", sessionIds);

      if (delError) throw delError;
      deletedVotes = count ?? 0;
    }

    const { error: deactivateError } = await supabase
      .from("vote_session")
      .update({ is_active: false })
      .eq("edition_id", editionId)
      .eq("is_active", true);

    if (deactivateError) throw deactivateError;

    return {
      success: true,
      editionId,
      resetSessions: sessionIds.length,
      deletedVotes,
      message:
        "Stemmen gereset voor de actieve editie en sessies gedeactiveerd.",
    };
  },
};
