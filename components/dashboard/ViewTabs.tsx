"use client";

import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Activity, ShieldCheck, TrendingUp } from "lucide-react";

type ViewType = "liquidity" | "risk" | "forecast";

interface ViewTabsProps {
  currentView: ViewType;
}

interface TabItem {
  id: ViewType;
  label: string;
  icon: React.ElementType;
  description: string;
}

const tabs: TabItem[] = [
  {
    id: "liquidity",
    label: "Liquidity",
    icon: Activity,
    description: "Global Cash Positions",
  },
  {
    id: "risk",
    label: "Risk",
    icon: ShieldCheck,
    description: "Exposure & Hedges",
  },
  {
    id: "forecast",
    label: "Forecast",
    icon: TrendingUp,
    description: "Predictive Models",
  },
];

export function ViewTabs({ currentView }: ViewTabsProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleTabClick = (viewId: ViewType) => {
    if (viewId === currentView) return;
    
    const basePath = pathname.split("/").slice(0, -1).join("/");
    router.push(`${basePath || ""}/${viewId}`);
  };

  return (
    <div className="relative">
      {/* Container with glassmorphism */}
      <div className="relative flex items-center gap-1 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-1.5 backdrop-blur-xl shadow-glass">
        {/* Ambient Top Highlight */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentView === tab.id;

          return (
            <motion.button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className={`group relative flex items-center gap-2.5 rounded-xl px-5 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "text-white"
                  : "text-ink-muted hover:text-ink"
              }`}
            >
              {/* Active Background Indicator */}
              {isActive && (
                <motion.div
                  layoutId="active-tab-bg"
                  className="absolute inset-0 rounded-xl bg-accent/10 border border-accent/20 shadow-glow"
                  transition={{
                    type: "spring",
                    stiffness: 380,
                    damping: 30,
                    mass: 0.8,
                  }}
                />
              )}

              {/* Hover Glow Effect */}
              <div className="absolute inset-0 rounded-xl bg-white/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

              {/* Icon */}
              <motion.div
                animate={{
                  scale: isActive ? 1 : 0.95,
                  rotate: isActive ? 0 : -5,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="relative z-10"
              >
                <Icon
                  className={`h-4 w-4 transition-colors ${
                    isActive ? "text-accent" : "text-ink-faint group-hover:text-ink"
                  }`}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute -inset-1 bg-accent/20 blur-md rounded-full -z-10"
                  />
                )}
              </motion.div>

              {/* Label */}
              <span className="relative z-10 whitespace-nowrap">{tab.label}</span>

              {/* Active Indicator Dot */}
              {isActive && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 20, delay: 0.1 }}
                  className="relative z-10 ml-1"
                >
                  <div className="h-1.5 w-1.5 rounded-full bg-accent">
                    <div className="absolute inset-0 animate-ping rounded-full bg-accent opacity-75" />
                  </div>
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Tooltip for active tab */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.3 }}
        className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap"
      >
        <div className="rounded-full border border-white/[0.08] bg-surface-raised/90 px-3 py-1 text-2xs font-medium text-ink-muted backdrop-blur-xl">
          {tabs.find((t) => t.id === currentView)?.description}
        </div>
      </motion.div>
    </div>
  );
}