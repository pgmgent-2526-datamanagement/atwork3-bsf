// components/VotingPage/VotingPage.tsx
import { useState } from "react";
import { motion } from "framer-motion";
import styles from "@/app/vote/zaal/VotingPage.module.css";

import { FilmList } from "@/app/api/film/FilmList";
import { ConfirmVoteModal } from "@/components/vote/ConfirmVoteModal";

interface VotingPageProps {
  onVoteConfirmed: (filmNumber: number) => void;
}

const films = Array.from({ length: 10 }, (_, i) => ({
  number: i + 1,
  title: `Film ${i + 1}`,
}));

export function VotingPage({ onVoteConfirmed }: VotingPageProps) {
  const [selectedFilm, setSelectedFilm] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleFilmSelect = (filmNumber: number) => {
    setSelectedFilm(filmNumber);
    setModalOpen(true);
  };

  const handleConfirm = () => {
    if (selectedFilm) onVoteConfirmed(selectedFilm);
  };

  const handleCancel = () => {
    setModalOpen(false);
  };

  return (
    <div className={styles["voting-page"]}>
      <motion.header
        className={styles["voting-page__header"]}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className={styles["voting-page__title"]}>Kies je favoriete film</h2>
        <p className={styles["voting-page__subtitle"]}>{films.length} films</p>
      </motion.header>

      <div className={styles["voting-page__list"]}>
        <FilmList films={films} onSelect={handleFilmSelect} />
      </div>

      <ConfirmVoteModal
        filmNumber={selectedFilm}
        open={modalOpen}
        onCancel={handleCancel}
        onConfirm={handleConfirm}
      />
    </div>
  );
}
