"use client";

import { VotingPage } from "@/components/vote/VotingPage";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  const handleVoteConfirmed = (filmNumber: number) => {
    router.push(`/vote/online/success?film=${filmNumber}`);
  };

  return <VotingPage onVoteConfirmed={handleVoteConfirmed} />;
}
