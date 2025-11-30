// components/ui/ConfirmVoteModal.tsx
import { motion, AnimatePresence } from "framer-motion";
import { Check, X } from "lucide-react";
import styles from "@/components/VotingPage/VotingPage.module.css";

interface ConfirmVoteModalProps {
  filmNumber: number | null;
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmVoteModal({
  filmNumber,
  open,
  onConfirm,
  onCancel,
}: ConfirmVoteModalProps) {
  if (filmNumber === null) return null;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className={styles["voting-page__modal-backdrop"]}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
          />

          <motion.div
            className={styles["voting-page__modal-wrapper"]}
            initial={{ opacity: 0, scale: 0.9, y: "-40%" }}
            animate={{ opacity: 1, scale: 1, y: "-50%" }}
            exit={{ opacity: 0, scale: 0.9, y: "-40%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className={styles["voting-page__modal"]}>
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

              <h3 className={styles["voting-page__modal-title"]}>
                Bevestig je stem
              </h3>
              <p className={styles["voting-page__modal-text"]}>
                Je stemt op Film {filmNumber}
              </p>

              <div className={styles["voting-page__modal-actions"]}>
                <motion.button
                  type="button"
                  onClick={onCancel}
                  className={styles["voting-page__modal-button--secondary"]}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <X className={styles["voting-page__modal-button-icon"]} />
                  <span>Annuleer</span>
                </motion.button>

                <motion.button
                  type="button"
                  onClick={onConfirm}
                  className={styles["voting-page__modal-button--primary"]}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Check className={styles["voting-page__modal-button-icon"]} />
                  <span>Bevestig</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
