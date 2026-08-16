import type { SlotTransform } from "./types";

/**
 * Carousel choreography, kept pure so it can be unit-tested without a browser.
 *
 * The stage animates one number per bottle — its *slot*, a float where 0 is centre stage and
 * ±1 are the shoulders. Every part of the transform is a continuous function of that number,
 * so a bottle in flight shrinks, blurs and turns away as it leaves and comes forward, sharpens
 * and squares up as it arrives. Read as a whole that is a turntable, not a filmstrip.
 */

/** Horizontal travel per slot, as a fraction of the stage width. */
const SHOULDER_X = 0.31;
/** Apparent shrink per slot, so shoulders read as further away. */
const SCALE_PER_SLOT = 0.28;
const MIN_SCALE = 0.42;
/** Depth-of-field stand-in: how much a shoulder bottle softens, in px. */
const BLUR_PER_SLOT = 2.2;
/**
 * Bottles are fully solid out to the shoulders and only fade while leaving the stage beyond
 * them. Opacity is never used to mean "secondary" — distance, size and focus do that job.
 */
const SOLID_SLOTS = 1.0;
/** Slots beyond this are fully faded out and skipped by the renderer. */
const VISIBLE_SLOTS = 1.7;

/** Smallest signed distance from `activeIndex` to `index`, wrapping the short way round. */
export function shortestSlot(index: number, activeIndex: number, count: number): number {
  if (count <= 0) return 0;
  const forward = (((index - activeIndex) % count) + count) % count;
  return forward > count / 2 ? forward - count : forward;
}

/** Wrap any integer into `[0, count)`. */
export function wrapIndex(index: number, count: number): number {
  if (count <= 0) return 0;
  return ((index % count) + count) % count;
}

/**
 * Frame-rate independent exponential smoothing. `lambda` is the decay rate: higher is snappier.
 * Unlike a fixed `+= (target - current) * 0.1`, this gives the same motion at 30 and 144 fps.
 */
export function damp(current: number, target: number, lambda: number, delta: number): number {
  return target + (current - target) * Math.exp(-lambda * delta);
}

/** Resting transform for a (possibly fractional, mid-flight) slot. */
export function slotTransform(slot: number): SlotTransform {
  const distance = Math.abs(slot);
  return {
    x: slot === 0 ? 0 : slot * SHOULDER_X,
    scale: Math.max(MIN_SCALE, 1 - distance * SCALE_PER_SLOT),
    // A bottle to the right of centre has been turned to face left, and vice versa; the value
    // is clamped so mid-exit bottles hold the shoulder pose rather than over-rotating. Guarded
    // so dead centre yields +0 rather than -0, which leaks into equality checks.
    yaw: slot === 0 ? 0 : Math.max(-1, Math.min(1, -slot)),
    blur: distance * BLUR_PER_SLOT,
    opacity: slotOpacity(distance),
    zIndex: Math.round((VISIBLE_SLOTS - Math.min(distance, VISIBLE_SLOTS)) * 100),
  };
}

/** Opacity: solid through the shoulders, then a clean fade as the bottle leaves the stage. */
function slotOpacity(distance: number): number {
  if (distance <= SOLID_SLOTS) return 1;
  if (distance >= VISIBLE_SLOTS) return 0;
  return (VISIBLE_SLOTS - distance) / (VISIBLE_SLOTS - SOLID_SLOTS);
}

/** Whether a bottle at this slot contributes anything to the frame. */
export function isSlotVisible(slot: number): boolean {
  return Math.abs(slot) < VISIBLE_SLOTS;
}

/**
 * How much of each pre-rendered yaw to show for a given yaw value in [-1, 1].
 * A bottle turning from centre to the left shoulder crossfades centre→left; the sum is always 1,
 * so there is never a frame where the bottle is half-missing.
 */
export function yawWeights(yaw: number): { left: number; center: number; right: number } {
  const y = Math.max(-1, Math.min(1, yaw));
  if (y < 0) return { left: -y, center: 1 + y, right: 0 };
  return { left: 0, center: 1 - y, right: y };
}
