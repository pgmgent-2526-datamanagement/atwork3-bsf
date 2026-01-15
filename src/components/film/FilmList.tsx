// components/ui/FilmList.tsx
import { FilmCard } from "./FilmCard";

interface FilmListProps {
  films: {
    id: number;
    title: string;
    image_url?: string | null;
    maker?: string | null;
    tagline?: string | null;
  }[];
  onSelect: (id: number) => void;
}

export function FilmList({ films, onSelect }: FilmListProps) {
  return (
    <>
      {films.map((film, idx) => (
        <FilmCard
          key={film.id}
          title={film.title}
          imageUrl={film.image_url ?? null}
          maker={film.maker ?? null}
          tagline={film.tagline ?? null}
          delay={idx * 0.02}
          onClick={() => onSelect(film.id)}
        />
      ))}
    </>
  );
}
