"use client";

import { HomePage } from "@/components/home/HomePage";
import { useRouter } from "next/navigation";

export default function HomeClient() {
  const router = useRouter();

  return <HomePage onStartVoting={() => router.push("/vote/zaal")} />;
}
