"use client";

import { motion } from "framer-motion";
import styles from "@/app/(public)/HomePage.module.css";

interface AdminButtonProps {
  onClick: () => void;
}

export function AdminButton({ onClick }: AdminButtonProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      className={styles["homepage__admin-button"]}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className={styles["homepage__admin-button-glow"]}
        animate={{ opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
      <span className={styles["homepage__admin-button-label"]}>
        Login as admin
      </span>
    </motion.button>
  );
}
