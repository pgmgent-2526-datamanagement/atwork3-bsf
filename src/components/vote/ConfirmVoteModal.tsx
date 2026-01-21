// components/vote/ConfirmVoteModal.tsx
import { motion, AnimatePresence } from "framer-motion";
import { Check, X } from "lucide-react";
import Image from "next/image";
import styles from "@/app/vote/VotingPage.module.css";
import type { FilmRow } from "@/types/film";

interface ConfirmVoteModalProps {
  film: FilmRow | null;
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmVoteModal({
  film,
  open,
  onConfirm,
  onCancel,
}: ConfirmVoteModalProps) {
  if (!film) return null;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* BACKDROP */}
          <motion.div
            className={styles["voting-page__modal-backdrop"]}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
          />

          {/* MODAL */}
          <motion.div
            className={styles["voting-page__modal-wrapper"]}
            initial={{ opacity: 0, scale: 0.92, y: "-40%" }}
            animate={{ opacity: 1, scale: 1, y: "-50%" }}
            exit={{ opacity: 0, scale: 0.92, y: "-40%" }}
            transition={{ type: "spring", damping: 25, stiffness: 280 }}
          >
            <div className={styles["voting-page__modal"]}>
              {/* CHECK ICON (BACK ON TOP) */}
              <motion.div
                className={styles["voting-page__modal-icon-wrapper"]}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
              >
                <div className={styles["voting-page__modal-icon"]}>
                  <Check className={styles["voting-page__modal-icon-check"]} />
                </div>
              </motion.div>

              {/* HERO IMAGE */}
              {film.image_url && (
                <div className={styles["voting-page__modal-hero"]}>
                  <Image
                    src={film.image_url}
                    alt={film.title}
                    fill
                    priority
                    style={{ objectFit: "cover" }}
                  />

                  <div className={styles["voting-page__modal-overlay"]} />

                  <div className={styles["voting-page__modal-heroText"]}>
                    <h2>{film.title}</h2>
                    {film.maker && <p>Door {film.maker}</p>}
                  </div>
                </div>
              )}

              {/* BODY */}
              <div className={styles["voting-page__modal-body"]}>
                <p className={styles["voting-page__modal-description"]}>
                  {film.tagline}
                </p>
              </div>

              {/* ACTIONS */}
              <div className={styles["voting-page__modal-actions"]}>
                <motion.button
                  onClick={onCancel}
                  className={styles["voting-page__modal-button--secondary"]}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <X className={styles["voting-page__modal-button-icon"]} />
                  Annuleer
                </motion.button>

                <motion.button
                  onClick={onConfirm}
                  className={styles["voting-page__modal-button--primary"]}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Check className={styles["voting-page__modal-button-icon"]} />
                  Bevestig
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
