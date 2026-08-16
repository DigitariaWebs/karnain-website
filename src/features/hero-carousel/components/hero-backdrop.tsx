"use client";

import { heroFragranceVisuals } from "../data";

type HeroBackdropProps = {
  activeIndex: number;
};

/**
 * The studio sweep behind the bottle: wall colour at the top, easing to the near-white floor.
 *
 * Every fragrance's gradient is painted once and crossfaded by opacity, rather than
 * interpolating one gradient into another. Browsers cannot tween between two gradient strings,
 * and crossfading stacked layers is both exact and free — the compositor does it on the GPU
 * without touching the main thread.
 */
export function HeroBackdrop({ activeIndex }: HeroBackdropProps) {
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden">
      {heroFragranceVisuals.map((visual, index) => (
        <div
          key={visual.slug}
          className="absolute inset-0 transition-opacity duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
          style={{
            opacity: index === activeIndex ? 1 : 0,
            background: `linear-gradient(180deg, ${visual.backdropTop} 0%, ${visual.backdropMid} 34%, ${visual.backdropFloor} 58%, ${visual.backdropFloor} 100%)`,
          }}
        />
      ))}
      {/* A whisper of vignette, so the corners settle and the bottle holds the eye. */}
      <div className="absolute inset-0 bg-[radial-gradient(115%_85%_at_50%_38%,transparent_45%,rgba(74,60,44,0.13)_100%)]" />
    </div>
  );
}
