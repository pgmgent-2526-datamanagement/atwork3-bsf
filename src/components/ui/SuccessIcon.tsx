// components/ui/SuccessIcon.tsx
import { motion } from "framer-motion";
import { PartyPopper } from "lucide-react";
import styles from "@/components/SuccessPage/SuccessPage.module.css";

export function SuccessIcon() {
  return (
    <motion.div
      className={styles["success-page__icon-wrapper"]}
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 15,
        delay: 0.2,
      }}
    >
      <motion.div
        className={styles["success-page__icon-glow"]}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <div className={styles["success-page__icon"]}>
        <PartyPopper className={styles["success-page__icon-party"]} />
      </div>
    </motion.div>
  );
}
