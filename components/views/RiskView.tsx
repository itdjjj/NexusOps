"use client";
import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  AlertTriangle,
  TrendingDown,
  Activity,
  Lock,
  Unlock,
  MoreHorizontal,
  Zap,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface RiskVector {
  id: string;
  label: string;
  value: number;
  max: number;
  description: string;
}

interface HeatmapCell {
  id: string;
  pair: string;
  score: number;
  volume: string;
  status: "critical" | "warning" | "normal";
}

interface ActiveHedge {
  id: string;
  instrument: string;
  notional: string;
  maturity: string;
  effectiveness: number;
  status: "locked" | "floating";
}

const riskVectors: RiskVector[] = [
  { id: "fx", label: "FX Volatility", value: 82, max: 100, description: "High exposure to EUR/USD fluctuations" },
  { id: "ir", label: "Interest Rate", value: 45, max: 100, description: "Moderate SOFR sensitivity in Q3 debt" },
  { id: "credit", label: "Credit Spread", value: 68, max: 100, description: "Widening spreads in high-yield portfolio" },
  { id: "liq", label: "Liquidity", value: 28, max: 100, description: "Ample cash reserves, low immediate risk" },
  { id: "op", label: "Operational", value: 15, max: 100, description: "Minimal counterparty settlement delays" },
];

const heatmapData: HeatmapCell[] = [
  { id: "1", pair: "EUR/USD", score: 88, volume: "$1.24B", status: "critical" },
  { id: "2", pair: "USD/JPY", score: 64, volume: "$840M", status: "warning" },
  { id: "3", pair: "GBP/USD", score: 42, volume: "$520M", status: "normal" },
  { id: "4", pair: "USD/CHF", score: 31, volume: "$310M", status: "normal" },
  { id: "5", pair: "AUD/USD", score: 76, volume: "$415M", status: "warning" },
  { id: "6", pair: "USD/CAD", score: 22, volume: "$680M", status: "normal" },
  { id: "7", pair: "NZD/USD", score: 58, volume: "$140M", status: "warning" },
  { id: "8", pair: "USD/MXN", score: 92, volume: "$285M", status: "critical" },
];

const activeHedges: ActiveHedge[] = [
  {
    id: "h1",
    instrument: "EUR/USD Forward (Q2)",
    notional: "$450M",
    maturity: "Jun 28, 2027",
    effectiveness: 94.2,
    status: "locked",
  },
  {
    id: "h2",
    instrument: "SOFR Interest Rate Swap",
    notional: "$1.2B",
    maturity: "Dec 15, 2028",
    effectiveness: 88.5,
    status: "locked",
  },
  {
    id: "h3",
    instrument: "JPY Collar Option",
    notional: "$320M",
    maturity: "Mar 10, 2027",
    effectiveness: 76.1,
    status: "floating",
  },
];

