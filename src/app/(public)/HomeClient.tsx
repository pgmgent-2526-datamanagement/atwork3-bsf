"use client";

import { Suspense } from "react";
import HomeClientInner from "./HomeClientInner";
import Loading from "@/components/ui/Loading";


export default function HomeClient() {
  return (
    <Suspense fallback={<Loading/>}>
      <HomeClientInner />
    </Suspense>
  );
}
