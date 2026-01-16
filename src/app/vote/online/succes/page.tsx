import { Suspense } from "react";
import { SuccessClient } from "@/components/succes/SuccesClient";
import Loading from "@/components/ui/Loading";

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <SuccessClient />
    </Suspense>
  );
}
