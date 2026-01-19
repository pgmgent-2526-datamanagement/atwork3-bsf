"use client";

import { Suspense } from "react";
import HomeClientInner from "./HomeClientInner";

export default function HomeClient() {
  return (
    <Suspense fallback={null}>
      <HomeClientInner />
    </Suspense>
  );
}
