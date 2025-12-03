// components/ui/Confetti.tsx
import { motion } from "framer-motion";
import { useState } from "react";
import styles from "@/components/succes/SuccessPage.module.css";


interface ConfettiParticle {
  id: number;
  x: number;
  delay: number;
  duration: number;
}

export function Confetti() {
  const generateParticles = (): ConfettiParticle[] =>
    Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 0.5,
      duration: 2 + Math.random() * 2,
    }));

  const [confetti] = useState<ConfettiParticle[]>(generateParticles);

  return (
    <>
      {confetti.map((particle) => (
        <motion.div
          key={particle.id}
          className={styles["success-page__confetti"]}
          style={{
            left: `${particle.x}%`,
            backgroundColor: [
              "#ff00ff",
              "#00ffff",
              "#ffff00",
              "#ff0080",
              "#00ff80",
            ][particle.id % 5],
          }}
          animate={{
            y: ["0vh", "120vh"],
            rotate: [0, 360],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </>
  );
}
