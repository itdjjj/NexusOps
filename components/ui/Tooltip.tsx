"use client";

import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const TooltipProvider = TooltipPrimitive.Provider;

const Tooltip = TooltipPrimitive.Root;

const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 8, children, ...props }, ref) => {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        ref={ref}
        sideOffset={sideOffset}
        asChild
        {...props}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: -4, filter: "blur(8px)" }}
          animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 0.96, y: -2, filter: "blur(4px)" }}
          transition={{
            type: "spring",
            stiffness: 450,
            damping: 22,
            mass: 0.6,
            filter: { duration: 0.2 },
          }}
          className={cn(
            "relative z-50 overflow-hidden rounded-xl border border-white/[0.12] bg-surface-overlay/95 px-3.5 py-2 text-xs font-medium text-ink shadow-glass backdrop-blur-2xl",
            "max-w-[260px] leading-relaxed",
            className
          )}
        >
          {/* Top Highlight for Premium Glassmorphism */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />
          
          {/* Inner Ambient Glow */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none" />

          <div className="relative z-10 flex items-center">
            {children}
          </div>

          <TooltipPrimitive.Arrow 
            className="fill-surface-overlay drop-shadow-[0_-1px_0_rgba(255,255,255,0.08)]" 
            width={12} 
            height={6} 
          />
        </motion.div>
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
});
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };