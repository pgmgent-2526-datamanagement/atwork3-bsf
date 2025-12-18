"use client";
import { useEffect, useState } from "react";

export function CountdownTimer({ endTime }: { endTime: string }) {
  const [secondsLeft, setSecondsLeft] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const diff =
        new Date(endTime).getTime() - new Date().getTime();

      setSecondsLeft(Math.max(0, Math.floor(diff / 1000)));
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime]);

  if (secondsLeft <= 0) {
    return <p style={{ color: "#dc2626" }}>⛔ Stemming gesloten</p>;
  }
}
