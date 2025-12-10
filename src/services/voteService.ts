import { checkRateLimit } from "@/lib/rateLimit";
import { getActiveSession } from "@/helpers/sessionHelpers";
import { checkDuplicateVote, insertVote } from "@/helpers/voteHelpers";
import { countVotes, combineResults } from "@/helpers/resultHelpers";
import type { CastVoteParams, VoteSource } from "@/types/vote";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

type DB = SupabaseClient<Database>;

export const voteService = {
  async castVote(supabase: DB, params: CastVoteParams) {
    const { filmId, deviceHash, ipAddress, source } = params;

    // 1. active session
    const session = await getActiveSession(supabase, source);
    if (!session) throw new Error("Geen actieve stemronde.");

    // 2. blocklist check
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

    // 3. unique device check
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

    // 4. valid vote
    return insertVote(supabase, session.id, filmId, deviceHash, ipAddress, true);
  },

  async getResultsForSource(supabase: DB, source: VoteSource) {
    const session = await getActiveSession(supabase, source);
    if (!session) return [];

    const { data } = await supabase
      .from("vote")
      .select("film_id")
      .eq("vote_session_id", session.id)
      .eq("is_valid", true);

    return countVotes(data ?? []);
  },

  async getCombinedResults(supabase: DB) {
    const [zaal, online] = await Promise.all([
      this.getResultsForSource(supabase, "zaal"),
      this.getResultsForSource(supabase, "online"),
    ]);

    return combineResults(zaal, online);
  },
};
