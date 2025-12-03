"use client";

import { HomePage } from "@/components/home/HomePage";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  const handleStartVoting = () => {
    router.push("/vote/zaal");
  };

  return <HomePage onStartVoting={handleStartVoting} />;
}