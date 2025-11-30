// components/ui/StartButton.tsx
import { motion } from "framer-motion";
import styles from "@/components/HomePage/HomePage.module.css";

interface StartButtonProps {
  onClick: () => void;
}

export function StartButton({ onClick }: StartButtonProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      className={styles["homepage__start-button"]}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className={styles["homepage__start-button-glow"]}
        animate={{ opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
      <span className={styles["homepage__start-button-label"]}>
        Start Voting
      </span>
    </motion.button>
  );
}
