"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  ArrowDownLeft,
  ShieldCheck,
  Zap,
  CircleDollarSign,
  MoreHorizontal,
  Activity,
} from "lucide-react";

type ActivityType = "inflow" | "outflow" | "risk" | "system" | "fx" | "liquidity";

interface ActivityItem {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  amount?: string;
  amountType?: "positive" | "negative" | "neutral";
  timestamp: string;
  node?: string;
}

const activities: ActivityItem[] = [
  {
    id: "act-001",
    type: "liquidity",
    title: "Cross-Border Sweep Executed",
    description: "Automated liquidity routing from APAC subsidiary.",
    amount: "+$4.2M",
    amountType: "positive",
    timestamp: "2m ago",
    node: "SG-01",
  },
  {
    id: "act-002",
    type: "risk",
    title: "Hedge Rebalanced",
    description: "EUR/USD forward contract rolled to Q2.",
    timestamp: "14m ago",
    node: "EU-CENTRAL",
  },
  {
    id: "act-003",
    type: "outflow",
    title: "Vendor Disbursement Cleared",
    description: "Batch #8839 processed via Fedwire.",
    amount: "-$1.8M",
    amountType: "negative",
    timestamp: "38m ago",
    node: "US-EAST",
  },
  {
    id: "act-004",
    type: "system",
    title: "Treasury AI Model Updated",
    description: "v3.1.2 deployed. Forecast accuracy improved by 2.4%.",
    timestamp: "1h ago",
  },
  {
    id: "act-005",
    type: "fx",
    title: "Spot Rate Alert Triggered",
    description: "GBP/JPY breached lower threshold (184.20).",
    amountType: "neutral",
    timestamp: "2h ago",
    node: "LND-02",
  },
];

const iconConfig: Record<
  ActivityType,
  { icon: React.ElementType; bg: string; text: string }
> = {
  inflow: {
    icon: ArrowUpRight,
    bg: "bg-accent/10 border border-accent/20",
    text: "text-accent",
  },
  liquidity: {
    icon: Zap,
    bg: "bg-accent/10 border border-accent/20",
    text: "text-accent",
  },
  outflow: {
    icon: ArrowDownLeft,
    bg: "bg-danger/10 border border-danger/20",
    text: "text-danger",
  },
  risk: {
    icon: ShieldCheck,
    bg: "bg-info/10 border border-info/20",
    text: "text-info",
  },
  system: {
    icon: Activity,
    bg: "bg-white/5 border border-white/10",
    text: "text-ink-muted",
  },
  fx: {
    icon: CircleDollarSign,
    bg: "bg-warning/10 border border-warning/20",
    text: "text-warning",
  },
};

const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 18,
      mass: 0.5,
    },
  },
};

export function ActivityFeed() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-xl shadow-glass">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-surface-raised border border-white/10 shadow-micro">
            <Activity className="h-4 w-4 text-accent" />
            <div className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-accent">
              <div className="absolute inset-0 animate-ping rounded-full bg-accent opacity-75" />
            </div>
          </div>
          <div>
            <h3 className="text-sm font-display font-semibold tracking-tight text-ink">
              System Events
            </h3>
            <p className="text-2xs font-medium text-ink-faint tracking-wider uppercase">
              Live Ledger Feed
            </p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05, x: 2 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-ink-muted hover:bg-white/[0.06] hover:text-ink transition-colors"
          aria-label="More options"
        >
          <MoreHorizontal className="h-4 w-4" />
        </motion.button>
      </div>

      {/* Feed List */}
      <motion.ul
        variants={listVariants}
        initial="hidden"
        animate="visible"
        className="flex-1 overflow-y-auto p-3 space-y-2 no-scrollbar"
      >
        {activities.map((activity) => {
          const config = iconConfig[activity.type];
          const Icon = config.icon;
          const isHovered = hoveredId === activity.id;

          return (
            <motion.li
              key={activity.id}
              variants={itemVariants}
              onMouseEnter={() => setHoveredId(activity.id)}
              onMouseLeave={() => setHoveredId(null)}
              whileHover={{ 
                y: -2, 
                scale: 1.01,
                transition: { type: "spring", stiffness: 400, damping: 20 }
              }}
              whileTap={{ scale: 0.99 }}
              className="group relative flex cursor-pointer items-start gap-4 rounded-2xl border border-transparent p-4 transition-colors hover:border-white/[0.06] hover:bg-white/[0.03]"
            >
              {/* Hover Glow Effect */}
              <div className="absolute inset-0 rounded-2xl bg-accent/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

              {/* Icon */}
              <div
                className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${config.bg} ${config.text} shadow-micro transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}
              >
                <Icon className="h-[18px] w-[18px]" strokeWidth={2.2} />
              </div>

              {/* Content */}
              <div className="relative z-10 flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-2 mb-1">
                  <h4 className="truncate text-sm font-semibold text-ink transition-colors group-hover:text-white">
                    {activity.title}
                  </h4>
                  {activity.amount && (
                    <span
                      className={`shrink-0 text-sm font-mono font-semibold tracking-tight ${
                        activity.amountType === "positive"
                          ? "text-accent"
                          : activity.amountType === "negative"
                          ? "text-danger"
                          : "text-ink-muted"
                      }`}
                    >
                      {activity.amount}
                    </span>
                  )}
                </div>
                <p className="mb-2 truncate text-xs text-ink-muted leading-relaxed">
                  {activity.description}
                </p>
                <div className="flex items-center gap-2 text-2xs font-medium text-ink-faint tracking-wider uppercase">
                  <span>{activity.timestamp}</span>
                  {activity.node && (
                    <>
                      <span className="h-0.5 w-0.5 rounded-full bg-ink-disabled" />
                      <span className="font-mono tracking-widest">{activity.node}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Arrow Indicator on Hover */}
              <motion.div
                initial={{ opacity: 0, x: -4 }}
                animate={{
                  opacity: isHovered ? 1 : 0,
                  x: isHovered ? 0 : -4,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="relative z-10 mt-2.5 shrink-0 text-ink-muted"
              >
                <ArrowUpRight className="h-4 w-4" />
              </motion.div>
            </motion.li>
          );
        })}
      </motion.ul>
      
      {/* Bottom Fade Gradient */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-surface-raised/80 to-transparent backdrop-blur-md" />
    </div>
  );
}