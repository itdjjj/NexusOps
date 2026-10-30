"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Command,
  ArrowRight,
  Zap,
  ShieldCheck,
  LineChart,
  Settings,
  Sparkles,
  CornerDownLeft,
  ArrowDownLeft,
  X,
} from "lucide-react";

type CommandGroup = "navigation" | "actions" | "ai";

interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon: React.ElementType;
  shortcut?: string[];
  action: () => void;
  group: CommandGroup;
}

const COMMANDS: CommandItem[] = [
  {
    id: "nav-liquidity",
    label: "Go to Liquidity",
    description: "View global cash positions and routing",
    icon: LineChart,
    shortcut: ["G", "L"],
    action: () => {},
    group: "navigation",
  },
  {
    id: "nav-risk",
    label: "Go to Risk",
    description: "Monitor systemic exposure and hedges",
    icon: ShieldCheck,
    shortcut: ["G", "R"],
    action: () => {},
    group: "navigation",
  },
  {
    id: "nav-forecast",
    label: "Go to Forecast",
    description: "Review Q4 predictive models",
    icon: Zap,
    shortcut: ["G", "F"],
    action: () => {},
    group: "navigation",
  },
  {
    id: "act-export",
    label: "Export Ledger",
    description: "Download CSV of last 30 days transactions",
    icon: ArrowDownLeft,
    action: () => {},
    group: "actions",
  },
  {
    id: "act-settings",
    label: "System Settings",
    description: "Configure API keys and webhooks",
    icon: Settings,
    shortcut: ["⌘", ","],
    action: () => {},
    group: "actions",
  },
  {
    id: "ai-predict",
    label: "Run AI Cashflow Prediction",
    description: "Execute Monte Carlo simulation for next 90 days",
    icon: Sparkles,
    action: () => {},
    group: "ai",
  },
];

const groupLabels: Record<CommandGroup, string> = {
  navigation: "Navigation",
  actions: "Actions",
  ai: "AI Agents",
};

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.15, ease: [0.4, 0, 1, 1] }
  },
};

