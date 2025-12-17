// components/ui/FloatingIcons.tsx
import { motion } from "framer-motion";
import { Sparkles, Heart } from "lucide-react";
import styles from "@/components/succes/SuccessPage.module.css";

export function FloatingIcons() {
  return (
    <motion.div
      className={styles["success-page__floating-icons"]}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.8 }}
    >
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className={styles["success-page__floating-icon"]}
          animate={{
            y: [0, -10, 0],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.2,
            ease: "easeInOut",
          }}
        >
          {i === 0 && (
            <Sparkles className={styles["success-page__sparkle-icon--pink"]} />
          )}
          {i === 1 && <Heart className={styles["success-page__heart-icon"]} />}
          {i === 2 && (
            <Sparkles className={styles["success-page__sparkle-icon--cyan"]} />
          )}
        </motion.div>
      ))}
    </motion.div>
  );
}
