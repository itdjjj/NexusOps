"use client";

import { forwardRef, useState, useRef, useCallback, ReactNode } from "react";
import { motion, AnimatePresence, HTMLMotionProps, useMotionValue, useSpring } from "framer-motion";
import { Loader2, Check, ArrowRight } from "lucide-react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "destructive" | "glass";
type ButtonSize = "sm" | "md" | "lg" | "icon";

interface RippleItem {
  x: number;
  y: number;
  id: number;
}

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  isSuccess?: boolean;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  magnetic?: boolean;
  children: ReactNode;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "relative bg-gradient-to-b from-accent to-accent-dim text-obsidian font-semibold shadow-[0_1px_0_rgba(255,255,255,0.2)_inset,0_8px_24px_-8px_rgba(16,185,129,0.5),0_2px_4px_rgba(0,0,0,0.3)] hover:shadow-[0_1px_0_rgba(255,255,255,0.25)_inset,0_12px_32px_-8px_rgba(16,185,129,0.65),0_4px_8px_rgba(0,0,0,0.4)] hover:from-accent-soft hover:to-accent",
  secondary:
    "relative bg-surface-raised text-ink border border-white/10 shadow-[0_1px_0_rgba(255,255,255,0.04)_inset,0_4px_12px_-2px_rgba(0,0,0,0.4)] hover:bg-surface-overlay hover:border-white/20 hover:shadow-[0_1px_0_rgba(255,255,255,0.06)_inset,0_8px_20px_-4px_rgba(0,0,0,0.5)]",
  ghost:
    "relative bg-transparent text-ink-muted border border-transparent hover:bg-white/[0.04] hover:text-ink hover:border-white/[0.06]",
  destructive:
    "relative bg-gradient-to-b from-danger to-red-700 text-white font-semibold shadow-[0_1px_0_rgba(255,255,255,0.15)_inset,0_8px_24px_-8px_rgba(244,63,94,0.5)] hover:shadow-[0_1px_0_rgba(255,255,255,0.2)_inset,0_12px_32px_-8px_rgba(244,63,94,0.65)]",
  glass:
    "relative bg-white/[0.04] backdrop-blur-xl text-ink border border-white/10 shadow-glass hover:bg-white/[0.07] hover:shadow-glass-hover hover:border-white/20",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-8 px-3.5 text-xs gap-1.5",
  md: "h-10 px-5 text-sm gap-2",
  lg: "h-12 px-7 text-base gap-2.5",
  icon: "h-10 w-10",
};

