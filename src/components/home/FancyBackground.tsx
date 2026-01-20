// components/ui/FancyBackground.tsx
import { motion } from "framer-motion";
import styles from "@/app/(public)/HomePage.module.css";

export function FancyBackground() {
  return (
    <motion.div
      className={styles["homepage__background"]}
      animate={{
        background: [
          "radial-gradient(circle at 25% 35%, rgba(99,102,241,0.35) 0%, transparent 60%), radial-gradient(circle at 75% 65%, rgba(236,72,153,0.3) 0%, transparent 60%)",
          "radial-gradient(circle at 75% 35%, rgba(99,102,241,0.35) 0%, transparent 60%), radial-gradient(circle at 25% 65%, rgba(236,72,153,0.3) 0%, transparent 60%)",
          "radial-gradient(circle at 25% 35%, rgba(99,102,241,0.35) 0%, transparent 60%), radial-gradient(circle at 75% 65%, rgba(236,72,153,0.3) 0%, transparent 60%)",
        ],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  );
}
