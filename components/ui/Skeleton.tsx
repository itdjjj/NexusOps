"use client";

import { Children, ReactNode } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

type SkeletonVariant = "text" | "circle" | "rect" | "card" | "chart";

interface SkeletonProps extends Omit<HTMLMotionProps<"div">, "children"> {
  variant?: SkeletonVariant;
  animated?: boolean;
}

const variantStyles: Record<SkeletonVariant, string> = {
  text: "h-4 w-full rounded-md",
  circle: "h-10 w-10 rounded-full",
  rect: "h-24 w-full rounded-xl",
  card: "h-64 w-full rounded-3xl border border-white/[0.04]",
  chart: "h-48 w-full rounded-2xl border border-white/[0.04]",
};

export function Skeleton({
  variant = "rect",
  animated = true,
  className,
  ...props
}: SkeletonProps) {
  const baseClasses = cn(
    "relative isolate overflow-hidden bg-surface-raised/50 shadow-micro",
    variantStyles[variant],
    animated && [
      "before:absolute before:inset-0 before:-translate-x-full before:animate-shimmer",
      "before:bg-gradient-to-r before:from-transparent before:via-white/[0.04] before:to-transparent",
    ],
    className
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
      transition={{
        type: "spring",
        stiffness: 120,
        damping: 20,
        mass: 0.5,
        filter: { duration: 0.3 },
      }}
      className={baseClasses}
      {...props}
    >
      {/* Top highlight for depth */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent pointer-events-none" />
      
      {/* Ambient inner glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.015] to-transparent pointer-events-none" />
    </motion.div>
  );
}

interface SkeletonGroupProps {
  children: ReactNode;
  className?: string;
  stagger?: boolean;
}

export function SkeletonGroup({ children, className, stagger = true }: SkeletonGroupProps) {
  if (!stagger) {
    return <div className={cn("grid gap-4", className)}>{children}</div>;
  }

  return (
    <div className={cn("grid gap-4", className)}>
      {Children.map(children, (child, index) => (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 20,
            delay: index * 0.08,
          }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  );
}