"use client";

import { VotingPage } from "@/components/vote/VotingPage";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  const handleVoteConfirmed = (filmId: number) => {
    router.push(`/vote/online/success?filmId=${filmId}`);
  };

  return <VotingPage onVoteConfirmed={handleVoteConfirmed} />;
}
