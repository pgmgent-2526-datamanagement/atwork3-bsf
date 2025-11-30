"use client";

import { VotingPage } from "@/components/VotingPage/VotingPage";
import { useRouter } from "next/navigation";

export default function Voting() {
  const router = useRouter();

  const handleVoteConfirmed = (filmNumber: number) => {
    router.push(`/success?film=${filmNumber}`);
  };

  return <VotingPage onVoteConfirmed={handleVoteConfirmed} />;
}
