"use client";

import { useEffect, useState } from "react";
import styles from "./CountdownRing.module.css";

type Props = {
  endTime: string;
};

const RADIUS = 60;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function CountdownRing({ endTime }: Props) {
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    const update = () => {
      const diff =
        new Date(endTime).getTime() - new Date().getTime();
      setRemaining(Math.max(0, Math.ceil(diff / 1000)));
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [endTime]);

  const progress = (remaining / 60) * CIRCUMFERENCE;

  return (
    <div className={styles.wrapper}>
      <svg width="140" height="140" className={styles.svg}>
        <circle
          className={styles.bg}
          cx="70"
          cy="70"
          r={RADIUS}
        />
        <circle
          className={styles.progress}
          cx="70"
          cy="70"
          r={RADIUS}
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE - progress}
        />
      </svg>

      <div className={styles.time}>{remaining}s</div>
    </div>
  );
}
