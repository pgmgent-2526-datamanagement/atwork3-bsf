// components/ui/FilmTag.tsx
import { motion } from "framer-motion";
import styles from "@/components/succes/SuccessPage.module.css";


interface FilmTagProps {
  filmNumber: number;
}

export function FilmTag({ filmNumber }: FilmTagProps) {
  return (
    <motion.div
      className={styles["success-page__film"]}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.6 }}
    >
      <p className={styles["success-page__film-label"]}>Je hebt gestemd op</p>
      <div className={styles["success-page__film-tag"]}>
        <span>Film {filmNumber}</span>
      </div>
    </motion.div>
  );
}
