"use client";

import { use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { AlertTriangle, ArrowLeft } from "lucide-react";

import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { LiquidityView } from "@/components/views/LiquidityView";
import { RiskView } from "@/components/views/RiskView";
import { ForecastView } from "@/components/views/ForecastView";

const VALID_VIEWS = ["liquidity", "risk", "forecast"] as const;
type ViewType = (typeof VALID_VIEWS)[number];

const pageVariants = {
  initial: (direction: number) => ({
    opacity: 0,
    y: 24,
    scale: 0.98,
    filter: "blur(12px)",
    x: direction > 0 ? 30 : -30,
  }),
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    x: 0,
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 22,
      mass: 0.6,
      filter: { duration: 0.4 },
    },
  },
  exit: (direction: number) => ({
    opacity: 0,
    y: -16,
    scale: 1.02,
    filter: "blur(6px)",
    x: direction > 0 ? -30 : 30,
    transition: {
      type: "spring",
      stiffness: 140,
      damping: 24,
      mass: 0.4,
      duration: 0.3,
    },
  }),
};

export default function ViewPage({
  params,
}: {
  params: Promise<{ view: string }>;
}) {
  const { view } = use(params);
  const router = useRouter();

  const isValidView = VALID_VIEWS.includes(view as ViewType);
  const currentView = isValidView ? (view as ViewType) : null;
  
  // Calculate directional index for slide animations
  const currentIndex = currentView ? VALID_VIEWS.indexOf(currentView) : 0;

  const renderView = () => {
    if (!currentView) return null;
    switch (currentView) {
      case "liquidity":
        return <LiquidityView />;
      case "risk":
        return <RiskView />;
      case "forecast":
        return <ForecastView />;
    }
  };

  if (!currentView) {
    return (
      <DashboardShell currentView="liquidity">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="flex flex-col items-center justify-center h-[calc(100vh-8rem)] text-center px-6"
        >
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-danger/20 blur-3xl rounded-full" />
            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-raised border border-danger/30 shadow-glass">
              <AlertTriangle className="h-7 w-7 text-danger" />
            </div>
          </div>
          <h2 className="text-2xl font-display font-semibold text-ink mb-2">
            Sector Not Found
          </h2>
          <p className="text-ink-muted mb-8 max-w-sm">
            The requested operational view is offline or does not exist in this environment.
          </p>
          <motion.button
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push("/liquidity")}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-accent/10 border border-accent/20 text-accent font-medium text-sm hover:bg-accent/20 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Return to Liquidity
          </motion.button>
        </motion.div>
      </DashboardShell>
    );
  }

    return (
    <DashboardShell currentView={currentView}>
      <div className="relative w-full">
        {/* View Header Ambient Indicator */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 pointer-events-none z-0">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="h-64 w-64 rounded-full bg-accent/5 blur-[100px]"
          />
        </div>

        <AnimatePresence mode="wait" custom={currentIndex}>
          <motion.div
            key={currentView}
            custom={currentIndex}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="relative z-10 w-full"
          >
            {/* Tactile View Wrapper */}
            <div className="relative">
              <motion.div 
                className="absolute -inset-px rounded-3xl bg-gradient-to-b from-white/[0.08] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" 
                aria-hidden="true" 
              />
              {renderView()}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </DashboardShell>
  );
}
