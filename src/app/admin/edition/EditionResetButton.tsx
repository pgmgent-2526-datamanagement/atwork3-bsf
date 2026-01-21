"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/Toast";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
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
  const [confirmOpen, setConfirmOpen] = useState(false);

  const openConfirm = () => {
    if (!edition || busy) return;
    setConfirmOpen(true);
  };

  const closeConfirm = () => {
    if (busy) return; // prevent closing while request is running
    setConfirmOpen(false);
  };

  const doReset = async () => {
    if (!edition || busy) return;

    setBusy(true);
    try {
      const res = await fetch("/api/edition/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const text = await res.text();
      const json = text ? (JSON.parse(text) as ResetResponse) : null;

      if (!res.ok || !json) throw new Error("Reset failed");
      if (!json.success) throw new Error(json.error);

      toast.success("Editie succesvol gereset", "Gelukt");
      setConfirmOpen(false);
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

  const editionLabel = edition ? edition.name : "deze editie";

  return (
    <>
      <button
        className={styles.resetButton}
        disabled={!edition || busy}
        onClick={openConfirm}
        type="button"
      >
        {busy ? "Bezig..." : "Reset editie (alles wissen + nieuwe editie)"}
      </button>

      <ConfirmModal
        open={confirmOpen}
        title="Editie resetten?"
        message={`Ben je zeker dat je "${editionLabel}" wil resetten? Dit wist alle stemmen/resultaten van de huidige editie en start een nieuwe editie.`}
        confirmText="Ja, reset"
        cancelText="Annuleer"
        danger
        busy={busy}
        onCancel={closeConfirm}
        onConfirm={doReset}
      />
    </>
  );
}
