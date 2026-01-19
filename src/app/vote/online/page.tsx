"use client";

import { VotingPage } from "@/components/vote/VotingPage";
import { useRouter } from "next/navigation";

export default function OnlinePage() {
  const router = useRouter();

  const handleVoteConfirmed = (filmId: number) => {
    router.push(`/vote/online/succes?filmId=${filmId}`);
  };

  return <VotingPage source="online" onVoteConfirmed={handleVoteConfirmed} />;
}
