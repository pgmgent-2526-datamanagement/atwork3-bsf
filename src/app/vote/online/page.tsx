"use client";

import { VotingPage } from "@/components/vote/VotingPage";
import { useRouter } from "next/navigation";

export default function OnlinePage() {
  const router = useRouter();

  function handleVoteConfirmed(filmId: number) {
    router.push(`/vote/online/succes?film=${filmId}`);
  }

  return <VotingPage source="online" onVoteConfirmed={handleVoteConfirmed} />;
}
