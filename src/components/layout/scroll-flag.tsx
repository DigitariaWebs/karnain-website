"use client";

import { useEffect } from "react";

/** Scroll distance, in pixels, at which the floating header settles into its solid state. */
const THRESHOLD = 24;

/**
 * Publishes "the page has been scrolled" as a `data-scrolled` attribute on `<html>`, so styling
 * can be expressed in CSS instead of React state. Nothing re-renders when the visitor scrolls —
 * the attribute flips and the compositor does the rest.
 */
export function ScrollFlag() {
  useEffect(() => {
    const root = document.documentElement;
    let ticking = false;

    const apply = () => {
      ticking = false;
      if (window.scrollY > THRESHOLD) root.setAttribute("data-scrolled", "");
      else root.removeAttribute("data-scrolled");
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(apply);
    };

    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      root.removeAttribute("data-scrolled");
    };
  }, []);

  return null;
}
