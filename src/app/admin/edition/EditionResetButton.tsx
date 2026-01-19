"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/Toast";
import styles from "./EditionResetButton.module.css";

type EditionRow = {
  id: number;
  name: string;
  year: number;
};

type ResetResponse =
  | { success: true; message: string }
  | { success: false; error: string };

export default function EditionResetButton({
  edition,
}: {
  edition: EditionRow | null;
}) {
  const toast = useToast();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const resetArmedUntilRef = useRef<number>(0);

  const onReset = async () => {
    if (!edition || busy) return;

    const now = Date.now();

    // First click → arm
    if (now > resetArmedUntilRef.current) {
      resetArmedUntilRef.current = now + 6000;

      toast.info(
        `Klik binnen 6 seconden nogmaals op "Reset" om "${edition.name} (${edition.year})" te wissen.`,
        "Bevestiging nodig",
      );
      return;
    }

    // Second click → execute
    resetArmedUntilRef.current = 0;
    setBusy(true);

    try {
      const res = await fetch("/api/edition/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const text = await res.text();
      const json = text ? (JSON.parse(text) as ResetResponse) : null;

      if (!res.ok || !json) {
        throw new Error("Reset failed");
      }

      if (!json.success) {
        throw new Error(json.error);
      }

      toast.success("Editie succesvol gereset", "Gelukt");
      router.refresh();
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : "Onverwachte fout",
        "Reset mislukt",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      className={styles.resetButton}
      disabled={!edition || busy}
      onClick={onReset}
    >
      {busy ? "Bezig..." : "Reset editie (alles wissen + nieuwe editie)"}
    </button>
  );
}
