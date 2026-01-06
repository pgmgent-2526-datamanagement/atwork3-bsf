// components/ui/FilmList.tsx
import { FilmCard } from "./FilmCard";

interface FilmListProps {
  films: {
    number: number;
    title: string;
    image_url?: string | null;
  }[];
  onSelect: (number: number) => void;
}

export function FilmList({ films, onSelect }: FilmListProps) {
  return (
    <>
      {films.map((film, idx) => (
        <FilmCard
          key={film.number}
          number={film.number}
          title={film.title}
          imageUrl={film.image_url ?? null}
          delay={idx * 0.02}
          onClick={() => onSelect(film.number)}
        />
      ))}
    </>
  );
}
