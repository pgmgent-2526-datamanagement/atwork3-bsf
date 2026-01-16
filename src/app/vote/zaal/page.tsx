"use client";

import { VotingPage } from "@/components/vote/VotingPage";
import { useRouter } from "next/navigation";

export default function ZaalPage() {
  const router = useRouter();

  function handleVoteConfirmed(filmId: number) {
    router.push(`/vote/zaal/succes?film=${filmId}`);
  }

  return <VotingPage source="zaal" onVoteConfirmed={handleVoteConfirmed} />;
}
