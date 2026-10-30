"use client";

import { forwardRef, useRef, ReactNode, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  HTMLMotionProps,
} from "framer-motion";
import { cn } from "@/lib/utils";

type CardVariant = "glass" | "solid" | "elevated" | "interactive";
type CardPadding = "none" | "sm" | "md" | "lg";

interface CardProps extends Omit<HTMLMotionProps<"div">, "children"> {
  variant?: CardVariant;
  padding?: CardPadding;
  spotlight?: boolean;
  interactive?: boolean;
  children: ReactNode;
  className?: string;
}

const innerBgStyles: Record<CardVariant, string> = {
  glass: "bg-surface/60 backdrop-blur-2xl",
  solid: "bg-surface-raised",
  elevated: "bg-surface-overlay",
  interactive: "bg-surface-raised",
};

const paddingStyles: Record<CardPadding, string> = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = "solid",
      padding = "md",
      spotlight = false,
      interactive = false,
      className,
      children,
      onMouseMove,
      onMouseEnter,
      onMouseLeave,
      ...props
    },
    ref
  ) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [hovered, setHovered] = useState(false);

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springX = useSpring(mouseX, { stiffness: 150, damping: 20, mass: 0.2 });
    const springY = useSpring(mouseY, { stiffness: 150, damping: 20, mass: 0.2 });

    const spotlightGradient = useTransform(
      [springX, springY],
      ([x, y]) =>
        `radial-gradient(350px circle at ${x}px ${y}px, rgba(16, 185, 129, 0.25), transparent 45%)`
    );

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();
        mouseX.set(e.clientX - rect.left);
        mouseY.set(e.clientY - rect.top);
      }
      onMouseMove?.(e);
    };

    const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
      setHovered(true);
      onMouseEnter?.(e);
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
      setHovered(false);
      mouseX.set(0);
      mouseY.set(0);
      onMouseLeave?.(e);
    };

    const isSpotlightActive = spotlight && hovered;

    return (
      <motion.div
        ref={(node) => {
          (cardRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        whileHover={
          interactive
            ? {
                y: -6,
                scale: 1.005,
                transition: { type: "spring", stiffness: 300, damping: 20 },
              }
            : {}
        }
        whileTap={
          interactive
            ? {
                y: 0,
                scale: 0.995,
                transition: { type: "spring", stiffness: 400, damping: 25 },
              }
            : {}
        }
        className={cn(
          "group relative isolate overflow-hidden rounded-3xl transition-all duration-500 ease-spring-soft",
          interactive && "cursor-pointer",
          className
        )}
        {...props}
      >
        {/* Spotlight Border Wrapper */}
        <motion.div
          className={cn(
            "absolute inset-0 z-0 rounded-3xl transition-opacity duration-500",
            isSpotlightActive ? "opacity-100" : "opacity-0"
          )}
          style={spotlight ? { background: spotlightGradient } : undefined}
          aria-hidden="true"
        />

        {/* Default Border (Fallback when spotlight is inactive) */}
        <div
          className={cn(
            "absolute inset-0 z-0 rounded-3xl border transition-colors duration-500",
            isSpotlightActive
              ? "border-transparent"
              : variant === "glass"
              ? "border-white/[0.08]"
              : "border-white/[0.06]",
            interactive && !isSpotlightActive && "group-hover:border-white/[0.12]"
          )}
          aria-hidden="true"
        />

        {/* Inner Content Container */}
        <div
          className={cn(
            "relative z-10 h-full w-full rounded-[calc(1.5rem-1px)] transition-all duration-500",
            innerBgStyles[variant],
            paddingStyles[padding]
          )}
        >
          {/* Premium Inner Top Highlight */}
          <div
            className={cn(
              "absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent transition-opacity duration-500",
              interactive ? "opacity-0 group-hover:opacity-100" : "opacity-100"
            )}
            aria-hidden="true"
          />

          {/* Ambient Inner Glow on Hover */}
          {interactive && (
            <div
              className="absolute inset-0 rounded-[calc(1.5rem-1px)] bg-gradient-to-b from-white/[0.03] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none"
              aria-hidden="true"
            />
          )}

          {children}
        </div>

        {/* Drop Shadow Layer for Depth */}
        <div
          className={cn(
            "absolute -inset-px -z-10 rounded-3xl transition-all duration-500",
            interactive
              ? "shadow-micro group-hover:shadow-glass-hover"
              : variant === "elevated"
              ? "shadow-glass"
              : "shadow-micro"
          )}
          aria-hidden="true"
        />
      </motion.div>
    );
  }
);

Card.displayName = "Card";

// --- Sub-Components for Composability ---

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function CardHeader({ className, children, ...props }: CardHeaderProps) {
  return (
    <div
      className={cn("flex flex-col space-y-1.5 pb-4", className)}
      {...props}
    >
      {children}
    </div>
  );
}

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode;
}

export function CardTitle({ className, children, ...props }: CardTitleProps) {
  return (
    <h3
      className={cn(
        "text-base font-display font-semibold tracking-tight text-ink",
        className
      )}
      {...props}
    >
      {children}
    </h3>
  );
}

interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: ReactNode;
}

export function CardDescription({
  className,
  children,
  ...props
}: CardDescriptionProps) {
  return (
    <p
      className={cn("text-xs text-ink-muted leading-relaxed", className)}
      {...props}
    >
      {children}
    </p>
  );
}

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function CardContent({ className, children, ...props }: CardContentProps) {
  return (
    <div className={cn("relative", className)} {...props}>
      {children}
    </div>
  );
}

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function CardFooter({ className, children, ...props }: CardFooterProps) {
  return (
    <div
      className={cn(
        "flex items-center pt-4 mt-4 border-t border-white/[0.04]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}