"use client";

import Image from "next/image";
import { useReducedMotion } from "motion/react";

type HeroBackgroundProps = {
  videoSrc: string;
  poster: string;
};

/**
 * Full-bleed hero background: an autoplaying, muted, looping video. Honors
 * `prefers-reduced-motion` by showing the still poster instead (Constitution Art. VII).
 * Decorative — the headline carries the meaning, so it's `aria-hidden`.
 */
export function HeroBackground({ videoSrc, poster }: HeroBackgroundProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <Image src={poster} alt="" fill priority sizes="100vw" className="object-cover" />;
  }

  return (
    <video
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      poster={poster}
      aria-hidden
      className="absolute inset-0 h-full w-full object-cover"
    >
      <source src={videoSrc} type="video/mp4" />
    </video>
  );
}
