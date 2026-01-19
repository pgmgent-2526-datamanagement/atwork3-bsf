"use client";

import { X } from "lucide-react";
import styles from "./ConfirmModal.module.css";

type ConfirmModalProps = {
  open: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
  busy?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function ConfirmModal({
  open,
  title,
  message,
  confirmText = "Bevestigen",
  cancelText = "Annuleren",
  danger = false,
  busy = false,
  onCancel,
  onConfirm,
}: ConfirmModalProps) {
  if (!open) return null;

  return (
    <div className={styles.overlay} onClick={busy ? undefined : onCancel}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.title}>{title}</div>
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className={`${styles.closeBtn} ${busy ? styles.disabled : ""}`}
          >
            <X size={18} />
          </button>
        </div>

        <div className={styles.body}>{message}</div>

        <div className={styles.footer}>
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className={`${styles.cancelBtn} ${busy ? styles.disabled : ""}`}
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className={`${styles.confirmBtn} ${
              danger ? styles.confirmDanger : ""
            } ${busy ? styles.disabled : ""}`}
          >
            {busy ? "Bezig..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