const panelVariants = {
  hidden: { 
    opacity: 0, 
    scale: 0.96, 
    y: 20,
    filter: "blur(12px)",
  },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    filter: "blur(0px)",
    transition: {
      type: "spring",
      stiffness: 350,
      damping: 28,
      mass: 0.8,
      filter: { duration: 0.3 }
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.98, 
    y: 10,
    filter: "blur(8px)",
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 30,
      duration: 0.2
    }
  },
};

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Map<number, HTMLButtonElement>>(new Map());

  const filteredCommands = useMemo(() => {
    if (!query) return COMMANDS;
    const lowerQuery = query.toLowerCase();
    return COMMANDS.filter(
      (cmd) =>
        cmd.label.toLowerCase().includes(lowerQuery) ||
        cmd.description?.toLowerCase().includes(lowerQuery)
    );
  }, [query]);

  const groupedCommands = useMemo(() => {
    const groups: Partial<Record<CommandGroup, CommandItem[]>> = {};
    filteredCommands.forEach((cmd) => {
      if (!groups[cmd.group]) groups[cmd.group] = [];
      groups[cmd.group]!.push(cmd);
    });
    return groups;
  }, [filteredCommands]);

  const flatFiltered = useMemo(() => filteredCommands, [filteredCommands]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }

      if (!open) return;

      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelected((prev) => (prev + 1) % flatFiltered.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelected((prev) => (prev - 1 + flatFiltered.length) % flatFiltered.length);
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (flatFiltered[selected]) {
          flatFiltered[selected].action();
          setOpen(false);
        }
      }
    },
    [open, flatFiltered, selected]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setSelected(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    setSelected(0);
  }, [query]);

  useEffect(() => {
    const node = itemRefs.current.get(selected);
    if (node) {
      node.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [selected]);

  const handleItemClick = (cmd: CommandItem) => {
    cmd.action();
    setOpen(false);
  };

  if (typeof window === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[999] flex items-start justify-center pt-[15vh]"
          initial="hidden"
          animate="visible"
          exit="exit"
          role="dialog"
          aria-modal="true"
          aria-label="Command Menu"
        >
          {/* Backdrop */}
          <motion.div
            variants={overlayVariants}
            className="absolute inset-0 bg-obsidian/60 backdrop-blur-md"
            onClick={() => setOpen(false)}
          />

          {/* Panel */}
          <motion.div
            variants={panelVariants}
            className="relative z-10 w-full max-w-2xl overflow-hidden rounded-3xl border border-white/[0.08] bg-surface-raised/95 shadow-2xl shadow-black/50 backdrop-blur-2xl"
            layout
          >
            {/* Ambient Top Glow */}
            <div className="absolute -top-24 left-1/2 h-48 w-[120%] -translate-x-1/2 bg-accent/10 blur-[80px] pointer-events-none" />

            {/* Search Input */}
            <div className="relative flex items-center gap-4 border-b border-white/[0.06] px-6 py-5">
              <Search className="h-5 w-5 shrink-0 text-ink-muted" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Command your liquidity..."
                className="flex-1 bg-transparent text-base font-medium text-ink placeholder-ink-disabled outline-none"
                spellCheck={false}
              />
              <div className="flex items-center gap-1.5 rounded-md border border-white/[0.08] bg-white/[0.03] px-2 py-1 text-2xs font-mono text-ink-faint">
                <span>ESC</span>
              </div>
            </div>

            {/* Results */}
            <div
              ref={listRef}
              className="max-h-[400px] overflow-y-auto p-3 no-scrollbar"
            >
              {flatFiltered.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center py-16 text-center"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                    <X className="h-5 w-5 text-ink-faint" />
                  </div>
                  <p className="text-sm font-medium text-ink-muted">No commands found</p>
                  <p className="mt-1 text-xs text-ink-faint">Try adjusting your search query</p>
                </motion.div>
              ) : (
                <div className="space-y-4">
                  {(Object.keys(groupedCommands) as CommandGroup[]).map((group) => (
                    <div key={group}>
                      <h3 className="mb-2 px-3 text-2xs font-semibold uppercase tracking-widest text-ink-faint">
                        {groupLabels[group]}
                      </h3>
                      <div className="space-y-1">
                        {groupedCommands[group]?.map((cmd) => {
                          const flatIndex = flatFiltered.indexOf(cmd);
                          const isSelected = flatIndex === selected;
                          const Icon = cmd.icon;

                          return (
                            <motion.button
                              key={cmd.id}
                              ref={(el) => {
                                if (el) itemRefs.current.set(flatIndex, el);
                              }}
                              layout
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -8 }}
                              transition={{ type: "spring", stiffness: 300, damping: 25 }}
                              onClick={() => handleItemClick(cmd)}
                              onMouseEnter={() => setSelected(flatIndex)}
                              className={`group relative flex w-full items-center gap-4 rounded-2xl border p-3 text-left transition-colors ${
                                isSelected
                                  ? "border-accent/20 bg-accent/[0.06]"
                                  : "border-transparent hover:bg-white/[0.03]"
                              }`}
                            >
                              {/* Selection Glow */}
                              {isSelected && (
                                <motion.div
                                  layoutId="command-highlight"
                                  className="absolute inset-0 rounded-2xl bg-accent/[0.04]"
                                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                />
                              )}

                              <div
                                className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border shadow-micro transition-colors ${
                                  isSelected
                                    ? "border-accent/30 bg-accent/10 text-accent"
                                    : "border-white/[0.06] bg-white/[0.03] text-ink-muted group-hover:text-ink"
                                }`}
                              >
                                <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
                              </div>

                              <div className="relative z-10 flex-1 min-w-0">
                                <p
                                  className={`truncate text-sm font-semibold transition-colors ${
                                    isSelected ? "text-white" : "text-ink"
                                  }`}
                                >
                                  {cmd.label}
                                </p>
                                {cmd.description && (
                                  <p className="truncate text-xs text-ink-faint mt-0.5">
                                    {cmd.description}
                                  </p>
                                )}
                              </div>

                              <div className="relative z-10 flex items-center gap-2">
                                {cmd.shortcut && (
                                  <div className="flex items-center gap-1">
                                    {cmd.shortcut.map((key) => (
                                      <kbd
                                        key={key}
                                        className="flex h-6 min-w-[24px] items-center justify-center rounded-md border border-white/[0.08] bg-white/[0.04] px-1.5 text-2xs font-mono font-medium text-ink-muted shadow-sm"
                                      >
                                        {key}
                                      </kbd>
                                    ))}
                                  </div>
                                )}
                                <motion.div
                                  animate={{ 
                                    x: isSelected ? 0 : -4, 
                                    opacity: isSelected ? 1 : 0 
                                  }}
                                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                >
                                  <CornerDownLeft className={`h-4 w-4 ${isSelected ? "text-accent" : "text-ink-faint"}`} />
                                </motion.div>
                              </div>
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-white/[0.06] bg-white/[0.02] px-6 py-3">
              <div className="flex items-center gap-3 text-2xs font-medium text-ink-faint">
                <div className="flex items-center gap-1.5">
                  <Command className="h-3.5 w-3.5" />
                  <span>K</span>
                </div>
                <span className="text-white/10">|</span>
                <span>NexusOps v3.0.4</span>
              </div>
              <div className="flex items-center gap-3 text-2xs font-medium text-ink-faint">
                <span className="flex items-center gap-1">
                  <ArrowRight className="h-3 w-3" /> Navigate
                </span>
                <span className="flex items-center gap-1">
                  <CornerDownLeft className="h-3 w-3" /> Select
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}