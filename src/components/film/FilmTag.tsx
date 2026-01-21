// components/ui/FilmTag.tsx (or wherever you keep FilmTag)
import { motion } from "framer-motion";
import Image from "next/image";
import styles from "@/components/succes/SuccessPage.module.css";
import type { FilmRow } from "@/types/film";

interface FilmTagProps {
  film: FilmRow;
}

export function FilmTag({ film }: FilmTagProps) {
  return (
    <motion.div
      className={styles["success-page__film"]}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.6 }}
    >
      <p className={styles["success-page__film-label"]}>Je hebt gestemd op</p>

      {film.image_url && (
        <div style={{ position: "relative", width: 140, objectFit: "cover", height: 160, margin: "10px auto", borderRadius: 16, overflow: "hidden" }}>
          <Image
            src={film.image_url}
            alt={film.title}
            fill
            sizes="120px"
            style={{ objectFit: "cover" }}
          />
        </div>
      )}

      <div className={styles["success-page__film-tag"]}>
        <span>{film.title}</span>
      </div>
    </motion.div>
  );
}
