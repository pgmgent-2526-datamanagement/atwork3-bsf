"use client";

import { SuccessPage } from "@/components/SuccessPage/SuccessPage";
import { useSearchParams } from "next/navigation";

export default function Success() {
  const params = useSearchParams();
  const filmNumber = Number(params.get("film"));

  return <SuccessPage filmNumber={filmNumber} />;
}
