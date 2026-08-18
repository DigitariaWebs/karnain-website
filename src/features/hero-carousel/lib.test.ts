import { describe, expect, it } from "vitest";
import { damp, isSlotVisible, shortestSlot, slotTransform, wrapIndex } from "./lib";

describe("shortestSlot", () => {
  it("is zero for the active bottle", () => {
    expect(shortestSlot(2, 2, 5)).toBe(0);
  });

  it("returns the signed distance for neighbours", () => {
    expect(shortestSlot(3, 2, 5)).toBe(1);
    expect(shortestSlot(1, 2, 5)).toBe(-1);
  });

  it("wraps the short way round rather than crossing the whole stage", () => {
    // With five bottles, the one before the first is the last — one step back, not four forward.
    expect(shortestSlot(4, 0, 5)).toBe(-1);
    expect(shortestSlot(0, 4, 5)).toBe(1);
  });

  it("survives an empty carousel", () => {
    expect(shortestSlot(0, 0, 0)).toBe(0);
  });
});

describe("wrapIndex", () => {
  it("wraps in both directions", () => {
    expect(wrapIndex(5, 5)).toBe(0);
    expect(wrapIndex(-1, 5)).toBe(4);
    expect(wrapIndex(7, 5)).toBe(2);
  });
});

describe("damp", () => {
  it("moves toward the target without overshooting", () => {
    const next = damp(0, 10, 3, 1 / 60);
    expect(next).toBeGreaterThan(0);
    expect(next).toBeLessThan(10);
  });

  it("stays put once it is there", () => {
    expect(damp(4, 4, 3, 1 / 60)).toBeCloseTo(4, 10);
  });

  it("lands in the same place regardless of frame rate", () => {
    // One second of easing, taken sixty small steps or thirty large ones.
    let fast = 0;
    for (let i = 0; i < 60; i += 1) fast = damp(fast, 1, 3, 1 / 60);
    let slow = 0;
    for (let i = 0; i < 30; i += 1) slow = damp(slow, 1, 3, 1 / 30);
    expect(fast).toBeCloseTo(slow, 6);
  });
});

describe("slotTransform", () => {
  it("puts the active bottle centre stage at full size", () => {
    const centre = slotTransform(0);
    expect(centre.x).toBe(0);
    expect(centre.scale).toBe(1);
    expect(centre.opacity).toBe(1);
  });

  it("mirrors left and right", () => {
    expect(slotTransform(1).x).toBeCloseTo(-slotTransform(-1).x, 10);
    expect(slotTransform(1).scale).toBeCloseTo(slotTransform(-1).scale, 10);
  });

  it("steps back — smaller — with distance, and never inverts", () => {
    expect(slotTransform(1).scale).toBeLessThan(slotTransform(0).scale);
    expect(slotTransform(9).scale).toBeGreaterThan(0);
  });

  it("never defocuses or turns a bottle: distance is carried by size alone", () => {
    for (const slot of [0, 0.5, 1, 1.5, -1]) {
      expect(slotTransform(slot)).not.toHaveProperty("blur");
      expect(slotTransform(slot)).not.toHaveProperty("yaw");
    }
  });

  it("paints the nearest bottle last", () => {
    expect(slotTransform(0).zIndex).toBeGreaterThan(slotTransform(1).zIndex);
    expect(slotTransform(1).zIndex).toBeGreaterThan(slotTransform(1.5).zIndex);
  });

  it("stays solid through the shoulders and only fades while leaving the stage", () => {
    expect(slotTransform(0).opacity).toBe(1);
    expect(slotTransform(1).opacity).toBe(1);
    const leaving = slotTransform(1.35).opacity;
    expect(leaving).toBeGreaterThan(0);
    expect(leaving).toBeLessThan(1);
    expect(slotTransform(9).opacity).toBe(0);
  });
});

describe("isSlotVisible", () => {
  it("keeps the centre, its shoulders and anything mid-exit; drops the rest", () => {
    expect(isSlotVisible(0)).toBe(true);
    expect(isSlotVisible(1)).toBe(true);
    expect(isSlotVisible(-1)).toBe(true);
    expect(isSlotVisible(1.5)).toBe(true);
    expect(isSlotVisible(2)).toBe(false);
    expect(isSlotVisible(-2)).toBe(false);
  });
});
