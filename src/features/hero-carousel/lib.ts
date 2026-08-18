import type { SlotTransform } from "./types";

/**
 * Carousel choreography, kept pure so it can be unit-tested without a browser.
 *
 * The stage animates one number per bottle — its *slot*, a float where 0 is centre stage and
 * ±1 are the shoulders. Every part of the transform is a continuous function of that number,
 * so a bottle in flight steps back as it leaves and comes forward as it arrives. It never turns
 * and never softens: distance and size carry the depth on their own, and each bottle stays
 * square to camera and in focus wherever it stands.
 */

/** Horizontal travel per slot, as a fraction of the stage width. */
const SHOULDER_X = 0.31;
/** Apparent shrink per slot, so shoulders read as further away. */
const SCALE_PER_SLOT = 0.28;
const MIN_SCALE = 0.42;
/**
 * Bottles are fully solid out to the shoulders and only fade while leaving the stage beyond
 * them. Opacity is never used to mean "secondary" — distance and size do that job.
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