export function RiskView() {
  const [hoveredVector, setHoveredVector] = useState<string | null>(null);
  const [hoveredCell, setHoveredCell] = useState<string | null>(null);

  const kpis = [
    {
      label: "99% Daily VaR",
      value: "$14.2M",
      change: "-2.1%",
      trend: "down" as const,
      icon: TrendingDown,
      description: "Value at Risk",
    },
    {
      label: "Hedging Coverage",
      value: "78.4%",
      change: "+4.2%",
      trend: "up" as const,
      icon: ShieldCheck,
      description: "Of total exposure",
    },
    {
      label: "Max Drawdown",
      value: "-4.8%",
      change: "Stable",
      trend: "neutral" as const,
      icon: Activity,
      description: "Trailing 90 days",
    },
  ];

  const radarCenter = 250;
  const radarRadius = 180;
  const angleStep = (Math.PI * 2) / riskVectors.length;

      const getRadarPoint = useCallback((index: number, value: number, max: number = 100) => {
    const angle = angleStep * index - Math.PI / 2;
    const r = (value / max) * radarRadius;
    return {
      x: radarCenter + r * Math.cos(angle),
      y: radarCenter + r * Math.sin(angle),
    };
  }, [angleStep]);
  const radarPath = useMemo(() => {
    return riskVectors
      .map((v, i) => {
        const p = getRadarPoint(i, v.value);
        return `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`;
      })
      .join(" ") + " Z";
  }, [getRadarPoint]);
  const gridLevels = [0.2, 0.4, 0.6, 0.8, 1.0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-6 w-full"
    >
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-display font-semibold tracking-tight text-ink">
              Systemic Risk & Exposure
            </h2>
            <Badge variant="info" size="sm" icon={<ShieldAlert className="h-3 w-3" />} pulse>
              Live Risk Engine
            </Badge>
          </div>
          <p className="text-sm text-ink-muted">
            Real-time monitoring of market vectors, counterparty exposure, and active hedges.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="glass" size="md" iconLeft={<AlertTriangle className="h-4 w-4" />}>
            Stress Test
          </Button>
          <Button variant="primary" size="md" iconLeft={<Zap className="h-4 w-4" />} magnetic>
            Auto-Rebalance Hedges
          </Button>
        </div>
      </header>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {kpis.map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.1, type: "spring", stiffness: 100, damping: 20 }}
            >
              <Card variant="glass" padding="lg" interactive className="h-full group">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.04] border border-white/[0.06] text-ink-muted group-hover:border-info/30 group-hover:text-info transition-colors">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div
                    className={cn(
                      "flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full",
                      kpi.trend === "up" && "bg-accent/10 text-accent",
                      kpi.trend === "down" && "bg-danger/10 text-danger",
                      kpi.trend === "neutral" && "bg-info/10 text-info"
                    )}
                  >
                    {kpi.change}
                  </div>
                </div>
                <p className="text-xs font-medium text-ink-muted uppercase tracking-wider mb-1">
                  {kpi.label}
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-display font-bold tracking-tight text-ink">
                    {kpi.value}
                  </span>
                  <span className="text-xs text-ink-faint">{kpi.description}</span>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Radar Chart */}
        <Card variant="glass" padding="none" className="lg:col-span-2 overflow-hidden">
          <CardHeader className="p-6 pb-0">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-info" />
                Risk Vector Topology
              </CardTitle>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0 mt-4 relative">
            <div className="relative w-full aspect-[1.6/1] min-h-[400px] flex items-center justify-center">
              {/* Ambient Glow */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-info/5 blur-[100px] rounded-full pointer-events-none" />

              <svg viewBox="0 0 500 500" className="w-full h-full max-w-[600px] overflow-visible">
                <defs>
                  <linearGradient id="radar-fill" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#10B981" stopOpacity="0.1" />
                  </linearGradient>
                  <linearGradient id="radar-stroke" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#38BDF8" />
                    <stop offset="100%" stopColor="#10B981" />
                  </linearGradient>
                  <filter id="radar-glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="6" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Grid Levels */}
                {gridLevels.map((level, i) => {
                  const points = riskVectors
                    .map((_, idx) => {
                      const p = getRadarPoint(idx, level * 100);
                      return `${p.x},${p.y}`;
                    })
                    .join(" ");
                  return (
                    <polygon
                      key={i}
                      points={points}
                      fill="none"
                      stroke="rgba(255,255,255,0.06)"
                      strokeWidth="1"
                      strokeDasharray={i === gridLevels.length - 1 ? "0" : "4 4"}
                    />
                  );
                })}

                {/* Axes */}
                {riskVectors.map((_, i) => {
                  const p = getRadarPoint(i, 100);
                  return (
                    <line
                      key={i}
                      x1={radarCenter}
                      y1={radarCenter}
                      x2={p.x}
                      y2={p.y}
                      stroke="rgba(255,255,255,0.06)"
                      strokeWidth="1"
                    />
                  );
                })}

                {/* Data Polygon */}
                <motion.path
                  d={radarPath}
                  fill="url(#radar-fill)"
                  stroke="url(#radar-stroke)"
                  strokeWidth="3"
                  strokeLinejoin="round"
                  filter="url(#radar-glow)"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                />

                {/* Interactive Points & Labels */}
                {riskVectors.map((v, i) => {
                  const p = getRadarPoint(i, v.value);
                  const labelP = getRadarPoint(i, 115);
                  const isHovered = hoveredVector === v.id;

                  return (
                    <g
                      key={v.id}
                      onMouseEnter={() => setHoveredVector(v.id)}
                      onMouseLeave={() => setHoveredVector(null)}
                      className="cursor-pointer"
                    >
                      {/* Hit area */}
                      <circle cx={p.x} cy={p.y} r="20" fill="transparent" />

                      {/* Point */}
                      <motion.circle
                        cx={p.x}
                        cy={p.y}
                        r={isHovered ? 8 : 5}
                        fill={isHovered ? "#38BDF8" : "#10B981"}
                        stroke="#09090B"
                        strokeWidth="2"
                        animate={{ scale: isHovered ? 1.2 : 1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 15 }}
                        style={{ filter: isHovered ? "drop-shadow(0 0 8px #38BDF8)" : "none" }}
                      />

                      {/* Label */}
                      <text
                        x={labelP.x}
                        y={labelP.y}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className={cn(
                          "text-[11px] font-semibold uppercase tracking-wider transition-all duration-300",
                          isHovered ? "fill-white" : "fill-ink-muted"
                        )}
                      >
                        {v.label}
                      </text>

                      {/* Tooltip */}
                      <AnimatePresence>
                        {isHovered && (
                          <motion.g
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.2 }}
                          >
                            <foreignObject
                              x={p.x - 100}
                              y={p.y - 80}
                              width="200"
                              height="60"
                              className="overflow-visible pointer-events-none"
                            >
                              <div className="glass-card p-3 text-center shadow-glass border border-white/10">
                                <p className="text-xs font-bold text-info">{v.value}% Exposure</p>
                                <p className="text-[10px] text-ink-muted mt-0.5 leading-tight">
                                  {v.description}
                                </p>
                              </div>
                            </foreignObject>
                          </motion.g>
                        )}
                      </AnimatePresence>
                    </g>
                  );
                })}
              </svg>
            </div>
          </CardContent>
        </Card>

        {/* Active Hedges */}
        <Card variant="solid" padding="md" className="lg:col-span-1">
          <CardHeader className="p-0 mb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Lock className="h-4 w-4 text-accent" />
                Active Hedges
              </CardTitle>
              <Badge variant="glass" size="sm">{activeHedges.length} Active</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0 space-y-3">
            <AnimatePresence>
              {activeHedges.map((hedge, i) => (
                <motion.div
                  key={hedge.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.1, type: "spring", stiffness: 100, damping: 20 }}
                  whileHover={{ x: 4, transition: { type: "spring", stiffness: 400, damping: 20 } }}
                  className="group flex flex-col gap-3 p-4 rounded-xl border border-white/[0.04] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.08] transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {hedge.status === "locked" ? (
                        <Lock className="h-3.5 w-3.5 text-accent" />
                      ) : (
                        <Unlock className="h-3.5 w-3.5 text-warning" />
                      )}
                      <p className="text-sm font-semibold text-ink group-hover:text-white transition-colors">
                        {hedge.instrument}
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-ink-faint opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-[11px]">
                    <div>
                      <p className="text-ink-faint mb-0.5">Notional</p>
                      <p className="font-mono font-semibold text-ink">{hedge.notional}</p>
                    </div>
                    <div>
                      <p className="text-ink-faint mb-0.5">Maturity</p>
                      <p className="font-mono font-semibold text-ink">{hedge.maturity}</p>
                    </div>
                    <div>
                      <p className="text-ink-faint mb-0.5">Effectiveness</p>
                      <p className={cn(
                        "font-mono font-semibold",
                        hedge.effectiveness > 85 ? "text-accent" : "text-warning"
                      )}>
                        {hedge.effectiveness}%
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Heatmap */}
      <Card variant="glass" padding="lg">
        <CardHeader className="p-0 mb-6">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-warning" />
              Counterparty & FX Heatmap
            </CardTitle>
            <div className="flex items-center gap-4 text-2xs font-medium text-ink-faint uppercase tracking-wider">
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-danger" />
                <span>Critical</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-warning" />
                <span>Warning</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-accent" />
                <span>Normal</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {heatmapData.map((cell, i) => {
              const isHovered = hoveredCell === cell.id;
              return (
                <motion.div
                  key={cell.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + i * 0.05, type: "spring", stiffness: 100, damping: 20 }}
                  onMouseEnter={() => setHoveredCell(cell.id)}
                  onMouseLeave={() => setHoveredCell(null)}
                  whileHover={{ 
                    y: -4, 
                    scale: 1.02,
                    transition: { type: "spring", stiffness: 400, damping: 20 } 
                  }}
                  className={cn(
                    "relative flex flex-col justify-between p-4 rounded-2xl border transition-all duration-300 cursor-pointer",
                    "bg-white/[0.02] hover:bg-white/[0.04]",
                    cell.status === "critical" && "border-danger/20 hover:border-danger/40",
                    cell.status === "warning" && "border-warning/20 hover:border-warning/40",
                    cell.status === "normal" && "border-white/[0.06] hover:border-white/[0.12]"
                  )}
                >
                  {/* Ambient Glow based on status */}
                  <div
                    className={cn(
                      "absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 pointer-events-none",
                      isHovered && "opacity-100",
                      cell.status === "critical" && "bg-danger/5",
                      cell.status === "warning" && "bg-warning/5",
                      cell.status === "normal" && "bg-accent/5"
                    )}
                  />

                  <div className="relative z-10 flex items-center justify-between mb-4">
                    <span className="text-sm font-display font-bold text-ink">{cell.pair}</span>
                    <div
                      className={cn(
                        "h-2 w-2 rounded-full",
                        cell.status === "critical" && "bg-danger animate-pulse",
                        cell.status === "warning" && "bg-warning",
                        cell.status === "normal" && "bg-accent"
                      )}
                    />
                  </div>

                  <div className="relative z-10 space-y-2">
                    <div className="flex items-baseline justify-between">
                      <span className="text-2xs text-ink-faint uppercase tracking-wider">Risk Score</span>
                      <span
                        className={cn(
                          "text-lg font-display font-bold",
                          cell.status === "critical" && "text-danger",
                          cell.status === "warning" && "text-warning",
                          cell.status === "normal" && "text-ink"
                        )}
                      >
                        {cell.score}
                      </span>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="h-1 w-full rounded-full bg-white/[0.06] overflow-hidden">
                      <motion.div
                        className={cn(
                          "h-full rounded-full",
                          cell.status === "critical" && "bg-danger",
                          cell.status === "warning" && "bg-warning",
                          cell.status === "normal" && "bg-accent"
                        )}
                        initial={{ width: 0 }}
                        animate={{ width: `${cell.score}%` }}
                        transition={{ duration: 1, delay: 0.5 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-mono text-ink-faint">
                      <span>Vol: {cell.volume}</span>
                      <span>{cell.score}%</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}