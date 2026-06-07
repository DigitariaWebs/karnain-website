"use client";

import { LazyMotion, MotionConfig, domAnimation, m } from "motion/react";

/**
 * Shared animation setup (docs/conventions/motion.md):
 * - LazyMotion + `m` keeps motion out of the main bundle — always import `m` from here
 *   (or "motion/react"), never the full `motion` component.
 * - `strict` makes accidental `motion.*` usage throw in development.
 * - reducedMotion="user" honors prefers-reduced-motion globally.
 */
export { AnimatePresence, m } from "motion/react";

export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}

/** Shared variants — reuse these; don't re-invent per feature. */

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.2, ease: "easeOut" },
} as const;

export const listItem = {
  initial: { opacity: 0, y: 8, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, scale: 0.98 },
  transition: { type: "spring", stiffness: 300, damping: 30 },
} as const;

/**
 * Calm editorial reveal for luxury section entrances (opacity + small rise).
 * Slightly longer than UI feedback (~0.5s) by product intent; `reducedMotion="user"`
 * collapses it to a plain fade for reduced-motion users. Pair with `whileInView`.
 */
export const reveal = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.3 },
  transition: { duration: 0.5, ease: "easeOut" },
} as const;

/**
 * Section-entrance wrapper for luxury reveals. Use in Server Components — it's the client
 * boundary so pages stay server-first. Animates on mount (not on scroll) so content is
 * never left hidden if a section starts off-screen; `reducedMotion="user"` (global) makes
 * it a plain fade for reduced-motion users. `delay` lets call sites stagger sections.
 */
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <m.div
      className={className}
      initial={reveal.initial}
      animate={reveal.whileInView}
      transition={{ ...reveal.transition, delay }}
    >
      {children}
    </m.div>
  );
}
