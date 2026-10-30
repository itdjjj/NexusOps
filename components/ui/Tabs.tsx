"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "relative inline-flex h-11 items-center justify-center gap-1 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-1 backdrop-blur-xl shadow-micro",
      className
    )}
    {...props}
  >
    {/* Premium inner top highlight */}
    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
  </TabsPrimitive.List>
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    asChild
    className={cn(
      "group relative inline-flex items-center justify-center whitespace-nowrap rounded-xl px-4 py-1.5 text-sm font-medium text-ink-muted ring-offset-obsidian transition-colors",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-ring focus-visible:ring-offset-2",
      "disabled:pointer-events-none disabled:opacity-50",
      "data-[state=active]:text-ink hover:text-ink/80",
      className
    )}
    {...props}
  >
    <motion.button
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="relative flex items-center gap-2 w-full h-full justify-center"
    >
      {/* Active Background Indicator */}
      <span className="absolute inset-0 z-0 rounded-xl bg-accent/10 border border-accent/20 scale-95 opacity-0 transition-all duration-300 ease-spring-soft shadow-[0_0_16px_rgba(16,185,129,0.12)] pointer-events-none group-data-[state=active]:scale-100 group-data-[state=active]:opacity-100" />
      
      {/* Active Ambient Glow */}
      <span className="absolute -inset-x-1 -inset-y-2 z-0 rounded-xl bg-accent/5 blur-xl opacity-0 transition-opacity duration-500 pointer-events-none group-data-[state=active]:opacity-100" />

      <span className="relative z-10 flex items-center gap-2">
        {children}
      </span>
    </motion.button>
  </TabsPrimitive.Trigger>
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-4 ring-offset-obsidian focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  >
    <motion.div
      initial={{ opacity: 0, y: 16, filter: "blur(10px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 20,
        mass: 0.6,
        filter: { duration: 0.4 },
      }}
    >
      {children}
    </motion.div>
  </TabsPrimitive.Content>
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };