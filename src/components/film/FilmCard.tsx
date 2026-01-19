// components/ui/FilmCard.tsx
import { motion } from "framer-motion";
import { Film, ArrowRight } from "lucide-react";
import Image from "next/image";
import styles from "@/app/vote/VotingPage.module.css";

interface FilmCardProps {
  title: string;
  maker?: string | null;
  tagline?: string | null;
  delay: number;
  onClick: () => void;
  imageUrl?: string | null; // FULL IMAGE
}

export function FilmCard({
  title,
  maker,
  tagline,
  delay,
  onClick,
  imageUrl,
}: FilmCardProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      className={styles["voting-page__film-card"]}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileTap={{ scale: 0.98 }}
    >
      <div className={styles["voting-page__film-image"]}>
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 360px"
            style={{ objectFit: "cover" }}
            priority={false}
          />
        ) : (
          <div className={styles["voting-page__film-imageFallback"]}>
            {/* fallback */}
            <span>Geen foto</span>
          </div>
        )}
      </div>

      <article className={styles["voting-page__film-body"]}>
        <div className={styles["voting-page__film-titleRow"]}>
          <Film className={styles["voting-page__film-icon"]} />
          <h3 className={styles["voting-page__film-title"]}>{title}</h3>
          <span className={styles["voting-page__film-arrow"]}>
            <ArrowRight className={styles["voting-page__film-arrow-icon"]} />
          </span>
        </div>
          {maker ? (
            <p className={styles["voting-page__film-meta"]}>Door {maker}</p>
          ) : null}

          {tagline ? (
            <p className={styles["voting-page__film-tagline"]}>{tagline}</p>
          ) : null}
      </article>
    </motion.button>
  );
}
