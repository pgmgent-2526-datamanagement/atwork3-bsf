"use client";

import { useState } from "react";
import styles from "./FilmManagement.module.css";
import { Button } from "@/components/ui/Button";

export function FilmManagement() {
  const [films] = useState([
    {
      title: "The Shawshank Redemption",
      director: "Frank Darabont",
      year: "1994",
      votes: 45,
    },
    {
      title: "The Godfather",
      director: "Francis Ford Coppola",
      year: "1972",
      votes: 38,
    },
  ]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h2>Films Beheren</h2>
        <Button>+ Film Toevoegen</Button>
      </div>

      <p className={styles.subtext}>
        Voeg films toe, bewerk of verwijder ze uit de stemming.
      </p>

      <div className={styles.list}>
        {films.map((film, i) => (
          <div key={i} className={styles.card}>
            <h3>{film.title}</h3>
            <span className={styles.meta}>
              {film.director} • {film.year}
            </span>
            <p className={styles.votes}>{film.votes} stemmen totaal</p>
          </div>
        ))}
      </div>
    </div>
  );
}
