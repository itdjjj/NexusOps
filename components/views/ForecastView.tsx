"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  BrainCircuit,
  AlertTriangle,
  DollarSign,
  Calendar,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Zap,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

type Scenario = "bear" | "base" | "bull";

const timeline = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const datasets: Record<Scenario, { base: number[]; upper: number[]; lower: number[] }> = {
  bear: {
    base: [120, 122, 118, 115, 110, 105, 100, 95, 90, 85, 80, 75],
    upper: [120, 128, 125, 122, 118, 115, 110, 108, 105, 100, 95, 90],
    lower: [120, 115, 110, 105, 98, 92, 85, 78, 70, 65, 60, 55],
  },
  base: {
    base: [120, 132, 128, 145, 158, 150, 172, 195, 188, 215, 242, 285],
    upper: [120, 140, 138, 160, 178, 172, 198, 228, 222, 258, 295, 345],
    lower: [120, 125, 118, 132, 140, 130, 148, 165, 155, 178, 195, 230],
  },
  bull: {
    base: [120, 145, 160, 185, 210, 235, 265, 300, 340, 385, 435, 490],
    upper: [120, 155, 175, 205, 235, 265, 300, 345, 395, 450, 510, 580],
    lower: [120, 135, 145, 165, 185, 205, 230, 255, 285, 320, 360, 400],
  },
};

const scenarios: { id: Scenario; label: string; icon: React.ElementType; color: string }[] = [
  { id: "bear", label: "Bear", icon: ArrowDownRight, color: "text-danger" },
  { id: "base", label: "Base", icon: Minus, color: "text-ink" },
  { id: "bull", label: "Bull", icon: ArrowUpRight, color: "text-accent" },
];

const insights = [
  {
    id: 1,
    type: "warning" as const,
    title: "OpEx Anomaly Detected",
    desc: "Cloud infrastructure spend projected to exceed budget by 14% in Q3.",
    icon: AlertTriangle,
  },
  {
    id: 2,
    type: "success" as const,
    title: "Revenue Acceleration",
    desc: "Enterprise tier upgrades trending 22% above baseline forecast.",
    icon: TrendingUp,
  },
];

const kpis = [
  {
    label: "Projected Runway",
    value: "18.4",
    unit: "Months",
    trend: "+1.2",
    trendDir: "up" as const,
    icon: Calendar,
  },
  {
    label: "Expected Net Burn",
    value: "-1.24",
    unit: "M / mo",
    trend: "-0.4",
    trendDir: "down" as const,
    icon: DollarSign,
  },
  {
    label: "AI Model Confidence",
    value: "94.2",
    unit: "%",
    trend: "High",
    trendDir: "neutral" as const,
    icon: BrainCircuit,
  },
];

const width = 1000;
const height = 400;
const paddingX = 40;
const paddingY = 50;

