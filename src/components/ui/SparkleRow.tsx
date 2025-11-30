// components/ui/SparkleRow.tsx
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import styles from "@/components/HomePage/HomePage.module.css";

export function SparkleRow() {
  return (
    <motion.div
      className={styles["homepage__sparkles-row"]}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {[
        { delay: 0, className: "homepage__sparkle-icon--small-pink" },
        { delay: 0.5, className: "homepage__sparkle-icon--large-cyan" },
        { delay: 1, className: "homepage__sparkle-icon--small-yellow" },
      ].map((sparkle, i) => (
        <motion.div
          key={i}
          className={styles["homepage__sparkle"]}
          animate={{
            rotate: [0, 10, 0, -10, 0],
            scale: [1, 1.2, 1, 1.2, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: sparkle.delay,
          }}
        >
          <Sparkles className={styles[sparkle.className]} />
        </motion.div>
      ))}
    </motion.div>
  );
}
