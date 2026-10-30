"use client";

import { use, Suspense, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

const viewAccents = {
  liquidity: { 
    primary: "#10B981", 
    glow: "rgba(16, 185, 129, 0.12)", 
    gradient: "rgba(16, 185, 129, 0.04)" 
  },
  risk: { 
    primary: "#38BDF8", 
    glow: "rgba(56, 189, 248, 0.12)", 
    gradient: "rgba(56, 189, 248, 0.04)" 
  },
  forecast: { 
    primary: "#F59E0B", 
    glow: "rgba(245, 158, 11, 0.12)", 
    gradient: "rgba(245, 158, 11, 0.04)" 
  },
};

type ValidView = keyof typeof viewAccents;

function DashboardContent({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ view: string }>;
}) {
  const { view } = use(params);
  const isValid = (Object.keys(viewAccents) as string[]).includes(view);
  const currentView = (isValid ? view : "liquidity") as ValidView;
  const accent = viewAccents[currentView];

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const { currentTarget, clientX, clientY } = e;
    const rect = currentTarget.getBoundingClientRect();
    setMousePos({
      x: clientX - rect.left,
      y: clientY - rect.top,
    });
  }, []);

  return (
    <div 
      className="relative flex min-h-screen w-full overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Dynamic Ambient Glow - Shifts based on active view */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentView}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
        >
          <motion.div
            className="absolute top-[-20%] right-[-10%] h-[800px] w-[800px] rounded-full blur-[180px]"
            style={{ backgroundColor: accent.glow }}
            animate={{
              scale: [1, 1.15, 1],
              x: [0, 40, 0],
              y: [0, -30, 0],
            }}
            transition={{
              duration: 16,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-[-30%] left-[-10%] h-[600px] w-[600px] rounded-full blur-[150px] opacity-60"
            style={{ backgroundColor: accent.glow }}
            animate={{
              scale: [1, 1.2, 1],
              x: [0, -30, 0],
              y: [0, 40, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Interactive Cursor Spotlight */}
      <div 
        className="pointer-events-none fixed inset-0 -z-0 transition-opacity duration-300 opacity-80"
        style={{
          background: `radial-gradient(800px circle at ${mousePos.x}px ${mousePos.y}px, ${accent.gradient}, transparent 40%)`,
        }}
      />

      {/* Core Dashboard Shell (Sidebar, Topbar, Tabs) */}
      <DashboardShell currentView={currentView}>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative h-full w-full"
        >
          {children}
        </motion.div>
      </DashboardShell>
    </div>
  );
}

function LayoutSkeleton() {
  const skeletonVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.98 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
        delay: i * 0.05,
      },
    }),
  };

  return (
    <div className="relative flex min-h-screen w-full p-6 md:p-8">
      <div className="flex w-full flex-col gap-6">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <motion.div 
            custom={0}
            variants={skeletonVariants}
            initial="hidden"
            animate="visible"
            className="h-8 w-64 rounded-xl bg-surface-raised border border-white/5 relative overflow-hidden"
          >
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
          </motion.div>
          <motion.div 
            custom={1}
            variants={skeletonVariants}
            initial="hidden"
            animate="visible"
            className="h-8 w-32 rounded-xl bg-surface-raised border border-white/5 relative overflow-hidden"
          >
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
          </motion.div>
        </div>

        {/* Grid Skeletons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
          {[2, 3, 4].map((i) => (
            <motion.div
              key={i}
              custom={i}
              variants={skeletonVariants}
              initial="hidden"
              animate="visible"
              className="glass-card h-64 p-6 flex flex-col gap-4 relative overflow-hidden"
            >
              <div className="h-4 w-24 rounded-md bg-white/5" />
              <div className="h-8 w-32 rounded-md bg-white/5" />
              <div className="mt-auto h-24 w-full rounded-xl bg-white/[0.02] border border-white/5" />
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_2.5s_infinite] bg-gradient-to-r from-transparent via-white/[0.03] to-transparent" />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ view: string }>;
}) {
  return (
    <Suspense fallback={<LayoutSkeleton />}>
      <DashboardContent params={params}>{children}</DashboardContent>
    </Suspense>
  );
}