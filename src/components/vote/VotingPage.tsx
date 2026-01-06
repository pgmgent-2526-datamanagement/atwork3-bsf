// components/VotingPage/VotingPage.tsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import styles from "@/app/vote/zaal/VotingPage.module.css";

import { FilmList } from "@/components/film/FilmList"; 
import { ConfirmVoteModal } from "@/components/vote/ConfirmVoteModal";

import { supabase } from "@/lib/supabaseClient";
import { filmService } from "@/services/filmService";
import type { FilmRow } from "@/types/film";

interface VotingPageProps {
  onVoteConfirmed: (filmNumber: number) => void;
}

export function VotingPage({ onVoteConfirmed }: VotingPageProps) {
  const [films, setFilms] = useState<FilmRow[]>([]);
  const [selectedFilm, setSelectedFilm] = useState<FilmRow | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const data = await filmService.getFilms(supabase);
        if (mounted) setFilms(data);
      } catch (err) {
        console.error("Failed to load films:", err);
        if (mounted) setFilms([]);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const handleFilmSelect = (filmNumber: number) => {
    const film = films.find((f) => f.number === filmNumber) ?? null;
    setSelectedFilm(film);
    setModalOpen(true);
  };

  const handleConfirm = () => {
    if (selectedFilm) onVoteConfirmed(selectedFilm.number);
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
        film={selectedFilm}
        open={modalOpen}
        onCancel={handleCancel}
        onConfirm={handleConfirm}
      />
    </div>
  );
}
