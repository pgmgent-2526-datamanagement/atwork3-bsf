// components/ui/SuccessBackground.tsx
import { motion } from "framer-motion";
import styles from "@/components/succes/SuccessPage.module.css";


export function SuccessBackground() {
  return (
    <motion.div
      className={styles["success-page__background"]}
      animate={{
        background: [
          "radial-gradient(circle at 50% 50%, #ff00ff 0%, transparent 70%), radial-gradient(circle at 30% 80%, #00ffff 0%, transparent 60%), radial-gradient(circle at 70% 20%, #ffff00 0%, transparent 60%)",
          "radial-gradient(circle at 50% 50%, #00ffff 0%, transparent 70%), radial-gradient(circle at 70% 80%, #ff00ff 0%, transparent 60%), radial-gradient(circle at 30% 20%, #ffff00 0%, transparent 60%)",
          "radial-gradient(circle at 50% 50%, #ff00ff 0%, transparent 70%), radial-gradient(circle at 30% 80%, #00ffff 0%, transparent 60%), radial-gradient(circle at 70% 20%, #ffff00 0%, transparent 60%)",
        ],
      }}
      transition={{
        duration: 6,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  );
}
