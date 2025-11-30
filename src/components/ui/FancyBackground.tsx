// components/ui/FancyBackground.tsx
import { motion } from "framer-motion";
import styles from "@/components/HomePage/HomePage.module.css";

export function FancyBackground() {
  return (
    <motion.div
      className={styles["homepage__background"]}
      animate={{
        background: [
          "radial-gradient(circle at 20% 30%, #ff00ff 0%, transparent 50%), radial-gradient(circle at 80% 70%, #00ffff 0%, transparent 50%)",
          "radial-gradient(circle at 80% 30%, #ff00ff 0%, transparent 50%), radial-gradient(circle at 20% 70%, #00ffff 0%, transparent 50%)",
          "radial-gradient(circle at 20% 30%, #ff00ff 0%, transparent 50%), radial-gradient(circle at 80% 70%, #00ffff 0%, transparent 50%)",
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
