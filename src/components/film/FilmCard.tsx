// components/ui/FilmCard.tsx
import { motion } from "framer-motion";
import { Film } from "lucide-react";
import Image from "next/image";
import styles from "@/app/vote/online/VotingPage.module.css";

interface FilmCardProps {
  number: number;
  title: string;
  delay: number;
  onClick: () => void;
  imageUrl?: string | null; // FULL IMAGE
}

export function FilmCard({
  number,
  title,
  delay,
  onClick,
  imageUrl,
}: FilmCardProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      className={styles["voting-page__film-card"]}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      whileTap={{ scale: 0.98 }}
    >
      <div className={styles["voting-page__film-number"]}>
        <span>{number}</span>
      </div>

      <div className={styles["voting-page__film-content"]}>
        {imageUrl ? (
          <div
            className={styles["voting-page__film-icon"]}
            style={{ position: "relative", overflow: "hidden", borderRadius: 8 }}
          >
            <Image
              src={imageUrl}
              alt={title}
              fill
              sizes="64px"
              style={{ objectFit: "cover" }}
              priority={false}
            />
          </div>
        ) : (
          <Film className={styles["voting-page__film-icon"]} />
        )}

        <span className={styles["voting-page__film-title"]}>{title}</span>
      </div>

      <div className={styles["voting-page__film-arrow"]}>→</div>
    </motion.button>
  );
}
