"use client";

import { motion } from "framer-motion";
import styles from "@/app/(public)/HomePage.module.css";
import { AdminButton } from "@/components/home/AdminButton";
import { FancyBackground } from "@/components/home/FancyBackground";
import { SparkleRow } from "@/components/home/SparkleRow";
import { AnimatedTitle } from "@/components/home/AnimatedTitle";
import { StartButton } from "@/components/home/StartButton";

interface HomePageProps {
  onStartVoting: () => void;
  onAdminLogin: () => void;
}

export function HomePage({ onStartVoting, onAdminLogin }: HomePageProps) {
  return (
    <div className={styles.homepage}>
      <FancyBackground />

      <div className={styles["homepage__content"]}>
        <SparkleRow />
        <AnimatedTitle />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          <StartButton onClick={onStartVoting} />
        </motion.div>

        <motion.div
          className={styles["homepage__admin-wrapper"]}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
        >
          <AdminButton onClick={onAdminLogin} />
        </motion.div>

        <motion.p
          className={styles["homepage__subtitle"]}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          Stem op je favoriete film
        </motion.p>
      </div>
    </div>
  );
}
