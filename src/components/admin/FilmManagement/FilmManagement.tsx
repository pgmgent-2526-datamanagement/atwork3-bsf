"use client";

import { useState } from "react";
import styles from "./FilmManagement.module.css";
import { Button } from "@/components/ui/Button";
import { Pencil, Trash, Plus, X } from "lucide-react";

type NewFilm = {
  title: string;
  tagline: string;
  maker: string;
  image: File  | null;
};

export function FilmManagement() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<NewFilm>({
    title: "",
    tagline: "",
    maker: "",
    image: null,
  });

  function openModal() {
    setError(null);
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
    setForm({ title: "", tagline: "", maker: "", image: null });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
       if (!form.image) throw new Error("Geen image geselecteerd");

          const data = new FormData();
          data.append("title", form.title);
          data.append("tagline", form.tagline);
          data.append("maker", form.maker);
          data.append("image", form.image);

      const res = await fetch("/api/films/create", {
        method: "POST",
        credentials: "include", // handig bij auth/cookies
        body: data,
      });

      const resData = await res.json();

      if (!res.ok || !resData?.success) {
        throw new Error(resData?.error || "Film aanmaken mislukt");
      }

      // ✅ Film is aangemaakt: sluit popup en (optioneel) refresh je lijst
      closeModal();

      // Hier kan je bv. je films opnieuw ophalen of local state updaten
      // await loadFilms();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Onbekende fout");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h2>Films Beheren</h2>
        <Button onClick={openModal}>
          <Plus size={16} /> Film Toevoegen
        </Button>
      </div>

      <p className={styles.subtext}>
        Voeg films toe, bewerk of verwijder ze uit de stemming.
      </p>

      {/* LIST (later dynamisch maken) */}
      <div className={styles.list}>
        <article className={styles.card}>
          <div>
            <h3></h3>
            <span className={styles.meta}></span>
            <p className={styles.votes}> stemmen totaal</p>
          </div>
          <div className={styles.actions}>
            <button className={styles.editButton}>
              <Pencil size={16} />
            </button>
            <button className={styles.deleteButton}>
              <Trash size={16} />
            </button>
          </div>
        </article>
      </div>

      {/* MODAL */}
      {isOpen && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Film toevoegen</h3>
              <button className={styles.modalClose} onClick={closeModal}>
                <X size={16} />
              </button>
            </div>

            <form className={styles.form} onSubmit={handleSubmit}>
              <label className={styles.label}>
                Title
                <input
                  className={styles.input}
                  value={form.title}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, title: e.target.value }))
                  }
                  required
                />
              </label>

              <label className={styles.label}>
                Tagline
                <input
                  className={styles.input}
                  value={form.tagline}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, tagline: e.target.value }))
                  }
                  required
                />
              </label>

              <label className={styles.label}>
                Maker
                <input
                  className={styles.input}
                  value={form.maker}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, maker: e.target.value }))
                  }
                  required
                />
              </label>

              <label className={styles.label}>
                Choose image
                <input
                  className={styles.input}
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      image: e.target.files?.[0] ?? null,
                    }))
                  }
                  required
                />
              </label>

              {error && <p className={styles.error}>{error}</p>}

              <div className={styles.formActions}>
                <Button type="button" onClick={closeModal}>
                  Annuleren
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Bezig..." : "Opslaan"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
