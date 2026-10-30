"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe,
  ArrowRightLeft,
  Zap,
  Building2,
  TrendingUp,
  TrendingDown,
  MoreHorizontal,
  Activity,
  Banknote,
  Coins,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface NetworkNode {
  id: string;
  x: number;
  y: number;
  label: string;
  amount: string;
  type: "hub" | "region";
  status: "optimal" | "warning" | "flowing";
}

interface NetworkEdge {
  from: string;
  to: string;
  flow: "in" | "out";
  amount: string;
}

const networkNodes: NetworkNode[] = [
  { id: "hub", x: 500, y: 250, label: "Global Treasury Pool", amount: "$4.28B", type: "hub", status: "optimal" },
  { id: "na", x: 180, y: 140, label: "NA - US East", amount: "$1.12B", type: "region", status: "flowing" },
  { id: "eu", x: 620, y: 110, label: "EU - Frankfurt", amount: "$840M", type: "region", status: "flowing" },
  { id: "apac", x: 820, y: 320, label: "APAC - Singapore", amount: "$1.45B", type: "region", status: "flowing" },
  { id: "latam", x: 280, y: 420, label: "LATAM - São Paulo", amount: "$320M", type: "region", status: "warning" },
];

const networkEdges: NetworkEdge[] = [
  { from: "na", to: "hub", flow: "in", amount: "+$45M" },
  { from: "eu", to: "hub", flow: "in", amount: "+$12M" },
  { from: "apac", to: "hub", flow: "in", amount: "+$128M" },
  { from: "latam", to: "hub", flow: "out", amount: "-$8M" },
];

const topEntities = [
  { id: 1, name: "Nexus North America", region: "US-East", balance: "1,124,500", currency: "USD", trend: 4.2 },
  { id: 2, name: "Nexus APAC Holdings", region: "SG-Central", balance: "1,450,200", currency: "SGD", trend: 8.7 },
  { id: 3, name: "Nexus Europe GmbH", region: "EU-Frankfurt", balance: "840,100", currency: "EUR", trend: -1.2 },
  { id: 4, name: "Nexus LatAm SA", region: "BR-Sao Paulo", balance: "320,450", currency: "BRL", trend: 2.1 },
];

function getBezierPath(x1: number, y1: number, x2: number, y2: number) {
  const midX = (x1 + x2) / 2;
  return `M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`;
}

