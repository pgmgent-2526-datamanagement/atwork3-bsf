// components/SuccessPage/SuccessPage.tsx
import styles from "@/components/succes/SuccessPage.module.css";

import { SuccessBackground } from "@/components/vote/SuccessBackground";
import { Confetti } from "@/components/succes/ColoredBalls";
import { SuccessIcon } from "@/components/succes/SuccesIcon";
import { SuccessTitle } from "@/components/succes/SuccesTitle";
import { FilmTag } from "@/components/film/FilmTag";
import { FloatingIcons } from "@/components/film/FloatingIcons";


interface SuccessPageProps {
  filmNumber: number | null;
 
}

export function SuccessPage({ filmNumber }: SuccessPageProps) {
  return (
    <div className={styles["success-page"]}>
      <SuccessBackground />
      <Confetti />

      <div className={styles["success-page__content"]}>
        <SuccessIcon />
        <SuccessTitle />
        {filmNumber && <FilmTag filmNumber={filmNumber} />}
        <FloatingIcons />

        <p className={styles["success-page__subtitle"]}>
          Geniet van de rest van het festival!
        </p>
      </div>
    </div>
  );
}
