// hooks/use-scroll-reveal.ts
"use client";

import { RefObject } from "react";
import {
  useScroll,
  useTransform,
  useSpring,
  MotionValue,
} from "framer-motion";
import { useReducedMotion } from "./use-media-query";

export interface ScrollRevealOptions {
  target?: RefObject<HTMLElement | null>;
  container?: RefObject<HTMLElement | null>;
  offset?: [string, string] | string[];
  y?: [number, number];
  x?: [number, number];
  scale?: [number, number];
  opacity?: [number, number];
  blur?: [number, number];
  rotateX?: [number, number];
  rotateY?: [number, number];
  smooth?: boolean;
  springConfig?: { stiffness: number; damping: number; mass: number };
}

export interface ScrollRevealReturn {
  scrollYProgress: MotionValue<number>;
  smoothProgress: MotionValue<number>;
  style: {
    y: MotionValue<number>;
    x: MotionValue<number>;
    scale: MotionValue<number>;
    opacity: MotionValue<number>;
    filter: MotionValue<string>;
    rotateX: MotionValue<number>;
    rotateY: MotionValue<number>;
    transformPerspective: number;
  };
}

export function useScrollReveal(options: ScrollRevealOptions = {}): ScrollRevealReturn {
  const {
    target,
    container,
    offset = ["0 1", "0.6 1"],
    y = [60, 0],
    x = [0, 0],
    scale = [0.98, 1],
    opacity = [0, 1],
    blur = [16, 0],
    rotateX = [0, 0],
    rotateY = [0, 0],
    smooth = true,
    springConfig = { stiffness: 100, damping: 24, mass: 0.6 },
  } = options;

  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: target as any,
    container: container as any,
    offset: offset as any,
  });

  const smoothProgress =
    smooth && !prefersReducedMotion
      ? useSpring(scrollYProgress, springConfig)
      : scrollYProgress;

  const transformY = useTransform(
    smoothProgress,
    [0, 1],
    prefersReducedMotion ? [y[1], y[1]] : y
  );

  const transformX = useTransform(
    smoothProgress,
    [0, 1],
    prefersReducedMotion ? [x[1], x[1]] : x
  );

  const transformScale = useTransform(
    smoothProgress,
    [0, 1],
    prefersReducedMotion ? [scale[1], scale[1]] : scale
  );

  const transformOpacity = useTransform(
    smoothProgress,
    [0, 1],
    prefersReducedMotion ? [opacity[1], opacity[1]] : opacity
  );

  const rawBlur = useTransform(
    smoothProgress,
    [0, 1],
    prefersReducedMotion ? [blur[1], blur[1]] : blur
  );
  const transformBlur = useTransform(rawBlur, (v) => `blur(${v}px)`);

  const transformRotateX = useTransform(
    smoothProgress,
    [0, 1],
    prefersReducedMotion ? [rotateX[1], rotateX[1]] : rotateX
  );

  const transformRotateY = useTransform(
    smoothProgress,
    [0, 1],
    prefersReducedMotion ? [rotateY[1], rotateY[1]] : rotateY
  );

  return {
    scrollYProgress,
    smoothProgress,
    style: {
      y: transformY,
      x: transformX,
      scale: transformScale,
      opacity: transformOpacity,
      filter: transformBlur,
      rotateX: transformRotateX,
      rotateY: transformRotateY,
      transformPerspective: 1200,
    },
  };
}

export function useParallax(distance: number = 100, smooth: boolean = true) {
  const prefersReducedMotion = useReducedMotion();
  
  const { scrollY } = useScroll();
  
  const rawY = useTransform(scrollY, [0, 1000], [0, distance]);
  const smoothY = useSpring(rawY, { stiffness: 80, damping: 20, mass: 0.5 });

  return prefersReducedMotion 
    ? { y: 0 as any } 
    : { y: smooth ? smoothY : rawY };
}

export function useDepthOfField(maxBlur: number = 12) {
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();

  const rawBlur = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [maxBlur, 0, maxBlur]
  );
  
  const smoothBlur = useSpring(rawBlur, { stiffness: 100, damping: 20 });
  const filter = useTransform(smoothBlur, (v) => `blur(${v}px)`);

  return {
    filter: prefersReducedMotion ? "blur(0px)" : filter,
    scale: useTransform(
      scrollYProgress,
      [0, 0.5, 1],
      prefersReducedMotion ? [1, 1, 1] : [0.95, 1, 0.95]
    ),
  };
}