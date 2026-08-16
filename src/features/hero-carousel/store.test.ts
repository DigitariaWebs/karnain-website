import { describe, expect, it } from "vitest";
import { createHeroCarouselStore } from "./store";

describe("hero carousel store", () => {
  it("opens on the first fragrance", () => {
    const store = createHeroCarouselStore(5);
    expect(store.getState().activeIndex).toBe(0);
    expect(store.getState().count).toBe(5);
  });

  it("advances and wraps past the end", () => {
    const store = createHeroCarouselStore(3);
    store.getState().next();
    store.getState().next();
    expect(store.getState().activeIndex).toBe(2);
    store.getState().next();
    expect(store.getState().activeIndex).toBe(0);
    expect(store.getState().direction).toBe(1);
  });

  it("goes back and wraps past the start", () => {
    const store = createHeroCarouselStore(3);
    store.getState().prev();
    expect(store.getState().activeIndex).toBe(2);
    expect(store.getState().direction).toBe(-1);
  });

  it("jumps straight to a fragrance", () => {
    const store = createHeroCarouselStore(5);
    store.getState().goTo(3);
    expect(store.getState().activeIndex).toBe(3);
  });

  it("takes the short way round, so the copy slides the way the bottles travel", () => {
    const store = createHeroCarouselStore(5);
    // 0 → 4 is one step back, not four forward.
    store.getState().goTo(4);
    expect(store.getState().direction).toBe(-1);

    store.getState().goTo(1);
    expect(store.getState().direction).toBe(1);
  });

  it("ignores a jump to the fragrance already showing", () => {
    const store = createHeroCarouselStore(5);
    store.getState().goTo(2);
    const direction = store.getState().direction;
    store.getState().goTo(2);
    expect(store.getState().activeIndex).toBe(2);
    expect(store.getState().direction).toBe(direction);
  });

  it("wraps an out-of-range jump instead of going blank", () => {
    const store = createHeroCarouselStore(5);
    store.getState().goTo(7);
    expect(store.getState().activeIndex).toBe(2);
  });

  it("tracks whether autoplay is standing down", () => {
    const store = createHeroCarouselStore(5);
    expect(store.getState().isPaused).toBe(false);
    store.getState().setPaused(true);
    expect(store.getState().isPaused).toBe(true);
  });
});
