// services/voteService.ts

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";
import type { CastVoteParams, VoteSource } from "@/types/vote";

import { checkRateLimit } from "@/lib/rateLimit";
import { getActiveSession } from "@/helpers/sessionHelpers";
import { checkDuplicateVote, insertVote } from "@/helpers/voteHelpers";
import { countVotes, combineResults } from "@/helpers/resultHelpers";

type DB = SupabaseClient<Database>;

export const voteService = {
  
  // CAST VOTE
  async castVote(supabase: DB, params: CastVoteParams) {
    const { filmId, deviceHash, ipAddress, source } = params;

    // 1. Session check
    const session = await getActiveSession(supabase, source);
    if (!session) {
      throw new Error("Geen actieve stemronde.");
    }

    // 2. Device blocklist check
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


  // RESULTS FOR ONE SOURCE

  async getResultsForSource(supabase: DB, source: VoteSource) {
    const session = await getActiveSession(supabase, source);
    if (!session) return [];

    const { data, error } = await supabase
      .from("vote")
      .select("film_id")
      .eq("vote_session_id", session.id)
      .eq("is_valid", true);

    if (error) throw error;

    return countVotes(data ?? []);
  },


  // COMBINED RESULTS (ZAAL + ONLINE)
  async getCombinedResults(supabase: DB) {
    const [zaal, online] = await Promise.all([
      this.getResultsForSource(supabase, "zaal"),
      this.getResultsForSource(supabase, "online"),
    ]);

    return combineResults(zaal, online);
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
