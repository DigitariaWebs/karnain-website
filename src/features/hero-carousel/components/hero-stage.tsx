"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef } from "react";
import { heroFragranceVisuals } from "../data";
import { damp, isSlotVisible, shortestSlot, slotTransform } from "../lib";
import { useHeroCarouselStoreApi } from "../provider";
import type { HeroFragranceVisual } from "../types";

/** Decay rate of the travel easing — decisive but weighted; the same curve the backdrop uses. */
const TRAVEL_LAMBDA = 3.4;
/** Idle life: a slow ±1.2° sway over eight seconds, so a still hero is never quite still. */
const IDLE_SWAY_DEG = 1.2;
const IDLE_PERIOD_S = 8;
/** Opening reveal: the bottle rises this far (fraction of its height) into place on first paint. */
const INTRO_RISE = 0.06;
const INTRO_LAMBDA = 2.0;
/** Cursor parallax: how far the stage leans toward the pointer, in px. Restraint is the point. */
const PARALLAX_PX = 10;
const PARALLAX_LAMBDA = 2.2;

type HeroStageProps = {
  /** Set once the sprite for the opening bottle has decoded — hands the frame over from the poster. */
  onReady: () => void;
};

/**
 * The turntable. Every bottle is the same front-facing studio composition; the frame loop only
 * moves them across the stage and steps them back with distance — no turning, no
 * defocus — writing to `style` directly, so advancing the carousel costs React one render for
 * the copy and nothing per frame.
 */
export function HeroStage({ onReady }: HeroStageProps) {
  const storeApi = useHeroCarouselStoreApi();
  const stageRef = useRef<HTMLDivElement>(null);
  const bottleRefs = useRef<(HTMLDivElement | null)[]>([]);
  const readyFired = useRef(false);

  const registerBottle = useCallback(
    (index: number) => (node: HTMLDivElement | null) => {
      bottleRefs.current[index] = node;
    },
    [],
  );

  const handleFirstLoad = useCallback(() => {
    if (readyFired.current) return;
    readyFired.current = true;
    onReady();
  }, [onReady]);

  useEffect(() => {
    const count = heroFragranceVisuals.length;
    const slots = heroFragranceVisuals.map((_, index) =>
      shortestSlot(index, storeApi.getState().activeIndex, count),
    );
    let intro = 0;
    let parallaxX = 0;
    let parallaxY = 0;
    let pointerX = 0;
    let pointerY = 0;
    let last = performance.now();
    let frame = 0;
    let running = true;

    const onPointerMove = (event: PointerEvent) => {
      const stage = stageRef.current;
      if (!stage) return;
      const rect = stage.getBoundingClientRect();
      pointerX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointerY = ((event.clientY - rect.top) / rect.height) * 2 - 1;
    };
    const onPointerLeave = () => {
      pointerX = 0;
      pointerY = 0;
    };
    const stage = stageRef.current;
    stage?.addEventListener("pointermove", onPointerMove, { passive: true });
    stage?.addEventListener("pointerleave", onPointerLeave, { passive: true });

    const tick = (now: number) => {
      if (!running) return;
      // Clamp delta so a backgrounded tab doesn't teleport everything on return.
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      const { activeIndex } = storeApi.getState();

      intro = damp(intro, 1, INTRO_LAMBDA, dt);
      parallaxX = damp(parallaxX, pointerX * PARALLAX_PX, PARALLAX_LAMBDA, dt);
      parallaxY = damp(parallaxY, pointerY * PARALLAX_PX * 0.5, PARALLAX_LAMBDA, dt);
      const idle = Math.sin((now / 1000 / IDLE_PERIOD_S) * Math.PI * 2) * IDLE_SWAY_DEG;

      for (let index = 0; index < count; index += 1) {
        const node = bottleRefs.current[index];
        if (!node) continue;
        const target = shortestSlot(index, activeIndex, count);

        // Unwrap: bring the current slot into the same branch as the target so the bottle
        // always travels the short way round instead of flying back across the stage.
        let current = slots[index] ?? target;
        while (current - target > count / 2) current -= count;
        while (target - current > count / 2) current += count;
        const slot = damp(current, target, TRAVEL_LAMBDA, dt);
        slots[index] = slot;

        if (!isSlotVisible(slot)) {
          node.style.visibility = "hidden";
          continue;
        }
        node.style.visibility = "visible";

        const t = slotTransform(slot);
        const centred = Math.max(0, 1 - Math.abs(slot));
        const rise = -INTRO_RISE * (1 - intro);

        node.style.transform =
          `translate3d(calc(-50% + ${(t.x * 100).toFixed(3)}cqw + ${(parallaxX * centred).toFixed(2)}px), ` +
          `calc(${(rise * 100).toFixed(3)}% + ${(parallaxY * centred).toFixed(2)}px), 0) ` +
          `scale(${t.scale.toFixed(4)}) rotate(${(idle * centred).toFixed(3)}deg)`;
        node.style.opacity = String(Math.min(t.opacity, intro));
        node.style.zIndex = String(t.zIndex);
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => {
      running = false;
      cancelAnimationFrame(frame);
      stage?.removeEventListener("pointermove", onPointerMove);
      stage?.removeEventListener("pointerleave", onPointerLeave);
    };
  }, [storeApi]);

  return (
    <div
      ref={stageRef}
      aria-hidden
      // The stage owns the middle band of the hero and sprites are sized by its height. The
      // band is bounded by max(percentage, rem): the percentages set the composition on a roomy
      // screen, and the rem floors reserve just enough room for the eyebrow + title above and
      // the controls below, so on a phone or a short window the bottle shrinks rather than
      // sliding under the copy.
      className="[container-type:size] pointer-events-none absolute inset-x-0 top-[max(22%,11.5rem)] bottom-[max(19%,9rem)] md:top-[max(19%,12.5rem)] md:bottom-[max(15%,10rem)]"
    >
      {heroFragranceVisuals.map((visual, index) => (
        <BottleSprite
          key={visual.slug}
          ref={registerBottle(index)}
          visual={visual}
          priority={index === 0}
          onFirstLoad={index === 0 ? handleFirstLoad : undefined}
        />
      ))}
    </div>
  );
}

type BottleSpriteProps = {
  ref: (node: HTMLDivElement | null) => void;
  visual: HeroFragranceVisual;
  priority: boolean;
  onFirstLoad?: () => void;
};

/**
 * One bottle, face-on, on a soft tinted floor shadow. The shadow is a separate element so it can
 * stay on the floor while the bottle above it rises in.
 */
function BottleSprite({ ref, visual, priority, onFirstLoad }: BottleSpriteProps) {
  return (
    <div
      ref={ref}
      className="absolute top-0 left-1/2 aspect-[376/783] h-full will-change-transform"
      style={{ transformOrigin: "50% 100%" }}
    >
      {/* Floor shadow: an ellipse tinted to the liquid, feathered hard so it never reads as a disc. */}
      <div
        className="absolute bottom-[0.6%] left-1/2 h-[5%] w-[92%] -translate-x-1/2 rounded-[100%] opacity-45 blur-[14px]"
        style={{
          background: `radial-gradient(ellipse at center, ${visual.shadowColor} 0%, transparent 70%)`,
        }}
      />
      <Image
        src={visual.sprite}
        alt=""
        fill
        priority={priority}
        sizes="(min-width: 1280px) 34vh, (min-width: 768px) 30vh, 52vw"
        className="object-contain object-bottom select-none"
        draggable={false}
        onLoad={onFirstLoad}
      />
    </div>
  );
}