export function ForecastView() {
  const [scenario, setScenario] = useState<Scenario>("base");
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const chartData = useMemo(() => {
    const data = datasets[scenario];
    const maxVal = Math.max(...data.upper);
    const minVal = Math.min(...data.lower);
    const range = maxVal - minVal || 1;

    const getX = (i: number) => paddingX + (i / (data.base.length - 1)) * (width - paddingX * 2);
    const getY = (val: number) => height - paddingY - ((val - minVal) / range) * (height - paddingY * 2);

    const smoothPath = (points: { x: number; y: number }[]) => {
      if (points.length < 2) return "";
      let path = `M ${points[0].x},${points[0].y}`;
      for (let i = 0; i < points.length - 1; i++) {
        const p1 = points[i];
        const p2 = points[i + 1];
        const cpx = (p1.x + p2.x) / 2;
        path += ` C ${cpx},${p1.y} ${cpx},${p2.y} ${p2.x},${p2.y}`;
      }
      return path;
    };

    const basePoints = data.base.map((v, i) => ({ x: getX(i), y: getY(v) }));
    const upperPoints = data.upper.map((v, i) => ({ x: getX(i), y: getY(v) }));
    const lowerPoints = data.lower.map((v, i) => ({ x: getX(i), y: getY(v) }));

    const baseD = smoothPath(basePoints);
    
    let areaD = `M ${upperPoints[0].x},${upperPoints[0].y}`;
    for (let i = 0; i < upperPoints.length - 1; i++) {
      const p1 = upperPoints[i];
      const p2 = upperPoints[i + 1];
      const cpx = (p1.x + p2.x) / 2;
      areaD += ` C ${cpx},${p1.y} ${cpx},${p2.y} ${p2.x},${p2.y}`;
    }
    areaD += ` L ${lowerPoints[lowerPoints.length - 1].x},${lowerPoints[lowerPoints.length - 1].y}`;
    for (let i = lowerPoints.length - 1; i > 0; i--) {
      const p1 = lowerPoints[i];
      const p2 = lowerPoints[i - 1];
      const cpx = (p1.x + p2.x) / 2;
      areaD += ` C ${cpx},${p1.y} ${cpx},${p2.y} ${p2.x},${p2.y}`;
    }
    areaD += " Z";

    return { basePoints, baseD, areaD, maxVal, minVal };
  }, [scenario]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const mouseX = ((e.clientX - rect.left) / rect.width) * width;

      let closestIdx = 0;
      let minDist = Infinity;
      chartData.basePoints.forEach((p, i) => {
        const dist = Math.abs(p.x - mouseX);
        if (dist < minDist) {
          minDist = dist;
          closestIdx = i;
        }
      });

      if (minDist < 60) {
        setHoveredIdx(closestIdx);
      } else {
        setHoveredIdx(null);
      }
    },
    [chartData.basePoints]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-6 w-full"
    >
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-display font-semibold tracking-tight text-ink">
              Predictive Forecast
            </h2>
            <Badge variant="accent" size="sm" icon={<Sparkles className="h-3 w-3" />} pulse>
              AI Monte Carlo
            </Badge>
          </div>
          <p className="text-sm text-ink-muted">
            10,000 simulations processed. Next 12-month cash flow trajectory.
          </p>
        </div>

        <div className="flex items-center gap-2 p-1 rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl shadow-micro">
          {scenarios.map((s) => {
            const Icon = s.icon;
            const isActive = scenario === s.id;
            return (
              <motion.button
                key={s.id}
                onClick={() => setScenario(s.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors",
                  isActive ? "text-ink" : "text-ink-muted hover:text-ink"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="scenario-bg"
                    className="absolute inset-0 bg-surface-raised border border-white/[0.08] rounded-xl shadow-micro"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <Icon className={cn("h-4 w-4 relative z-10", isActive ? s.color : "text-ink-faint")} />
                <span className="relative z-10">{s.label}</span>
              </motion.button>
            );
          })}
        </div>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Card */}
        <Card variant="glass" padding="none" className="lg:col-span-2 overflow-hidden">
          <CardHeader className="p-6 pb-0">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-accent" />
                Cash Flow Projection
              </CardTitle>
              <div className="flex items-center gap-4 text-2xs font-medium text-ink-faint uppercase tracking-wider">
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-accent" />
                  <span>Median</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-info/60" />
                  <span>90% Confidence</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0 mt-2">
            <div className="relative w-full aspect-[2.5/1] min-h-[300px]">
              <svg
                viewBox={`0 0 ${width} ${height}`}
                className="w-full h-full overflow-visible cursor-crosshair"
                onMouseMove={handleMouseMove}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                <defs>
                  <linearGradient id="line-gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#34D399" />
                    <stop offset="100%" stopColor="#10B981" />
                  </linearGradient>
                  <linearGradient id="area-gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="confidence-gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.12" />
                    <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.02" />
                  </linearGradient>
                </defs>

                {/* Grid Lines */}
                {[0, 1, 2, 3, 4].map((i) => {
                  const y = paddingY + (i * (height - paddingY * 2)) / 4;
                  return (
                    <line
                      key={i}
                      x1={paddingX}
                      y1={y}
                      x2={width - paddingX}
                      y2={y}
                      stroke="rgba(255,255,255,0.04)"
                      strokeWidth="1"
                      strokeDasharray="4 4"
                    />
                  );
                })}

                <AnimatePresence mode="wait">
                  <motion.g
                    key={scenario}
                    initial={{ opacity: 0, filter: "blur(12px)" }}
                    animate={{ opacity: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, filter: "blur(12px)" }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {/* Confidence Area */}
                    <motion.path
                      d={chartData.areaD}
                      fill="url(#confidence-gradient)"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3, duration: 0.8 }}
                    />

                    {/* Main Area */}
                    <motion.path
                      d={chartData.baseD}
                      fill="url(#area-gradient)"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2, duration: 0.8 }}
                    />

                    {/* Main Line */}
                    <motion.path
                      d={chartData.baseD}
                      fill="none"
                      stroke="url(#line-gradient)"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                      style={{ filter: "drop-shadow(0 4px 12px rgba(16,185,129,0.4))" }}
                    />
                  </motion.g>
                </AnimatePresence>

                {/* Hover Interactions */}
                {hoveredIdx !== null && chartData.basePoints[hoveredIdx] && (
                  <motion.g
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <line
                      x1={chartData.basePoints[hoveredIdx].x}
                      y1={paddingY}
                      x2={chartData.basePoints[hoveredIdx].x}
                      y2={height - paddingY}
                      stroke="rgba(255,255,255,0.15)"
                      strokeWidth="1.5"
                      strokeDasharray="6 6"
                    />
                    <motion.circle
                      cx={chartData.basePoints[hoveredIdx].x}
                      cy={chartData.basePoints[hoveredIdx].y}
                      r="7"
                      fill="#10B981"
                      stroke="#09090B"
                      strokeWidth="3"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 15 }}
                      style={{ filter: "drop-shadow(0 0 12px rgba(16,185,129,0.8))" }}
                    />
                    
                    {/* Tooltip */}
                    <foreignObject
                      x={Math.max(100, Math.min(width - 100, chartData.basePoints[hoveredIdx].x)) - 90}
                      y={Math.max(120, chartData.basePoints[hoveredIdx].y - 120)}
                      width="180"
                      height="100"
                      className="overflow-visible pointer-events-none"
                    >
                      <div className="glass-card p-3 text-center shadow-glass border border-white/10">
                        <p className="text-2xs text-ink-faint uppercase tracking-widest mb-1">
                          {timeline[hoveredIdx]}
                        </p>
                        <p className="text-xl font-display font-bold text-accent">
                          ${datasets[scenario].base[hoveredIdx]}M
                        </p>
                        <div className="flex justify-between text-[10px] text-ink-muted mt-2 font-mono">
                          <span>H: ${datasets[scenario].upper[hoveredIdx]}M</span>
                          <span>L: ${datasets[scenario].lower[hoveredIdx]}M</span>
                        </div>
                      </div>
                    </foreignObject>
                  </motion.g>
                )}

                {/* X Axis Labels */}
                {timeline.map((label, i) => {
                  const x = paddingX + (i / (timeline.length - 1)) * (width - paddingX * 2);
                  return (
                    <text
                      key={label}
                      x={x}
                      y={height - 15}
                      textAnchor="middle"
                      className="fill-ink-faint text-[11px] font-medium font-mono uppercase tracking-wider"
                    >
                      {label}
                    </text>
                  );
                })}
              </svg>
            </div>
          </CardContent>
        </Card>

        {/* Right Column: Insights */}
        <div className="space-y-6">
          <Card variant="solid" padding="md" className="relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-accent/10 blur-3xl rounded-full pointer-events-none" />
            <CardHeader className="p-0 mb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <BrainCircuit className="h-4 w-4 text-info" />
                  AI Insights
                </CardTitle>
                <Badge variant="glass" size="sm">Live</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0 space-y-3">
              {insights.map((insight, i) => {
                const Icon = insight.icon;
                return (
                  <motion.div
                    key={insight.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.1, type: "spring", stiffness: 100, damping: 20 }}
                    whileHover={{ x: 4, transition: { type: "spring", stiffness: 400, damping: 20 } }}
                    className="group flex items-start gap-3 p-3 rounded-xl border border-white/[0.04] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.08] transition-colors cursor-pointer"
                  >
                    <div
                      className={cn(
                        "shrink-0 flex h-8 w-8 items-center justify-center rounded-lg border",
                        insight.type === "warning"
                          ? "bg-warning/10 border-warning/20 text-warning"
                          : "bg-accent/10 border-accent/20 text-accent"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-ink truncate group-hover:text-white transition-colors">
                        {insight.title}
                      </p>
                      <p className="text-xs text-ink-muted mt-0.5 line-clamp-2 leading-relaxed">
                        {insight.desc}
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-ink-faint shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.div>
                );
              })}
            </CardContent>
          </Card>

          <Card variant="elevated" padding="md" className="relative">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-ink-muted uppercase tracking-wider">Model Version</p>
              <Badge variant="accent" size="sm" icon={<Zap className="h-3 w-3" />}>
                v3.1.2
              </Badge>
            </div>
            <p className="text-xs text-ink-faint leading-relaxed">
              Last trained on <span className="text-ink font-medium">Oct 24, 2026</span> using 4.2M anonymized ledger transactions across 14 global subsidiaries.
            </p>
          </Card>
        </div>
      </div>

      {/* Bottom KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {kpis.map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.1, type: "spring", stiffness: 100, damping: 20 }}
            >
              <Card variant="glass" padding="lg" interactive className="h-full">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.04] border border-white/[0.06] text-ink-muted">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div
                    className={cn(
                      "flex items-center gap-1 text-xs font-semibold",
                      kpi.trendDir === "up" && "text-accent",
                      kpi.trendDir === "down" && "text-danger",
                      kpi.trendDir === "neutral" && "text-info"
                    )}
                  >
                    {kpi.trendDir === "up" && <ArrowUpRight className="h-3.5 w-3.5" />}
                    {kpi.trendDir === "down" && <ArrowDownRight className="h-3.5 w-3.5" />}
                    {kpi.trend}
                  </div>
                </div>
                <p className="text-xs font-medium text-ink-muted uppercase tracking-wider mb-1">
                  {kpi.label}
                </p>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-display font-bold tracking-tight text-ink">
                    {kpi.value}
                  </span>
                  <span className="text-sm font-medium text-ink-faint">{kpi.unit}</span>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}