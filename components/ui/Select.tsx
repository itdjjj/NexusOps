"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { motion } from "framer-motion";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

const Select = SelectPrimitive.Root;
const SelectGroup = SelectPrimitive.Group;
const SelectValue = SelectPrimitive.Value;

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "group relative flex h-10 w-full items-center justify-between rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 text-sm text-ink shadow-micro backdrop-blur-xl transition-all duration-base ease-spring-soft",
      "placeholder:text-ink-faint",
      "focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/30",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "hover:border-white/[0.14] hover:bg-white/[0.05]",
      "data-[state=open]:border-accent/40 data-[state=open]:bg-white/[0.05] data-[state=open]:shadow-glow",
      className
    )}
    {...props}
  >
    <span className="truncate font-medium">{children}</span>
    <SelectPrimitive.Icon asChild>
      <motion.div
        className="flex items-center justify-center text-ink-muted transition-colors group-data-[state=open]:text-accent"
        animate={{ rotate: 0 }}
      >
        <ChevronDown className="h-4 w-4 transition-transform duration-300 ease-spring-soft group-data-[state=open]:rotate-180" />
      </motion.div>
    </SelectPrimitive.Icon>

    {/* Subtle inner glow on hover */}
    <div className="absolute inset-0 rounded-xl bg-white/[0.02] opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none" />
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1 text-ink-muted hover:text-ink transition-colors",
      className
    )}
    {...props}
  >
    <ChevronUp className="h-4 w-4" />
  </SelectPrimitive.ScrollUpButton>
));
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1 text-ink-muted hover:text-ink transition-colors",
      className
    )}
    {...props}
  >
    <ChevronDown className="h-4 w-4" />
  </SelectPrimitive.ScrollDownButton>
));
SelectScrollDownButton.displayName =
  SelectPrimitive.ScrollDownButton.displayName;

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      asChild
      position={position}
      className={cn(
        "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-2xl border border-white/[0.1] bg-surface-raised/95 p-1.5 shadow-glass backdrop-blur-2xl",
        position === "popper" &&
          "data-[side=bottom]:translate-y-2 data-[side=left]:-translate-x-2 data-[side=right]:translate-x-2 data-[side=top]:-translate-y-2",
        className
      )}
      {...props}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: -8, filter: "blur(8px)" }}
        animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
        transition={{
          type: "spring",
          stiffness: 350,
          damping: 28,
          mass: 0.8,
          filter: { duration: 0.2 },
        }}
        className="relative w-full h-full"
      >
        {/* Ambient top highlight */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          className={cn(
            "p-1",
            position === "popper" &&
              "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </motion.div>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn(
      "py-1.5 pl-8 pr-2 text-2xs font-semibold uppercase tracking-widest text-ink-faint",
      className
    )}
    {...props}
  />
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "group relative flex w-full cursor-pointer select-none items-center rounded-xl py-2.5 pl-8 pr-2 text-sm text-ink-muted outline-none transition-all duration-fast",
      "focus:bg-white/[0.06] focus:text-ink",
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    {/* Active Indicator Line */}
    <div className="absolute left-1.5 top-1/2 -translate-y-1/2 h-4 w-0.5 rounded-full bg-accent scale-y-0 transition-transform duration-base ease-spring group-focus:scale-y-100" />

    <span className="absolute left-3.5 flex h-4 w-4 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
        >
          <Check className="h-3.5 w-3.5 text-accent" strokeWidth={3} />
        </motion.div>
      </SelectPrimitive.ItemIndicator>
    </span>

    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>

    {/* Hover background effect */}
    <div className="absolute inset-0 rounded-xl bg-white/[0.02] opacity-0 transition-opacity duration-fast group-focus:opacity-100 pointer-events-none" />
  </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn(
      "-mx-1 my-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent",
      className
    )}
    {...props}
  />
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
};