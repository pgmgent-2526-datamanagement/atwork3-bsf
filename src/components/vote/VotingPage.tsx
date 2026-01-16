"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import styles from "@/app/vote/VotingPage.module.css";

import { FilmList } from "@/components/film/FilmList";
import { ConfirmVoteModal } from "@/components/vote/ConfirmVoteModal";

import { supabase } from "@/lib/supabaseClient";
import { filmService } from "@/services/filmService";
import type { FilmRow } from "@/types/film";

import { getOrCreateDeviceHash } from "@/helpers/voteHelperClient";

interface VotingPageProps {
  source: "zaal" | "online";
  onVoteConfirmed: (filmId: number) => void;
}

export function VotingPage({ source, onVoteConfirmed }: VotingPageProps) {
  const [films, setFilms] = useState<FilmRow[]>([]);
  const [selectedFilm, setSelectedFilm] = useState<FilmRow | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const data = await filmService.getFilms(supabase);
        if (mounted) setFilms(data);
      } catch {
        if (mounted) setFilms([]);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const handleFilmSelect = (id: number) => {
    const film = films.find((f) => f.id === id) ?? null;
    setSelectedFilm(film);
    setModalOpen(true);
  };

  async function submitVote(filmId: number) {
    if (busy) return;
    setBusy(true);

    try {
      const deviceHash = await getOrCreateDeviceHash();

      const res = await fetch(`/api/votes/${source}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filmId, deviceHash }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        alert(json?.error ?? "Stemmen mislukt");
        return;
      }

      if (json.vote?.is_valid === false) {
        alert(`Stem geweigerd: ${json.vote?.fraud_reason ?? "invalid"}`);
        return;
      }

      onVoteConfirmed(filmId);
    } finally {
      setBusy(false);
    }
  }

  const handleConfirm = () => {
    if (!selectedFilm) return;
    submitVote(selectedFilm.id);
    setModalOpen(false);
    setSelectedFilm(null);
  };

  const handleCancel = () => {
    setModalOpen(false);
    setSelectedFilm(null);
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
