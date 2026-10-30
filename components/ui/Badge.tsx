"use client";

import { ReactNode } from "react";
import { motion, HTMLMotionProps } from "framer-motion";

type BadgeVariant = "default" | "accent" | "danger" | "warning" | "info" | "glass";
type BadgeSize = "sm" | "md" | "lg";

interface BadgeProps extends Omit<HTMLMotionProps<"div">, "children"> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: ReactNode;
  pulse?: boolean;
  interactive?: boolean;
  children: ReactNode;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-white/[0.03] border-white/[0.08] text-ink-muted",
  accent: "bg-accent/10 border-accent/20 text-accent shadow-[0_0_16px_rgba(16,185,129,0.06)]",
  danger: "bg-danger/10 border-danger/20 text-danger shadow-[0_0_16px_rgba(244,63,94,0.06)]",
  warning: "bg-warning/10 border-warning/20 text-warning shadow-[0_0_16px_rgba(245,158,11,0.06)]",
  info: "bg-info/10 border-info/20 text-info shadow-[0_0_16px_rgba(56,189,248,0.06)]",
  glass: "bg-white/[0.06] border-white/[0.12] text-ink backdrop-blur-xl",
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: "px-2 py-0.5 text-[10px] gap-1 tracking-wider uppercase",
  md: "px-2.5 py-1 text-xs gap-1.5 tracking-wide",
  lg: "px-3.5 py-1.5 text-sm gap-2",
};

export function Badge({
  variant = "default",
  size = "md",
  icon,
  pulse = false,
  interactive = false,
  className = "",
  children,
  ...props
}: BadgeProps) {
  const classes = [
    "inline-flex items-center justify-center font-medium rounded-full border transition-all duration-300 ease-spring-soft",
    variantStyles[variant],
    sizeStyles[size],
    interactive ? "cursor-pointer" : "pointer-events-none",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <motion.div
      whileHover={
        interactive
          ? { y: -2, scale: 1.04, transition: { type: "spring", stiffness: 400, damping: 15 } }
          : { scale: 1.02, transition: { type: "spring", stiffness: 400, damping: 20 } }
      }
      whileTap={interactive ? { y: 0, scale: 0.96 } : {}}
      className={classes}
      {...props}
    >
      {pulse && (
        <span className="relative flex h-1.5 w-1.5 shrink-0">
          <motion.span
            className="absolute inline-flex h-full w-full rounded-full bg-current opacity-75"
            animate={{ scale: [1, 1.8, 1], opacity: [0.75, 0, 0.75] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-current" />
        </span>
      )}

      {icon && (
        <motion.span
          className="flex shrink-0 items-center justify-center"
          whileHover={interactive ? { rotate: [0, -12, 12, 0] } : {}}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          {icon}
        </motion.span>
      )}

      <span className="whitespace-nowrap leading-none font-display">{children}</span>
    </motion.div>
  );
}