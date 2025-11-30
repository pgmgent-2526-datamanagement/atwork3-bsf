// components/ui/AnimatedTitle.tsx
import { motion } from "framer-motion";
import styles from "@/components/HomePage/HomePage.module.css";

export function AnimatedTitle() {
  return (
    <motion.h1
      className={styles["homepage__title"]}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      <motion.span
        className={styles["homepage__title-line--top"]}
        animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
        transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
        style={{ backgroundSize: "200% 200%" }}
      >
        Het One Minute
      </motion.span>

      <motion.span
        className={styles["homepage__title-line--middle"]}
        animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "linear",
          delay: 0.5,
        }}
        style={{ backgroundSize: "200% 200%" }}
      >
        Festival
      </motion.span>

      <motion.span
        className={styles["homepage__title-line--bottom"]}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        Publieksprijs
      </motion.span>
    </motion.h1>
  );
}