export function LiquidityView() {
  const [activeNode, setActiveNode] = useState<string | null>(null);

  const kpis = [
    {
      label: "Total Global Liquidity",
      value: "$4.28B",
      change: "+2.4%",
      trend: "up" as const,
      icon: Banknote,
    },
    {
      label: "Idle Cash Drag",
      value: "$142M",
      change: "-12.1%",
      trend: "down" as const,
      icon: Coins,
    },
    {
      label: "Active Sweeps Today",
      value: "1,842",
      change: "+324",
      trend: "up" as const,
      icon: Activity,
    },
  ];

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
              Global Liquidity
            </h2>
            <Badge variant="accent" size="sm" icon={<Globe className="h-3 w-3" />} pulse>
              Synced 2s ago
            </Badge>
          </div>
          <p className="text-sm text-ink-muted">
            Real-time cross-border cash positions and autonomous routing networks.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="glass" size="md" iconLeft={<ArrowRightLeft className="h-4 w-4" />}>
            Manual Transfer
          </Button>
          <Button variant="primary" size="md" iconLeft={<Zap className="h-4 w-4" />} magnetic>
            Execute Global Sweep
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
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.04] border border-white/[0.06] text-ink-muted group-hover:border-accent/30 group-hover:text-accent transition-colors">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div
                    className={cn(
                      "flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full",
                      kpi.trend === "up" && "bg-accent/10 text-accent",
                      kpi.trend === "down" && "bg-danger/10 text-danger"
                    )}
                  >
                    {kpi.trend === "up" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {kpi.change}
                  </div>
                </div>
                <p className="text-xs font-medium text-ink-muted uppercase tracking-wider mb-1">
                  {kpi.label}
                </p>
                <span className="text-3xl font-display font-bold tracking-tight text-ink">
                  {kpi.value}
                </span>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Network Map */}
        <Card variant="glass" padding="none" className="lg:col-span-2 overflow-hidden">
          <CardHeader className="p-6 pb-0">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-accent" />
                Liquidity Network Topology
              </CardTitle>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0 mt-4 relative">
            <div className="relative w-full aspect-[2/1] min-h-[400px] bg-obsidian/40 overflow-hidden">
              {/* Grid Pattern */}
              <div className="absolute inset-0 bg-lux-grid bg-grid opacity-30 [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_20%,transparent_100%)]" />
              
              {/* Ambient Center Glow */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/5 blur-[120px] rounded-full pointer-events-none" />

              <svg
                viewBox="0 0 1000 500"
                className="w-full h-full overflow-visible"
              >
                <defs>
                  <linearGradient id="flow-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#10B981" stopOpacity="0" />
                    <stop offset="50%" stopColor="#10B981" stopOpacity="1" />
                    <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
                  </linearGradient>
                  <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Edges / Flows */}
                {networkEdges.map((edge, i) => {
                  const fromNode = networkNodes.find((n) => n.id === edge.from)!;
                  const toNode = networkNodes.find((n) => n.id === edge.to)!;
                  const path = getBezierPath(fromNode.x, fromNode.y, toNode.x, toNode.y);

                  return (
                    <g key={i}>
                      {/* Base Line */}
                      <path
                        d={path}
                        fill="none"
                        stroke="rgba(255,255,255,0.06)"
                        strokeWidth="2"
                      />
                      {/* Animated Flow Line */}
                      <motion.path
                        d={path}
                        fill="none"
                        stroke={edge.flow === "in" ? "#10B981" : "#F43F5E"}
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeDasharray="10 15"
                        animate={{ strokeDashoffset: [50, 0] }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "linear",
                          delay: i * 0.2,
                        }}
                        filter="url(#glow)"
                      />
                    </g>
                  );
                })}

                {/* Nodes */}
                {networkNodes.map((node) => {
                  const isActive = activeNode === node.id;
                  const isHub = node.type === "hub";
                  const radius = isHub ? 45 : 28;

                  return (
                    <motion.g
                      key={node.id}
                      onMouseEnter={() => setActiveNode(node.id)}
                      onMouseLeave={() => setActiveNode(null)}
                      className="cursor-pointer"
                    >
                      {/* Pulse Rings for Regions */}
                      {!isHub && node.status === "flowing" && (
                        <>
                          <circle
                            cx={node.x}
                            cy={node.y}
                            r={radius}
                            fill="none"
                            stroke="rgba(16, 185, 129, 0.4)"
                            strokeWidth="1"
                          >
                            <animate
                              attributeName="r"
                              from={radius.toString()}
                              to={(radius + 20).toString()}
                              dur="2s"
                              repeatCount="indefinite"
                            />
                            <animate
                              attributeName="opacity"
                              from="0.8"
                              to="0"
                              dur="2s"
                              repeatCount="indefinite"
                            />
                          </circle>
                        </>
                      )}

                      {/* Node Background */}
                      <motion.circle
                        cx={node.x}
                        cy={node.y}
                        r={radius}
                        className={cn(
                          isHub 
                            ? "fill-accent/10 stroke-accent" 
                            : node.status === "warning"
                            ? "fill-warning/10 stroke-warning"
                            : "fill-surface-raised stroke-white/10",
                          "transition-all duration-300"
                        )}
                        strokeWidth={isActive ? 3 : 2}
                        animate={{
                          scale: isActive ? 1.1 : 1,
                        }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      />

                      {/* Hub Inner Icon */}
                      {isHub && (
                        <g transform={`translate(${node.x - 16}, ${node.y - 16})`}>
                          <motion.g
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                          >
                            <path
                              d="M16 2v4M16 26v4M2 16h4M26 16h4M6.1 6.1l2.8 2.8M23.2 23.2l2.8 2.8M6.1 25.9l2.8-2.8M23.2 8.8l2.8-2.8"
                              stroke="#10B981"
                              strokeWidth="2"
                              strokeLinecap="round"
                            />
                          </motion.g>
                          <circle cx="16" cy="16" r="8" fill="#10B981" />
                        </g>
                      )}

                      {/* Region Building Icon */}
                      {!isHub && (
                        <g transform={`translate(${node.x - 10}, ${node.y - 10})`}>
                          <Building2
                            className={cn(
                              "w-5 h-5",
                              node.status === "warning" ? "text-warning" : "text-ink-muted"
                            )}
                          />
                        </g>
                      )}

                      {/* Label & Amount (Always visible for Hub, on hover for others) */}
                      <motion.g
                        initial={isHub ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                        animate={isHub || isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      >
                        <rect
                          x={node.x - 60}
                          y={node.y + radius + 12}
                          width="120"
                          height="46"
                          rx="8"
                          className="fill-surface-overlay/90 stroke-white/10"
                          strokeWidth="1"
                        />
                        <text
                          x={node.x}
                          y={node.y + radius + 30}
                          textAnchor="middle"
                          className="fill-ink-muted text-[10px] font-medium uppercase tracking-wider"
                        >
                          {node.label}
                        </text>
                        <text
                          x={node.x}
                          y={node.y + radius + 48}
                          textAnchor="middle"
                          className={cn(
                            "text-[14px] font-display font-bold",
                            node.status === "warning" ? "fill-warning" : "fill-ink"
                          )}
                        >
                          {node.amount}
                        </text>
                      </motion.g>
                    </motion.g>
                  );
                })}
              </svg>
            </div>
          </CardContent>
        </Card>

        {/* Top Entities List */}
        <Card variant="solid" padding="md" className="lg:col-span-1">
          <CardHeader className="p-0 mb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Building2 className="h-4 w-4 text-info" />
                Top Entities
              </CardTitle>
              <Badge variant="glass" size="sm">4 Active</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0 space-y-3">
            <AnimatePresence>
              {topEntities.map((entity, i) => (
                <motion.div
                  key={entity.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.1, type: "spring", stiffness: 100, damping: 20 }}
                  whileHover={{ x: 4, transition: { type: "spring", stiffness: 400, damping: 20 } }}
                  className="group flex items-center justify-between p-3 rounded-xl border border-white/[0.04] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.08] transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.04] border border-white/[0.06] text-ink-muted group-hover:border-accent/30 group-hover:text-accent transition-colors">
                      <Building2 className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-ink group-hover:text-white transition-colors">
                        {entity.name}
                      </p>
                      <p className="text-[11px] text-ink-faint font-mono tracking-wider">
                        {entity.region}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-display font-bold text-ink">
                      ${entity.balance}
                    </p>
                    <div className={cn(
                      "flex items-center justify-end gap-1 text-[10px] font-semibold",
                      entity.trend > 0 ? "text-accent" : "text-danger"
                    )}>
                      {entity.trend > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                      {Math.abs(entity.trend)}%
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}