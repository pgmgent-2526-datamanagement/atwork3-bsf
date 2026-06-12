"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import styles from "./ConfirmModal.module.css";
import { Button } from "./Button";

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
  confirmPhrase?: string;
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
  confirmPhrase,
}: ConfirmModalProps) {
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (!open) {
      setInputValue("");
    }
  }, [open]);

  if (!open) return null;

  const isConfirmDisabled =
    busy || (confirmPhrase !== undefined && inputValue !== confirmPhrase);

  return (
    <div className={styles.overlay} onClick={busy ? undefined : onCancel}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.title}>{title}</div>
          <Button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className={`${styles.closeBtn} ${busy ? styles.disabled : ""}`}
          >
            <X size={18} />
          </Button>
        </div>

        <div className={styles.body}>
          <div>{message}</div>
          {confirmPhrase && (
            <div className={styles.inputWrapper}>
              <p className={styles.inputLabel}>
                Typ <strong>{confirmPhrase}</strong> om te bevestigen:
              </p>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={busy}
                className={styles.textInput}
                placeholder={confirmPhrase}
                autoComplete="off"
              />
            </div>
          )}
        </div>

        <div className={styles.footer}>
          <Button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className={`${styles.cancelBtn} ${busy ? styles.disabled : ""}`}
          >
            {cancelText}
          </Button>

          <Button
            type="button"
            onClick={onConfirm}
            disabled={isConfirmDisabled}
            className={`${styles.confirmBtn} ${
              danger ? styles.confirmDanger : ""
            } ${isConfirmDisabled ? styles.disabled : ""}`}
          >
            {busy ? "Bezig..." : confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
