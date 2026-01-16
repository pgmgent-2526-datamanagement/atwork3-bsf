import { Suspense } from "react";
import { SuccessClient } from "@/components/succes/SuccesClient";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuccessClient />
    </Suspense>
  );
}
