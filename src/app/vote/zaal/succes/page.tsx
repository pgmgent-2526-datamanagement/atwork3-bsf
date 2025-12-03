"use client";

import { useSearchParams } from "next/navigation";
import { SuccessPage } from "@/components/succes/SuccesPage";

export default function Page() {
  const params = useSearchParams();
  const film = params.get("film");
  const filmNumber = film ? Number(film) : null;

  return <SuccessPage filmNumber={filmNumber} />;
}
