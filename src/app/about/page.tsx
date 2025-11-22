"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
export default function About() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    gsap.from(titleRef.current, {
      opacity: 0,
      y: 60,
      duration: 1.4,
      ease: "power3.out",
    });
  }, []);
  return (
    <section className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <h1
        ref={titleRef}
        className="text-6xl font-bold text-zinc-800 dark:text-zinc-200"
      >
        About Page
      </h1>
    </section>
  );
}
