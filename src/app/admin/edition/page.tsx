import styles from "./AdminEdition.module.css";
import { requireAdmin } from "@/lib/adminGuard";
import { fetchCurrentEditionWithFilms } from "@/lib/editionData.server";
import EditionResetButton from "./EditionResetButton";
import { Film } from "@/types/film";

export const dynamic = "force-dynamic";

export default async function AdminEditionPage() {
  const { supabase } = await requireAdmin();
  const { edition, films } = await fetchCurrentEditionWithFilms(supabase);

  const subtitle = edition
    ? `${edition.name} (${edition.year})`
    : "Geen actieve editie";

  return (
    <div style={{ padding: 24 }}>
      <h1 className={styles.title}>Editie beheer</h1>
      <p className={styles.subtitle}>{subtitle}</p>

      <div className={styles.card}>
        <div className={styles.rowBetween}>
          <div>
            <div className={styles.label}>Actieve editie</div>
            <div className={styles.value}>
              {edition ? `${edition.name} — ${edition.year}` : "Geen"}
            </div>
            <div className={styles.muted}>
              Films in editie: <b>{films.length}</b>
            </div>
          </div>

          <EditionResetButton edition={edition} />
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.sectionTitle}>Films</div>

        {films.length === 0 ? (
          <div className={styles.muted}>Geen films in de actieve editie.</div>
        ) : (
          <div className={styles.filmGrid}>
            {films.map((f: Film) => (
              <div key={f.id} className={styles.filmCard}>
                <div className={styles.filmTitle}>{f.title}</div>
                <div className={styles.filmMeta}>
                  {f.maker ? `Maker: ${f.maker}` : "Maker: —"}
                </div>
                {f.tagline && (
                  <div className={styles.filmTagline}>{f.tagline}</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
