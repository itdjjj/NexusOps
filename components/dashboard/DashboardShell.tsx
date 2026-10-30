"use client";

import { ReactNode, useState, useCallback, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import {
  Zap,
  LayoutDashboard,
  Workflow,
  Bot,
  Settings,
  HelpCircle,
  Search,
  Command,
  Bell,
  ChevronRight,
} from "lucide-react";
import { ViewTabs } from "./ViewTabs";
import { CommandPalette } from "./CommandPalette";

interface DashboardShellProps {
  children: ReactNode;
  currentView: "liquidity" | "risk" | "forecast";
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  href?: string;
  badge?: string;
}

const primaryNav: NavItem[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "workflows", label: "Workflows", icon: Workflow, badge: "3" },
  { id: "agents", label: "AI Agents", icon: Bot },
];

const secondaryNav: NavItem[] = [
  { id: "settings", label: "Settings", icon: Settings },
  { id: "help", label: "Help & Support", icon: HelpCircle },
];

function MagneticButton({
  children,
  className,
  onClick,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { stiffness: 150, damping: 15, mass: 0.1 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * 0.15);
    y.set((e.clientY - centerY) * 0.15);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
      className={className}
    >
      {children}
    </motion.button>
  );
}

export function DashboardShell({ children, currentView }: DashboardShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isCmdPOpen, setIsCmdPOpen] = useState(false);

  const handleNavClick = useCallback(
    (href: string) => {
      router.push(href);
    },
    [router]
  );

  return (
    <div className="relative flex h-screen w-full overflow-hidden bg-obsidian text-ink">
      {/* Sidebar */}
      <aside className="relative hidden md:flex w-72 shrink-0 flex-col border-r border-white/[0.06] bg-surface/80 backdrop-blur-xl z-20">
        {/* Sidebar Ambient Glow */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-accent/[0.03] to-transparent pointer-events-none" />

        {/* Logo */}
        <div className="flex h-20 items-center gap-3 px-6">
          <motion.div
            whileHover={{ rotate: 15, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-accent/10 border border-accent/20 shadow-glow"
          >
            <Zap className="h-4.5 w-4.5 text-accent" fill="currentColor" />
            <div className="absolute inset-0 rounded-xl bg-accent/20 blur-md opacity-50" />
          </motion.div>
          <div>
            <h1 className="text-base font-display font-semibold tracking-tight text-white">
              NexusOps
            </h1>
            <p className="text-2xs font-mono text-ink-faint tracking-wider">v3.0.4</p>
          </div>
        </div>

        {/* Primary Nav */}
        <nav className="flex-1 px-4 py-4 space-y-1">
          <p className="px-3 mb-2 text-2xs font-semibold uppercase tracking-widest text-ink-faint">
            Operations
          </p>
          {primaryNav.map((item) => {
            const isActive = pathname?.includes(item.id);
            const Icon = item.icon;

            return (
              <motion.button
                key={item.id}
                onClick={() => item.href && handleNavClick(item.href)}
                whileHover={{ x: 4 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className={`group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive ? "text-white" : "text-ink-muted hover:text-white"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-active"
                    className="absolute inset-0 bg-accent/10 border border-accent/20 rounded-xl shadow-glow"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <Icon
                  className={`relative z-10 h-[18px] w-[18px] transition-colors ${
                    isActive ? "text-accent" : "text-ink-faint group-hover:text-ink"
                  }`}
                />
                <span className="relative z-10 flex-1 text-left">{item.label}</span>
                {item.badge && (
                  <span className="relative z-10 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-accent/20 px-1.5 text-[10px] font-bold text-accent">
                    {item.badge}
                  </span>
                )}
              </motion.button>
            );
          })}
        </nav>

        {/* Secondary Nav */}
        <div className="px-4 py-4 border-t border-white/[0.06]">
          {secondaryNav.map((item) => {
            const Icon = item.icon;
            return (
              <motion.button
                key={item.id}
                whileHover={{ x: 4 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-muted hover:text-white transition-colors"
              >
                <Icon className="h-[18px] w-[18px] text-ink-faint group-hover:text-ink transition-colors" />
                <span>{item.label}</span>
              </motion.button>
            );
          })}

          {/* User Profile Card */}
          <motion.div
            whileHover={{ y: -2, scale: 1.01 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="mt-4 flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3 cursor-pointer hover:bg-white/[0.04] transition-colors"
          >
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-accent/30 to-info/20 border border-white/10 text-sm font-bold text-white shadow-micro">
              AR
              <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-accent border-2 border-surface" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-semibold text-ink">Alex Rivera</p>
              <p className="truncate text-2xs text-ink-faint">Treasury Lead</p>
            </div>
            <ChevronRight className="h-4 w-4 text-ink-faint group-hover:text-ink transition-colors" />
          </motion.div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="relative flex flex-1 flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="relative z-10 flex h-20 shrink-0 items-center justify-between border-b border-white/[0.06] bg-surface-raised/60 px-6 md:px-8 backdrop-blur-xl">
          {/* Left: Breadcrumbs */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 text-sm text-ink-muted">
              <span>Treasury</span>
              <ChevronRight className="h-3.5 w-3.5 text-ink-faint" />
              <span className="font-medium text-ink capitalize">{currentView}</span>
            </div>
          </div>

          {/* Center: View Tabs */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden lg:block">
            <ViewTabs currentView={currentView} />
          </div>

          {/* Right: Global Actions */}
          <div className="flex items-center gap-3">
            {/* Command Palette Trigger */}
            <MagneticButton
              onClick={() => setIsCmdPOpen(true)}
              className="group relative flex items-center gap-3 rounded-full border border-white/[0.08] bg-white/[0.03] pl-4 pr-2 py-2 text-sm font-medium text-ink-muted hover:text-ink hover:border-white/20 hover:bg-white/[0.06] transition-colors shadow-micro"
            >
              <Search className="h-4 w-4" />
              <span className="hidden sm:inline">Command</span>
              <div className="flex items-center gap-1 rounded-md border border-white/[0.08] bg-obsidian/50 px-1.5 py-0.5 text-[10px] font-mono font-bold text-ink-faint shadow-sm">
                <Command className="h-3 w-3" />
                <span>K</span>
              </div>
            </MagneticButton>

            {/* Notifications */}
            <motion.button
              whileHover={{ y: -2, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="relative flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.03] text-ink-muted hover:text-ink hover:bg-white/[0.06] transition-colors shadow-micro"
            >
              <Bell className="h-[18px] w-[18px]" />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-danger"
              >
                <div className="absolute inset-0 animate-ping rounded-full bg-danger opacity-75" />
              </motion.div>
            </motion.button>

            {/* Mobile Menu Trigger (Placeholder) */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="md:hidden flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.03] text-ink-muted"
            >
              <LayoutDashboard className="h-[18px] w-[18px]" />
            </motion.button>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="relative flex-1 overflow-y-auto overflow-x-hidden p-6 md:p-8">
          {/* Content Ambient Background */}
          <div className="absolute inset-0 -z-10 pointer-events-none">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/[0.02] blur-[120px] rounded-full" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-info/[0.02] blur-[100px] rounded-full" />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-0 h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Global Modals/Overlays */}
      {isCmdPOpen && <CommandPalette />}
    </div>
  );
}