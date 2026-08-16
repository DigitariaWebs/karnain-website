"use client";

import Link from "next/link";
import { useReducedMotion } from "motion/react";
import { AnimatePresence, m } from "@/components/motion";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import { useHeroCarouselStore } from "../provider";
import type { HeroCarouselItem, HeroCarouselLabels } from "../types";

type HeroOverlayProps = {
  items: readonly HeroCarouselItem[];
  labels: HeroCarouselLabels;
};

const ENTER = { duration: 0.72, ease: [0.22, 1, 0.36, 1] as const };
const EXIT = { duration: 0.26, ease: [0.4, 0, 1, 1] as const };

/**
 * Masked slide: each line is clipped by its parent, so it wipes from behind an edge rather than
 * merely fading. Leaving is deliberately three times quicker than arriving — copy should clear
 * the stage briskly and then be presented, never linger on its way out.
 */
const line = {
  initial: (direction: number) => ({ y: "115%", opacity: 0, rotate: direction * 1.2 }),
  animate: { y: "0%", opacity: 1, rotate: 0 },
  exit: (direction: number) => ({
    y: "-95%",
    opacity: 0,
    rotate: direction * -0.8,
    transition: EXIT,
  }),
};

/**
 * The reading layer: eyebrow, fragrance name, mood, call to action, and the controls.
 *
 * The copy is choreographed to land *after* the bottle has begun to settle — the eye follows
 * the object first and the words second, which is what makes the sequence feel directed rather
 * than simultaneous.
 */
export function HeroOverlay({ items, labels }: HeroOverlayProps) {
  const activeIndex = useHeroCarouselStore((state) => state.activeIndex);
  const direction = useHeroCarouselStore((state) => state.direction);
  const next = useHeroCarouselStore((state) => state.next);
  const prev = useHeroCarouselStore((state) => state.prev);
  const goTo = useHeroCarouselStore((state) => state.goTo);
  const reduceMotion = useReducedMotion();

  const active = items[activeIndex];
  if (!active) return null;

  const enter = reduceMotion ? { duration: 0 } : ENTER;

  return (
    <div className="pointer-events-none relative flex h-full flex-col justify-between pt-5 pb-7 md:pt-8 md:pb-9">
      <AnimatePresence mode="wait" custom={direction} initial={false}>
        <m.div key={active.slug} className="flex flex-col items-center gap-2 text-center md:gap-3">
          <Mask>
            <m.p
              custom={direction}
              variants={line}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ ...enter, delay: reduceMotion ? 0 : 0.04 }}
              className="label-eyebrow text-foreground/55"
            >
              {labels.eyebrow}
            </m.p>
          </Mask>

          <Mask>
            <m.h1
              custom={direction}
              variants={line}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ ...enter, delay: reduceMotion ? 0 : 0.1 }}
              className="text-foreground max-w-4xl font-serif text-[2.1rem] leading-[1.04] font-light text-balance sm:text-5xl md:text-[3.6rem] lg:text-[4.2rem]"
            >
              {active.name}
            </m.h1>
          </Mask>
        </m.div>
      </AnimatePresence>

      <div className="flex flex-col items-center gap-5 md:gap-6">
        <AnimatePresence mode="wait" initial={false}>
          <m.div
            key={active.slug}
            initial={{ opacity: 0, y: reduceMotion ? 0 : 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ ...enter, delay: reduceMotion ? 0 : 0.3 }}
          >
            <Link
              href={active.href}
              className="label-eyebrow border-foreground/25 text-foreground hover:bg-foreground hover:text-background focus-visible:ring-foreground/40 pointer-events-auto inline-flex h-12 items-center justify-center rounded-full border px-9 backdrop-blur-[2px] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            >
              {labels.discover}
            </Link>
          </m.div>
        </AnimatePresence>

        <div className="flex items-center gap-6">
          <Arrow label={labels.previous} onClick={prev} direction="prev" />

          <div className="flex items-center gap-3">
            {items.map((item, index) => (
              <button
                key={item.slug}
                type="button"
                onClick={() => goTo(index)}
                aria-label={item.name}
                aria-current={index === activeIndex}
                className="group pointer-events-auto cursor-pointer py-2 outline-none"
              >
                <span
                  className={cn(
                    "block h-px transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                    index === activeIndex
                      ? "bg-foreground/80 w-10"
                      : "bg-foreground/25 group-hover:bg-foreground/50 group-focus-visible:bg-foreground/50 w-5",
                  )}
                />
              </button>
            ))}
          </div>

          <Arrow label={labels.next} onClick={next} direction="next" />
        </div>

        <p aria-live="polite" className="sr-only">
          {active.name}
        </p>
      </div>
    </div>
  );
}

/** Clips its child so the slide reads as a wipe from behind an edge. */
function Mask({ children }: { children: React.ReactNode }) {
  return <span className="block overflow-hidden pb-[0.12em]">{children}</span>;
}

type ArrowProps = {
  label: string;
  onClick: () => void;
  direction: "prev" | "next";
};

function Arrow({ label, onClick, direction }: ArrowProps) {
  const Icon = direction === "prev" ? ChevronLeftIcon : ChevronRightIcon;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="group border-foreground/20 text-foreground/70 hover:border-foreground/50 hover:text-foreground focus-visible:ring-foreground/40 pointer-events-auto flex size-11 cursor-pointer items-center justify-center rounded-full border transition-colors outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
    >
      <Icon
        className={cn(
          "size-4 transition-transform duration-300 ease-out",
          direction === "prev" ? "group-hover:-translate-x-0.5" : "group-hover:translate-x-0.5",
        )}
      />
    </button>
  );
}
