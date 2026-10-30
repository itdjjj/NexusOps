import type {
  Variants,
  Transition,
  TargetAndTransition,
  Easing,
} from "framer-motion";

/**
 * NexusOps Motion Physics Engine
 * 
 * A centralized library of premium Framer Motion configurations, variants,
 * and micro-interaction helpers. Designed to deliver the high-end, tactile
 * "luxury corporate" feel across the dashboard.
 */

// ==========================================
// CORE PHYSICS & EASING CURVES
// ==========================================

export type EasingCurve = [number, number, number, number];

export const EASING: Record<string, EasingCurve | Easing> = {
  expoOut: [0.16, 1, 0.3, 1],
  quintOut: [0.22, 1, 0.36, 1],
  softInOut: [0.45, 0, 0.55, 1],
  springSoft: [0.25, 0.1, 0.25, 1.05],
  linear: [0, 0, 1, 1],
};

export const SPRINGS: Record<string, Transition> = {
  snappy: { type: "spring", stiffness: 400, damping: 25, mass: 0.6 },
  bouncy: { type: "spring", stiffness: 250, damping: 15, mass: 0.8 },
  smooth: { type: "spring", stiffness: 100, damping: 20, mass: 1 },
  heavy: { type: "spring", stiffness: 60, damping: 15, mass: 1.5 },
  tactileHover: { type: "spring", stiffness: 350, damping: 20, mass: 0.5 },
  tactileTap: { type: "spring", stiffness: 500, damping: 25, mass: 0.4 },
  layoutShift: { type: "spring", stiffness: 380, damping: 30 },
};

export const TRANSITIONS: Record<string, Transition> = {
  instant: { duration: 0, ease: EASING.linear },
  fast: { duration: 0.15, ease: EASING.softInOut },
  base: { duration: 0.3, ease: EASING.expoOut },
  slow: { duration: 0.6, ease: EASING.quintOut },
  stagger: { staggerChildren: 0.08, delayChildren: 0.1 },
  staggerFast: { staggerChildren: 0.04 },
  staggerSlow: { staggerChildren: 0.15, delayChildren: 0.2 },
};

// ==========================================
// PREMIUM ENTRANCE & EXIT VARIANTS
// ==========================================

export const fadeUpVariants: Variants = {
  initial: { opacity: 0, y: 24, filter: "blur(12px)" },
  animate: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      ...SPRINGS.smooth,
      filter: { duration: 0.4, ease: EASING.expoOut },
    },
  },
  exit: {
    opacity: 0,
    y: -16,
    filter: "blur(8px)",
    transition: { ...SPRINGS.snappy, filter: { duration: 0.2 } },
  },
};

export const scaleInVariants: Variants = {
  initial: { opacity: 0, scale: 0.95, y: 10, filter: "blur(8px)" },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    filter: "blur(0px)",
    transition: SPRINGS.bouncy,
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    y: -5,
    filter: "blur(4px)",
    transition: TRANSITIONS.fast,
  },
};

export const depthShiftVariants: Variants = {
  initial: {
    opacity: 0,
    z: -100,
    scale: 0.9,
    filter: "blur(16px)",
  },
  animate: {
    opacity: 1,
    z: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      ...SPRINGS.bouncy,
      filter: { duration: 0.5, ease: EASING.expoOut },
    },
  },
  exit: {
    opacity: 0,
    z: 50,
    scale: 1.05,
    filter: "blur(8px)",
    transition: TRANSITIONS.base,
  },
};

export const slideInRightVariants: Variants = {
  initial: { opacity: 0, x: 40, filter: "blur(10px)" },
  animate: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: SPRINGS.smooth,
  },
  exit: {
    opacity: 0,
    x: -20,
    filter: "blur(6px)",
    transition: TRANSITIONS.fast,
  },
};

export const staggerContainerVariants: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: TRANSITIONS.stagger,
  },
  exit: {
    opacity: 0,
    transition: TRANSITIONS.fast,
  },
};

// ==========================================
// DATA VISUALIZATION VARIANTS (SVG)
// ==========================================

export const pathDrawVariants: Variants = {
  initial: { pathLength: 0, opacity: 0 },
  animate: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 1.8, ease: EASING.expoOut },
      opacity: { duration: 0.3, ease: EASING.linear },
    },
  },
};

export const areaFillVariants: Variants = {
  initial: { opacity: 0, scaleY: 0 },
  animate: {
    opacity: 1,
    scaleY: 1,
    transition: {
      opacity: { duration: 0.5, delay: 0.5 },
      scaleY: { duration: 1.2, ease: EASING.quintOut, delay: 0.2 },
    },
  },
};

export const barGrowVariants: Variants = {
  initial: { scaleY: 0, originY: 1 },
  animate: {
    scaleY: 1,
    originY: 1,
    transition: { duration: 0.8, ease: EASING.expoOut },
  },
};

// ==========================================
// TACTILE MICRO-INTERACTION HELPERS
// ==========================================

/**
 * Returns a standardized hover state for interactive cards and buttons.
 */
export const tactileHoverProps = (scale = 1.02, y = -2): TargetAndTransition => ({
  scale,
  y,
  transition: SPRINGS.tactileHover,
});

/**
 * Returns a standardized tap/click state for interactive elements.
 */
export const tactileTapProps = (scale = 0.97, y = 0): TargetAndTransition => ({
  scale,
  y,
  transition: SPRINGS.tactileTap,
});

/**
 * Returns a subtle pulse animation for live indicators.
 */
export const pulseProps: TargetAndTransition = {
  scale: [1, 1.15, 1],
  opacity: [0.7, 0.4, 0.7],
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: EASING.softInOut,
  },
};

/**
 * Returns a shimmer effect for loading skeletons.
 */
export const shimmerProps: TargetAndTransition = {
  x: ["-100%", "200%"],
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: EASING.linear,
  },
};