// components/SuccessPage/SuccessPage.tsx
import styles from "./SuccessPage.module.css";

import { SuccessBackground } from "@/components/ui/SuccessBackground";
import { Confetti } from "@/components/ui/ColoredBalls";
import { SuccessIcon } from "@/components/ui/SuccessIcon";
import { SuccessTitle } from "@/components/ui/SuccessTitle";
import { FilmTag } from "@/components/ui/FilmTag";
import { FloatingIcons } from "@/components/ui/FloatingIcons";


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
