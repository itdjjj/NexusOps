import type { ElementType } from "react";

// ==========================================
// CORE DASHBOARD ENUMS & UNIONS
// ==========================================

export type DashboardView = "liquidity" | "risk" | "forecast";
export type TimeRange = "24h" | "7d" | "30d" | "90d" | "1y" | "ytd";
export type EntityScope = "global" | "na" | "eu" | "apac" | "latam";
export type TrendDirection = "up" | "down" | "neutral";
export type ScenarioType = "bear" | "base" | "bull";

// ==========================================
// NAVIGATION & COMMAND PALETTE
// ==========================================

export interface NavItem {
  id: string;
  label: string;
  icon: ElementType;
  href?: string;
  badge?: string;
}

export interface TabItem {
  id: DashboardView;
  label: string;
  icon: ElementType;
  description: string;
}

export type CommandGroup = "navigation" | "actions" | "ai";

export interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon: ElementType;
  shortcut?: string[];
  action: () => void;
  group: CommandGroup;
}

// ==========================================
// SHARED KPI & METRICS
// ==========================================

export interface KPI {
  label: string;
  value: string;
  change: string;
  trend: TrendDirection;
  description?: string;
  unit?: string;
}

// ==========================================
// LIQUIDITY DOMAIN
// ==========================================

export type NetworkNodeType = "hub" | "region";
export type NetworkNodeStatus = "optimal" | "warning" | "flowing";
export type NetworkFlowDirection = "in" | "out";

export interface NetworkNode {
  id: string;
  x: number;
  y: number;
  label: string;
  amount: string;
  type: NetworkNodeType;
  status: NetworkNodeStatus;
}

export interface NetworkEdge {
  from: string;
  to: string;
  flow: NetworkFlowDirection;
  amount: string;
}

export interface TopEntity {
  id: number;
  name: string;
  region: string;
  balance: string;
  currency: string;
  trend: number;
}

// ==========================================
// RISK DOMAIN
// ==========================================

export type RiskStatus = "critical" | "warning" | "normal";
export type HedgeStatus = "locked" | "floating";

export interface RiskVector {
  id: string;
  label: string;
  value: number;
  max: number;
  description: string;
}

export interface HeatmapCell {
  id: string;
  pair: string;
  score: number;
  volume: string;
  status: RiskStatus;
}

export interface ActiveHedge {
  id: string;
  instrument: string;
  notional: string;
  maturity: string;
  effectiveness: number;
  status: HedgeStatus;
}

// ==========================================
// FORECAST DOMAIN
// ==========================================

export interface ForecastDataset {
  base: number[];
  upper: number[];
  lower: number[];
}

export type InsightType = "warning" | "success" | "info";

export interface ForecastInsight {
  id: number;
  type: InsightType;
  title: string;
  desc: string;
  icon?: ElementType;
}

// ==========================================
// ACTIVITY FEED DOMAIN
// ==========================================

export type ActivityType = "inflow" | "outflow" | "risk" | "system" | "fx" | "liquidity";
export type AmountType = "positive" | "negative" | "neutral";

export interface ActivityItem {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  amount?: string;
  amountType?: AmountType;
  timestamp: string;
  node?: string;
}

// ==========================================
// TACTILE UI & ANIMATION CONFIGS
// ==========================================

export interface SpringConfig {
  type: "spring";
  stiffness: number;
  damping: number;
  mass?: number;
}

export interface TactilePhysics {
  snappy: SpringConfig;
  smooth: SpringConfig;
  heavy: SpringConfig;
  layoutShift: SpringConfig;
}