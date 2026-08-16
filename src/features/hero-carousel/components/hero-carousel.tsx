"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { heroFragranceVisuals } from "../data";
import { HeroCarouselStoreProvider, useHeroCarouselStore } from "../provider";
import type { HeroCarouselItem, HeroCarouselLabels } from "../types";
import { HeroBackdrop } from "./hero-backdrop";
import { HeroOverlay } from "./hero-overlay";
import { HeroPoster } from "./hero-poster";
import { HeroStage } from "./hero-stage";

/** Dwell time on each fragrance before autoplay advances, in milliseconds. */
const AUTOPLAY_MS = 7000;
/** Autoplay resumes this long after the visitor's last interaction. */
const RESUME_MS = 10000;
/** Horizontal travel, in pixels, that counts as a swipe rather than a tap. */
const SWIPE_THRESHOLD = 48;

type HeroCarouselProps = {
  /** Catalog copy. Only fragrances with a rendered bottle are shown, in the carousel's order. */
  items: readonly HeroCarouselItem[];
  labels: HeroCarouselLabels;
};

/** Join catalog copy to this slice's visuals, keeping the curated carousel order. */
export function orderItems(items: readonly HeroCarouselItem[]): HeroCarouselItem[] {
  return heroFragranceVisuals
    .map((visual) => items.find((item) => item.slug === visual.slug))
    .filter((item): item is HeroCarouselItem => item !== undefined);
}

/**
 * The full-bleed hero: a turntable of path-traced bottles over a gradient that follows the
 * perfume. The bottles are the real Cycles renders; only the motion is live.
 */
export function HeroCarousel({ items, labels }: HeroCarouselProps) {
  const ordered = useMemo(() => orderItems(items), [items]);
  if (ordered.length === 0) return null;

  return (
    <HeroCarouselStoreProvider count={ordered.length}>
      <HeroFrame items={ordered} labels={labels} />
    </HeroCarouselStoreProvider>
  );
}

function HeroFrame({ items, labels }: { items: HeroCarouselItem[]; labels: HeroCarouselLabels }) {
  const activeIndex = useHeroCarouselStore((state) => state.activeIndex);
  const isPaused = useHeroCarouselStore((state) => state.isPaused);
  const next = useHeroCarouselStore((state) => state.next);
  const prev = useHeroCarouselStore((state) => state.prev);
  const setPaused = useHeroCarouselStore((state) => state.setPaused);

  const reduceMotion = useReducedMotion();
  const [stageReady, setStageReady] = useState(false);
  const onStageReady = useCallback(() => setStageReady(true), []);

  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const swipeStart = useRef<{ x: number; y: number } | null>(null);

  /** Any deliberate interaction stands autoplay down, then hands it back after a pause. */
  const interact = useCallback(() => {
    setPaused(true);
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => setPaused(false), RESUME_MS);
  }, [setPaused]);

  useEffect(() => {
    return () => {
      if (resumeTimer.current) clearTimeout(resumeTimer.current);
    };
  }, []);

  // Autoplay. Reduced motion opts out entirely rather than merely slowing down.
  useEffect(() => {
    if (reduceMotion || isPaused) return;
    const id = setInterval(next, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [reduceMotion, isPaused, next]);

  // Arrow keys, as long as the visitor isn't typing somewhere.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, [contenteditable='true']")) return;
      if (event.key === "ArrowRight") next();
      else prev();
      interact();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [next, prev, interact]);

  const onPointerDown = (event: React.PointerEvent) => {
    swipeStart.current = { x: event.clientX, y: event.clientY };
  };

  const onPointerUp = (event: React.PointerEvent) => {
    const start = swipeStart.current;
    swipeStart.current = null;
    if (!start) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    // Ignore mostly-vertical gestures so the page can still be scrolled from the hero.
    if (Math.abs(dx) < SWIPE_THRESHOLD || Math.abs(dx) < Math.abs(dy)) return;
    if (dx < 0) next();
    else prev();
    interact();
  };

  const activeName = items[activeIndex]?.name ?? "";
  const showStage = !reduceMotion;

  return (
    <section
      data-hero-overlay
      aria-roledescription="carousel"
      aria-label={labels.carousel}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onFocusCapture={interact}
      // The sticky header occupies flow space, so the hero is pulled up underneath it and pads
      // its own content back down. That is what lets the transparent header float over the scene.
      className="relative isolate -mt-16 min-h-[92svh] touch-pan-y overflow-hidden md:-mt-20 md:min-h-[96svh]"
    >
      <HeroBackdrop activeIndex={activeIndex} />

      {/*
        Reduced motion gets the still composite outright. Otherwise the poster only holds the
        frame for the instant before the opening bottle's sprite has decoded.
      */}
      {(!showStage || !stageReady) && (
        <div
          className="absolute inset-0 transition-opacity duration-500 ease-out motion-reduce:transition-none"
          style={{ opacity: showStage && stageReady ? 0 : 1 }}
        >
          <HeroPoster activeIndex={activeIndex} alt={activeName} />
        </div>
      )}

      {showStage && <HeroStage onReady={onStageReady} />}

      <div className="absolute inset-0 z-10 mx-auto w-full max-w-6xl px-6 pt-16 md:pt-20">
        <HeroOverlay items={items} labels={labels} />
      </div>
    </section>
  );
}
