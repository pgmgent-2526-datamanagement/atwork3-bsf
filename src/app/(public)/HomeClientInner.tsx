"use client";

import { HomePage } from "@/components/home/HomePage";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";

type Mode = "zaal" | "online";

export default function HomeClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const modeFromUrl = searchParams.get("mode");

  useEffect(() => {
    if (modeFromUrl === "zaal" || modeFromUrl === "online") {
      localStorage.setItem("vote_mode", modeFromUrl);
    }
  }, [modeFromUrl]);

  const mode: Mode | null = useMemo(() => {
    // 1) URL param wint
    if (modeFromUrl === "zaal" || modeFromUrl === "online") return modeFromUrl;

    // 2) Anders fallback naar localStorage
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("vote_mode");
      if (stored === "zaal" || stored === "online") return stored;
    }
    return null;
  }, [modeFromUrl]);

  const onStartVoting = () => {
    const finalMode: Mode = mode ?? "online";
    router.push(finalMode === "zaal" ? "/vote/zaal" : "/vote/online");
  };

  const onAdminLogin = () => {
    router.push("/admin");
  };

  return <HomePage onStartVoting={onStartVoting} onAdminLogin={onAdminLogin} />;
}
