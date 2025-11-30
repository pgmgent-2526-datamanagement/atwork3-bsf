// components/ui/SuccessTitle.tsx
import { motion } from "framer-motion";
import styles from "@/components/SuccessPage/SuccessPage.module.css";

export function SuccessTitle() {
  return (
    <motion.h1
      className={styles["success-page__title"]}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      Bedankt voor
      <br />
      je stem!
    </motion.h1>
  );
}
