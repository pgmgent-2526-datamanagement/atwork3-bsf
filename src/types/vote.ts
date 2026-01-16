import type { Tables } from "./supabase";

export type VoteRow = Tables<"vote">;
export type VoteSessionRow = Tables<"vote_session">;
export type FilmRow = Tables<"film">;

export type VoteSource = "zaal" | "online";

export interface CastVoteParams {
  filmId: number;
  deviceHash: string;
  ipAddress: string | null;
  source: VoteSource;
}

/**
 * Resultaat per film binnen één sessie (zaal óf online)
 */
export interface VoteResult {
  filmId: number;
  count: number;
}

/**
 * Gecombineerde resultaten (zaal + online)
 */
export interface CombinedVoteResult {
  filmId: number;
  zaalCount: number;
  onlineCount: number;
  total: number;
}

export interface FraudReason {
  reason: string;
}

/**
 * ✅ Admin/API friendly results with titles + percentages
 */
export interface AdminSourceResult {
  id: number;
  title: string;
  votes: number;
  percentage: number;
}

export interface AdminCombinedResult {
  id: number;
  title: string;
  votes: number;
  votesEventHall: number;
  votesHome: number;
  percentage: number;
}


