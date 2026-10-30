// hooks/use-dashboard-state.ts
import { useState, useCallback, useMemo, useRef } from "react";
import type { MouseEvent } from "react";
import { useMotionValue, useSpring, useTransform } from "framer-motion";

export type DashboardView = "liquidity" | "risk" | "forecast";
export type TimeRange = "24h" | "7d" | "30d" | "90d" | "1y" | "ytd";
export type EntityScope = "global" | "na" | "eu" | "apac" | "latam";

interface DashboardState {
  activeView: DashboardView;
  timeRange: TimeRange;
  entityScope: EntityScope;
  isCommandPaletteOpen: boolean;
  layoutKey: string;
}

interface DashboardActions {
  setActiveView: (view: DashboardView) => void;
  setTimeRange: (range: TimeRange) => void;
  setEntityScope: (scope: EntityScope) => void;
  toggleCommandPalette: (force?: boolean) => void;
}

export interface MotionPhysics {
  springSoft: { type: "spring"; stiffness: number; damping: number; mass: number };
  springSnappy: { type: "spring"; stiffness: number; damping: number; mass: number };
  springLux: { type: "spring"; stiffness: number; damping: number; mass: number };
  layoutTransition: { type: "spring"; stiffness: number; damping: number };
}

export function useDashboardState(initialView: DashboardView = "liquidity") {
  const [state, setState] = useState<DashboardState>({
    activeView: initialView,
    timeRange: "30d",
    entityScope: "global",
    isCommandPaletteOpen: false,
    layoutKey: `${initialView}-30d-global-0`,
  });

  const setActiveView = useCallback((view: DashboardView) => {
    setState((prev) => ({
      ...prev,
      activeView: view,
      layoutKey: `${view}-${prev.timeRange}-${prev.entityScope}-${Date.now()}`,
    }));
  }, []);

  const setTimeRange = useCallback((range: TimeRange) => {
    setState((prev) => ({
      ...prev,
      timeRange: range,
      layoutKey: `${prev.activeView}-${range}-${prev.entityScope}-${Date.now()}`,
    }));
  }, []);

  const setEntityScope = useCallback((scope: EntityScope) => {
    setState((prev) => ({
      ...prev,
      entityScope: scope,
      layoutKey: `${prev.activeView}-${prev.timeRange}-${scope}-${Date.now()}`,
    }));
  }, []);

  const toggleCommandPalette = useCallback((force?: boolean) => {
    setState((prev) => ({
      ...prev,
      isCommandPaletteOpen: force !== undefined ? force : !prev.isCommandPaletteOpen,
    }));
  }, []);

  const motionPhysics = useMemo<MotionPhysics>(
    () => ({
      springSoft: { type: "spring", stiffness: 100, damping: 20, mass: 0.8 },
      springSnappy: { type: "spring", stiffness: 300, damping: 25, mass: 0.5 },
      springLux: { type: "spring", stiffness: 150, damping: 15, mass: 1 },
      layoutTransition: { type: "spring", stiffness: 380, damping: 30 },
    }),
    []
  );

  const actions: DashboardActions = {
    setActiveView,
    setTimeRange,
    setEntityScope,
    toggleCommandPalette,
  };

  return {
    ...state,
    ...actions,
    motionPhysics,
  };
}

export function useMagneticCursor(
  strength: number = 0.15,
  springConfig = { stiffness: 150, damping: 15, mass: 0.1 }
) {
  const ref = useRef<HTMLDivElement | HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e: MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const distX = e.clientX - centerX;
    const distY = e.clientY - centerY;

    x.set(distX * strength);
    y.set(distY * strength);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return {
    ref,
    style: { x: springX, y: springY },
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
  };
}

export function useTactileTilt(maxTilt: number = 8, glareOpacity: number = 0.15) {
  const ref = useRef<HTMLDivElement>(null);

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const mouseX = useMotionValue(50);
  const mouseY = useMotionValue(50);

  const springRotateX = useSpring(rotateX, { stiffness: 150, damping: 20, mass: 0.2 });
  const springRotateY = useSpring(rotateY, { stiffness: 150, damping: 20, mass: 0.2 });

  const glareGradient = useTransform(
    [mouseX, mouseY],
    ([x, y]) =>
      `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,${glareOpacity}), transparent 40%)`
  );

  const handleMouseMove = (e: MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();

    const width = rect.width;
    const height = rect.height;

    const xPct = ((e.clientX - rect.left) / width) * 100;
    const yPct = ((e.clientY - rect.top) / height) * 100;

    mouseX.set(xPct);
    mouseY.set(yPct);

    const rotX = ((yPct - 50) / 50) * -maxTilt;
    const rotY = ((xPct - 50) / 50) * maxTilt;

    rotateX.set(rotX);
    rotateY.set(rotY);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    mouseX.set(50);
    mouseY.set(50);
  };

  return {
    ref,
    style: {
      rotateX: springRotateX,
      rotateY: springRotateY,
      transformPerspective: 1200,
    },
    glareStyle: {
      backgroundImage: glareGradient,
    },
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
  };
}