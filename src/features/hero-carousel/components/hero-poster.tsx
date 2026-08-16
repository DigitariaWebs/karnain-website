"use client";

import Image from "next/image";
import { heroFragranceVisuals } from "../data";

type HeroPosterProps = {
  activeIndex: number;
  alt: string;
};

/**
 * The still stand-in for the moving stage: shown for the instant before the opening bottle
 * has decoded, and permanently when the visitor asks for reduced motion.
 *
 * It uses the very same centre-yaw sprite, in the very same box, as the stage does — so the
 * hand-off from still to moving is invisible, and reduced-motion visitors get the identical
 * photograph, only without the turntable.
 */
export function HeroPoster({ activeIndex, alt }: HeroPosterProps) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-[max(22%,11.5rem)] bottom-[max(19%,9rem)] md:top-[max(19%,12.5rem)] md:bottom-[max(15%,10rem)]"
    >
      {heroFragranceVisuals.map((visual, index) => (
        <div
          key={visual.slug}
          className="absolute top-0 left-1/2 aspect-[376/783] h-full -translate-x-1/2 transition-opacity duration-700 ease-out motion-reduce:transition-none"
          style={{ opacity: index === activeIndex ? 1 : 0 }}
        >
          <div
            className="absolute bottom-[0.6%] left-1/2 h-[5%] w-[92%] -translate-x-1/2 rounded-[100%] opacity-45 blur-[14px]"
            style={{
              background: `radial-gradient(ellipse at center, ${visual.shadowColor} 0%, transparent 70%)`,
            }}
          />
          <Image
            src={visual.sprites.center}
            alt={index === activeIndex ? alt : ""}
            fill
            priority={index === 0}
            sizes="(min-width: 1280px) 34vh, (min-width: 768px) 30vh, 52vw"
            className="object-contain object-bottom select-none"
            draggable={false}
          />
        </div>
      ))}
    </div>
  );
}
