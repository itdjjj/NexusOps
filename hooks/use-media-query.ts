// hooks/use-media-query.ts
import { useSyncExternalStore, useMemo, useCallback } from "react";
import type { Transition } from "framer-motion";

const EMPTY_SUBSCRIBE = () => () => {};

function subscribeToMediaQuery(query: string, callback: () => void): () => void {
  if (typeof window === "undefined") return EMPTY_SUBSCRIBE;
  
  const mediaQuery = window.matchMedia(query);
  const handler = () => callback();
  
  mediaQuery.addEventListener("change", handler);
  return () => mediaQuery.removeEventListener("change", handler);
}

export function useMediaQuery(query: string): boolean {
  const subscribe = useMemo(() => {
    return (callback: () => void) => subscribeToMediaQuery(query, callback);
  }, [query]);

  const getSnapshot = useCallback(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(query).matches;
  }, [query]);

  const getServerSnapshot = useCallback(() => false, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function useReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

export interface ResponsivePhysics {
  isMobile: boolean;
  isTouch: boolean;
  isDesktop: boolean;
  prefersReducedMotion: boolean;
  tiltEnabled: boolean;
  transitions: {
    snappy: Transition;
    soft: Transition;
    lux: Transition;
    layout: Transition;
    tactileHover: Transition;
    tactileTap: Transition;
  };
}

export function useResponsivePhysics(): ResponsivePhysics {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTouch = useMediaQuery("(pointer: coarse)");
  const isDesktop = useMediaQuery("(min-width: 1024px) and (pointer: fine)");
  const prefersReducedMotion = useReducedMotion();

  const tiltEnabled = isDesktop && !prefersReducedMotion;

  const transitions = useMemo<ResponsivePhysics["transitions"]>(() => {
    if (prefersReducedMotion) {
      const instant: Transition = { duration: 0.01, ease: "linear" };
      return {
        snappy: instant,
        soft: instant,
        lux: instant,
        layout: instant,
        tactileHover: instant,
        tactileTap: instant,
      };
    }

    if (isMobile || isTouch) {
      return {
        snappy: { type: "spring", stiffness: 400, damping: 30, mass: 0.5 },
        soft: { type: "spring", stiffness: 150, damping: 20, mass: 0.8 },
        lux: { type: "spring", stiffness: 200, damping: 25, mass: 0.6 },
        layout: { type: "spring", stiffness: 300, damping: 30 },
        tactileHover: { type: "spring", stiffness: 500, damping: 30 },
        tactileTap: { type: "spring", stiffness: 600, damping: 25, mass: 0.4 },
      };
    }

    return {
      snappy: { type: "spring", stiffness: 300, damping: 25, mass: 0.6 },
      soft: { type: "spring", stiffness: 100, damping: 20, mass: 0.8 },
      lux: { type: "spring", stiffness: 150, damping: 15, mass: 1.2 },
      layout: { type: "spring", stiffness: 380, damping: 30 },
      tactileHover: { type: "spring", stiffness: 400, damping: 17, mass: 0.5 },
      tactileTap: { type: "spring", stiffness: 500, damping: 20, mass: 0.4 },
    };
  }, [isMobile, isTouch, prefersReducedMotion]);

  return {
    isMobile,
    isTouch,
    isDesktop,
    prefersReducedMotion,
    tiltEnabled,
    transitions,
  };
}