"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Activity,
  Zap,
} from "lucide-react";

export default function HomePage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, filter: "blur(8px)" },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
      },
    },
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-12">
      {/* Ambient Background Elements */}
      <div className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none">
        <motion.svg
          className="w-[1200px] h-[1200px] opacity-[0.07]"
          viewBox="0 0 1000 1000"
          animate={{ rotate: 360 }}
          transition={{ duration: 180, repeat: Infinity, ease: "linear" }}
        >
          <defs>
            <linearGradient id="grid-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#38BDF8" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0.8" />
            </linearGradient>
          </defs>
          <circle
            cx="500"
            cy="500"
            r="480"
            fill="none"
            stroke="url(#grid-grad)"
            strokeWidth="1.5"
            strokeDasharray="2 6"
          />
          <circle
            cx="500"
            cy="500"
            r="340"
            fill="none"
            stroke="url(#grid-grad)"
            strokeWidth="1"
            strokeDasharray="4 8"
          />
          <circle
            cx="500"
            cy="500"
            r="200"
            fill="none"
            stroke="url(#grid-grad)"
            strokeWidth="0.5"
          />
          <line x1="500" y1="20" x2="500" y2="980" stroke="url(#grid-grad)" strokeWidth="0.5" />
          <line x1="20" y1="500" x2="980" y2="500" stroke="url(#grid-grad)" strokeWidth="0.5" />
        </motion.svg>

        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full bg-accent/5 blur-[120px]"
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Header / Navigation */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-6"
      >
        <div className="flex items-center gap-3">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-surface-raised border border-white/10 shadow-micro">
            <Zap className="h-4 w-4 text-accent" />
            <div className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-accent animate-pulse" />
          </div>
          <span className="text-lg font-display font-semibold tracking-tight text-white">
            NexusOps
          </span>
        </div>

        <div className="hidden md:flex items-center gap-2 px-4 py-1.5 rounded-full glass-card text-2xs font-medium tracking-wider text-accent uppercase">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-accent"></span>
          </span>
          Global Systems Optimal
        </div>
      </motion.header>

      {/* Main Hero Content */}
      <motion.main
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="relative z-10 flex max-w-5xl flex-col items-center text-center"
      >
        <motion.div
          variants={itemVariants}
          className="mb-8 inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card border-white/10 text-xs font-medium text-ink-muted tracking-wide"
        >
          <Sparkles className="h-3.5 w-3.5 text-accent" />
          <span>Autonomous AI Treasury Agents</span>
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-display font-semibold tracking-[-0.04em] text-gradient leading-[0.95] mb-8"
        >
          Command Your<br />
          <span className="text-accent">Financial</span> Liquidity.
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="max-w-2xl text-base md:text-lg text-ink-muted leading-relaxed mb-12"
        >
          Institutional-grade risk modeling, predictive cash-flow forecasting, and
          algorithmic liquidity routing. Built for the modern enterprise treasury.
        </motion.p>

        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-4">
          <motion.div
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Link
              href="/dashboard/liquidity"
              className="group relative flex items-center gap-2 overflow-hidden rounded-full bg-accent px-8 py-4 text-sm font-semibold text-obsidian shadow-glow transition-all duration-300 hover:bg-accent-soft"
            >
              Enter Command Center
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              <div className="absolute inset-0 -z-10 bg-white/20 blur-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </Link>
          </motion.div>

          <motion.div
            whileHover={{ y: -2 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <button className="flex items-center gap-2 rounded-full px-8 py-4 text-sm font-medium text-ink-muted transition-colors hover:text-ink border border-white/5 hover:border-white/10 glass-card">
              View Architecture
            </button>
          </motion.div>
        </motion.div>
      </motion.main>

      {/* Floating Teaser Cards */}
      <div className="absolute inset-0 -z-0 hidden lg:block pointer-events-none">
        {/* Top Left: Liquidity */}
        <motion.div
          className="absolute left-[8%] top-[25%] w-64"
          initial={{ opacity: 0, x: -40, rotate: -5 }}
          animate={{ opacity: 1, x: 0, rotate: -3, y: [0, -10, 0] }}
          transition={{
            opacity: { duration: 1, delay: 0.8 },
            x: { duration: 1, delay: 0.8, ease: [0.22, 1, 0.36, 1] },
            rotate: { duration: 1, delay: 0.8 },
            y: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 },
          }}
          whileHover={{ y: -20, scale: 1.05, rotate: 0, transition: { type: "spring" } }}
        >
          <div className="glass-card p-5 pointer-events-auto">
            <div className="flex items-center justify-between mb-4">
              <span className="text-2xs font-medium text-ink-muted uppercase tracking-wider">Global Liquidity</span>
              <Activity className="h-3.5 w-3.5 text-accent" />
            </div>
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-2xl font-display font-semibold text-white tracking-tight">$4.28B</span>
              <span className="text-xs font-medium text-accent">+12.4%</span>
            </div>
            <div className="h-12 flex items-end gap-1.5">
              {[40, 65, 45, 80, 55, 95, 70, 85, 100, 75, 90, 60].map((h, i) => (
                <motion.div
                  key={i}
                  className="flex-1 bg-accent/20 rounded-full relative overflow-hidden"
                  style={{ height: `${h}%` }}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 0.8, delay: 1 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                >
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 bg-accent rounded-full"
                    initial={{ height: "0%" }}
                    animate={{ height: `${Math.random() * 40 + 40}%` }}
                    transition={{ duration: 1.5, delay: 1.5 + i * 0.05, ease: "easeOut" }}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Bottom Right: Risk */}
        <motion.div
          className="absolute right-[10%] bottom-[22%] w-60"
          initial={{ opacity: 0, x: 40, rotate: 5 }}
          animate={{ opacity: 1, x: 0, rotate: 4, y: [0, 12, 0] }}
          transition={{
            opacity: { duration: 1, delay: 1.1 },
            x: { duration: 1, delay: 1.1, ease: [0.22, 1, 0.36, 1] },
            rotate: { duration: 1, delay: 1.1 },
            y: { duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1.2 },
          }}
          whileHover={{ y: -20, scale: 1.05, rotate: 0, transition: { type: "spring" } }}
        >
          <div className="glass-card p-5 pointer-events-auto">
            <div className="flex items-center justify-between mb-4">
              <span className="text-2xs font-medium text-ink-muted uppercase tracking-wider">Systemic Risk</span>
              <ShieldCheck className="h-3.5 w-3.5 text-info" />
            </div>
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16 flex items-center justify-center">
                <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-white/5"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                  />
                  <motion.path
                    className="text-info"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeDasharray="100, 100"
                    initial={{ strokeDashoffset: 100 }}
                    animate={{ strokeDashoffset: 18 }}
                    transition={{ duration: 2, delay: 1.5, ease: [0.22, 1, 0.36, 1] }}
                  />
                </svg>
                <span className="absolute text-sm font-display font-bold text-white">82</span>
              </div>
              <div>
                <p className="text-xs text-ink-muted">Confidence Score</p>
                <p className="text-sm font-medium text-white">Enterprise Grade</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Top Right: Forecast */}
        <motion.div
          className="absolute right-[15%] top-[18%] w-56"
          initial={{ opacity: 0, y: -30, rotate: 3 }}
          animate={{ opacity: 1, y: [0, -8, 0], rotate: 2 }}
          transition={{
            opacity: { duration: 1, delay: 1.4 },
            rotate: { duration: 1, delay: 1.4 },
            y: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1.5 },
         }}
         whileHover={{ y: -20, scale: 1.05, rotate: 0, transition: { type: "spring" } }}
         >
          <div className="glass-card p-4 pointer-events-auto">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="h-3.5 w-3.5 text-warning" />
              <span className="text-2xs font-medium text-ink-muted uppercase tracking-wider">Q4 Forecast</span>
            </div>
            <svg viewBox="0 0 200 60" className="w-full h-12 overflow-visible">
              <defs>
                <linearGradient id="spark-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
                </linearGradient>
              </defs>
              <motion.path
                d="M0,45 C20,45 30,20 50,25 C70,30 80,50 100,40 C120,30 130,10 150,15 C170,20 180,5 200,5"
                fill="none"
                stroke="#F59E0B"
                strokeWidth="2"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, delay: 1.8, ease: "easeInOut" }}
              />
              <motion.path
                d="M0,45 C20,45 30,20 50,25 C70,30 80,50 100,40 C120,30 130,10 150,15 C170,20 180,5 200,5 L200,60 L0,60 Z"
                fill="url(#spark-grad)"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 2.5 }}
              />
              <motion.circle
                cx="200"
                cy="5"
                r="3"
                fill="#F59E0B"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, delay: 3.5 }}
              />
            </svg>
          </div>
        </motion.div>
      </div>

      {/* Footer / Status */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2 }}
        className="fixed bottom-6 left-0 right-0 z-50 flex justify-center"
      >
        <div className="flex items-center gap-3 px-4 py-2 rounded-full glass-card text-2xs font-mono text-ink-faint tracking-wider">
          <span className="h-1 w-1 rounded-full bg-white/20" />
          <span>NODE: EU-WEST-1</span>
          <span className="h-1 w-1 rounded-full bg-white/20" />
          <span>LATENCY: 14ms</span>
          <span className="h-1 w-1 rounded-full bg-white/20" />
          <span>v3.0.4-STABLE</span>
        </div>
      </motion.footer>
    </div>
  );
}