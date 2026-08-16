import { devtools } from "zustand/middleware";
import { createStore } from "zustand/vanilla";
import { wrapIndex } from "./lib";

/**
 * Which bottle is centre stage. Deliberately tiny: the 3D scene never subscribes to this
 * store through React — it reads `getState()` inside the frame loop and mutates refs, so
 * advancing the carousel costs one React render for the copy, not sixty a second.
 *
 * Per-mount factory (docs/conventions/state.md), never a module-level singleton.
 */

export type HeroCarouselState = {
  activeIndex: number;
  count: number;
  /** Direction of the last move: +1 forward, -1 back. Drives which way the copy slides. */
  direction: 1 | -1;
  /** True while the visitor is interacting or the hero is off-screen — autoplay stands down. */
  isPaused: boolean;
  next: () => void;
  prev: () => void;
  goTo: (index: number) => void;
  setPaused: (paused: boolean) => void;
};

export type HeroCarouselStore = ReturnType<typeof createHeroCarouselStore>;

export function createHeroCarouselStore(count: number, initialIndex = 0) {
  return createStore<HeroCarouselState>()(
    devtools(
      (set, get) => ({
        activeIndex: wrapIndex(initialIndex, count),
        count,
        direction: 1,
        isPaused: false,
        next: () =>
          set(
            (state) => ({
              activeIndex: wrapIndex(state.activeIndex + 1, state.count),
              direction: 1,
            }),
            undefined,
            "heroCarousel/next",
          ),
        prev: () =>
          set(
            (state) => ({
              activeIndex: wrapIndex(state.activeIndex - 1, state.count),
              direction: -1,
            }),
            undefined,
            "heroCarousel/prev",
          ),
        goTo: (index) => {
          const { activeIndex, count: total } = get();
          const target = wrapIndex(index, total);
          if (target === activeIndex) return;
          // Take the short way round, so the copy slides the same way the bottles travel.
          const forward = wrapIndex(target - activeIndex, total);
          set(
            { activeIndex: target, direction: forward <= total / 2 ? 1 : -1 },
            undefined,
            "heroCarousel/goTo",
          );
        },
        setPaused: (paused) => set({ isPaused: paused }, undefined, "heroCarousel/setPaused"),
      }),
      { name: "hero-carousel" },
    ),
  );
}
