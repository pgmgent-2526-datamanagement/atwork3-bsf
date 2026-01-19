"use client";

import { useState } from "react";
import styles from "./FilmManagement.module.css";
import { Film, CreateFilmResponse, NewFilm } from "@/types/film";
import { Button } from "@/components/ui/Button";
import { Pencil, Trash, Plus, X } from "lucide-react";
import { updateFilm, deleteFilm } from "@/lib/films";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { useToast } from "@/components/ui/Toast";

export function FilmManagement({ initialFilms }: { initialFilms: Film[] }) {
  const toast = useToast();

  const [films, setFilms] = useState<Film[]>(initialFilms);

  // edit state
  const [editingId, setEditingId] = useState<number | null>(null);
  const isEditing = editingId !== null;

  // create/edit modal
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // confirm delete modal
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmFilmId, setConfirmFilmId] = useState<number | null>(null);
  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmMessage, setConfirmMessage] = useState("");
  const [confirmBusy, setConfirmBusy] = useState(false);

  const [form, setForm] = useState<NewFilm>({
    title: "",
    tagline: "",
    maker: "",
    image: null,
  });

  function openCreateModal() {
    setError(null);
    setEditingId(null);
    setForm({ title: "", tagline: "", maker: "", image: null });
    setIsOpen(true);
  }

  function openEditModal(film: Film) {
    setError(null);
    setEditingId(film.id);

    setForm({
      title: film.title ?? "",
      tagline: film.tagline ?? "",
      maker: film.maker ?? "",
      image: null, // file input kan je niet prefillen
    });

    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
    setEditingId(null);
    setForm({ title: "", tagline: "", maker: "", image: null });
  }

  function requestDelete(filmId: number, title: string) {
    setError(null);
    setConfirmFilmId(filmId);
    setConfirmTitle("Film verwijderen");
    setConfirmMessage(`Wil je "${title}" verwijderen?`);
    setConfirmOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // ✅ UPDATE
      if (isEditing) {
        const updated = await updateFilm({
          id: editingId!,
          title: form.title,
          maker: form.maker || null,
          tagline: form.tagline || null,
        });

        setFilms((prev) =>
          prev.map((f) => (f.id === updated.id ? updated : f)),
        );

        closeModal();
        toast.success("Film aangepast", "Gelukt");
        return;
      }

      // ✅ CREATE (jouw bestaande API upload)
      if (!form.image) throw new Error("Geen image geselecteerd");

      const data = new FormData();
      data.append("title", form.title);
      data.append("tagline", form.tagline);
      data.append("maker", form.maker);
      data.append("image", form.image);

      const res = await fetch("/api/films/create", {
        method: "POST",
        credentials: "include",
        body: data,
      });

      const resData = (await res.json()) as CreateFilmResponse;

      if (!res.ok || !resData.success) {
        throw new Error(
          !resData.success ? resData.error : "Film aanmaken mislukt",
        );
      }

      setFilms((prev) => [resData.film, ...prev]);

      closeModal();
      toast.success("Film toegevoegd", "Gelukt");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Onbekende fout";
      setError(msg);
      toast.error(msg, "Actie mislukt");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function confirmDelete() {
    if (!confirmFilmId) return;

    setConfirmBusy(true);
    setError(null);

    const snapshot = films;

    // optimistic UI
    setFilms((prev) => prev.filter((f) => f.id !== confirmFilmId));

    try {
      await deleteFilm(confirmFilmId);

      toast.success("Film verwijderd", "Gelukt");
      setConfirmOpen(false);
      setConfirmFilmId(null);
    } catch (err) {
      // rollback
      setFilms(snapshot);

      const msg = err instanceof Error ? err.message : "Delete mislukt";
      setError(msg);
      toast.error(msg, "Delete mislukt");
    } finally {
      setConfirmBusy(false);
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h2>Films Beheren</h2>
        <Button onClick={openCreateModal}>
          <Plus size={16} /> Film Toevoegen
        </Button>
      </div>

      <p className={styles.subtext}>
        Voeg films toe, bewerk of verwijder ze uit de stemming.
      </p>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.list}>
        {films.length === 0 ? (
          <p>Geen films gevonden.</p>
        ) : (
          films.map((film) => (
            <article key={film.id} className={styles.card}>
              <div>
                <h3>{film.title}</h3>
                <span className={styles.meta}>
                  {film.maker ?? "—"}
                  {film.tagline ? ` • ${film.tagline}` : ""}
                </span>
                <p className={styles.votes}>
                  {film.votesTotal ?? 0} stemmen totaal
                </p>
              </div>

              <div className={styles.actions}>
                <button
                  onClick={() => openEditModal(film)}
                  className={styles.editButton}
                  aria-label="Edit"
                >
                  <Pencil size={16} />
                </button>

                <button
                  onClick={() => requestDelete(film.id, film.title)}
                  className={styles.deleteButton}
                  aria-label="Delete"
                >
                  <Trash size={16} />
                </button>
              </div>
            </article>
          ))
        )}
      </div>

      {/* CREATE / EDIT MODAL */}
      {isOpen && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>{isEditing ? "Film bewerken" : "Film toevoegen"}</h3>
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
                Choose image {isEditing ? "(optioneel)" : ""}
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
                  required={!isEditing}
                />
              </label>

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

      {/* CONFIRM DELETE MODAL */}
      <ConfirmModal
        open={confirmOpen}
        title={confirmTitle}
        message={confirmMessage}
        confirmText="Verwijder"
        cancelText="Annuleer"
        danger
        busy={confirmBusy}
        onCancel={() => {
          if (confirmBusy) return;
          setConfirmOpen(false);
          setConfirmFilmId(null);
        }}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