const iconSizeMap: Record<ButtonSize, string> = {
  sm: "h-3.5 w-3.5",
  md: "h-4 w-4",
  lg: "h-5 w-5",
  icon: "h-4 w-4",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "secondary",
      size = "md",
      isLoading = false,
      isSuccess = false,
      iconLeft,
      iconRight,
      magnetic = false,
      fullWidth = false,
      disabled,
      className = "",
      children,
      onClick,
      ...props
    },
    ref
  ) => {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [ripples, setRipples] = useState<RippleItem[]>([]);

    // Magnetic cursor tracking
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const springX = useSpring(x, { stiffness: 200, damping: 15, mass: 0.2 });
    const springY = useSpring(y, { stiffness: 200, damping: 15, mass: 0.2 });

    const handleMouseMove = useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!magnetic || !buttonRef.current) return;
        const rect = buttonRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const distX = e.clientX - centerX;
        const distY = e.clientY - centerY;
        x.set(distX * 0.15);
        y.set(distY * 0.15);
      },
      [magnetic, x, y]
    );

    const handleMouseLeave = useCallback(() => {
      x.set(0);
      y.set(0);
    }, [x, y]);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled || isLoading) return;

      // Create ripple at click position
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        const rippleX = e.clientX - rect.left;
        const rippleY = e.clientY - rect.top;
        const newRipple: RippleItem = {
          x: rippleX,
          y: rippleY,
          id: Date.now(),
        };

        setRipples((prev) => [...prev, newRipple]);
        setTimeout(() => {
          setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
        }, 600);
      }

      onClick?.(e);
    };

    const isDisabled = disabled || isLoading || isSuccess;

    const classes = [
      "relative inline-flex items-center justify-center font-medium rounded-xl overflow-hidden select-none",
      "transition-colors duration-base ease-spring-soft focus-ring",
      variantStyles[variant],
      sizeStyles[size],
      fullWidth ? "w-full" : "",
      isDisabled ? "opacity-50 cursor-not-allowed pointer-events-none" : "cursor-pointer",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const iconClass = iconSizeMap[size];

    return (
      <motion.button
        ref={(node) => {
          (buttonRef as React.MutableRefObject<HTMLButtonElement | null>).current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node;
        }}
        type="button"
        style={magnetic ? { x: springX, y: springY } : undefined}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        disabled={isDisabled}
        whileHover={!isDisabled ? { scale: 1.02, y: -1 } : {}}
        whileTap={!isDisabled ? { scale: 0.97, y: 0 } : {}}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        className={classes}
        {...props}
      >
        {/* Hover Inner Highlight */}
        {!isDisabled && (
          <motion.div
            className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-base pointer-events-none bg-gradient-to-b from-white/[0.08] via-transparent to-transparent"
            aria-hidden="true"
          />
        )}

        {/* Ripple Container */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          <AnimatePresence>
            {ripples.map((ripple) => (
              <motion.span
                key={ripple.id}
                initial={{ scale: 0, opacity: 0.6 }}
                animate={{ scale: 4, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="absolute rounded-full bg-white/20 pointer-events-none"
                style={{
                  left: ripple.x - 10,
                  top: ripple.y - 10,
                  width: 20,
                  height: 20,
                }}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Content Wrapper with Layout Animation */}
        <motion.span
          className="relative z-10 flex items-center gap-inherit"
          animate={
            isLoading || isSuccess
              ? { opacity: 0, scale: 0.8 }
              : { opacity: 1, scale: 1 }
          }
          transition={{ duration: 0.2 }}
        >
          {iconLeft && (
            <motion.span
              className={`shrink-0 ${iconClass} transition-transform duration-base`}
              whileHover={!isDisabled ? { x: -2 } : {}}
            >
              {iconLeft}
            </motion.span>
          )}

          {size !== "icon" && (
            <span className="whitespace-nowrap leading-none">{children}</span>
          )}

          {iconRight && (
            <motion.span
              className={`shrink-0 ${iconClass} transition-transform duration-base`}
              whileHover={!isDisabled ? { x: 2 } : {}}
            >
              {iconRight}
            </motion.span>
          )}
        </motion.span>

        {/* Loading Spinner */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 z-20 flex items-center justify-center"
            >
              <Loader2
                className={`${iconClass} animate-spin`}
                strokeWidth={2.5}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success Checkmark */}
        <AnimatePresence>
          {isSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 15,
              }}
              className="absolute inset-0 z-20 flex items-center justify-center"
            >
              <motion.div
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
              >
                <Check
                  className={`${iconClass} ${variant === "primary" ? "text-obsidian" : "text-accent"}`}
                  strokeWidth={3}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Primary Variant Glow on Hover */}
        {variant === "primary" && !isDisabled && (
          <motion.div
            className="absolute -inset-x-2 -inset-y-4 bg-accent/20 blur-2xl opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none -z-10"
            aria-hidden="true"
          />
        )}
      </motion.button>
    );
  }
);

Button.displayName = "Button";

// Convenience exports for common patterns
export function IconButton(props: Omit<ButtonProps, "size" | "children"> & { "aria-label": string; icon: ReactNode }) {
  const { icon, ...rest } = props;
  return (
    <Button size="icon" {...rest}>
      {icon}
    </Button>
  );
}

export function PrimaryCTA({ children, ...props }: Omit<ButtonProps, "variant">) {
  return (
    <Button
      variant="primary"
      size="lg"
      magnetic
      iconRight={<ArrowRight className="h-4 w-4" />}
      {...props}
    >
      {children}
    </Button>
  );
}