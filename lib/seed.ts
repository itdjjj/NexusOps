/**
 * NexusOps Canonical Seed Data
 * 
 * Provides high-fidelity, realistic enterprise financial datasets 
 * to drive the tactile UI components, SVG visualizations, and 
 * spring-physics animations across the dashboard.
 */

// ==========================================
// CORE DOMAIN TYPES
// ==========================================

export type TrendDirection = "up" | "down" | "neutral";
export type RiskStatus = "critical" | "warning" | "normal";
export type HedgeStatus = "locked" | "floating";
export type ActivityType = "inflow" | "outflow" | "risk" | "system" | "fx" | "liquidity";
export type NetworkNodeType = "hub" | "region";
export type NetworkFlowDirection = "in" | "out";

export interface KPI {
  label: string;
  value: string;
  change: string;
  trend: TrendDirection;
  description?: string;
}

export interface NetworkNode {
  id: string;
  x: number;
  y: number;
  label: string;
  amount: string;
  type: NetworkNodeType;
  status: "optimal" | "warning" | "flowing";
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

export interface ForecastDataset {
  base: number[];
  upper: number[];
  lower: number[];
}

export interface ForecastInsight {
  id: number;
  type: "warning" | "success" | "info";
  title: string;
  desc: string;
}

export interface ActivityItem {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  amount?: string;
  amountType?: "positive" | "negative" | "neutral";
  timestamp: string;
  node?: string;
}

// ==========================================
// SEED DATA: LIQUIDITY VIEW
// ==========================================

export const SEED_LIQUIDITY_KPIS: KPI[] = [
  {
    label: "Total Global Liquidity",
    value: "$4.28B",
    change: "+2.4%",
    trend: "up",
  },
  {
    label: "Idle Cash Drag",
    value: "$142M",
    change: "-12.1%",
    trend: "down",
  },
  {
    label: "Active Sweeps Today",
    value: "1,842",
    change: "+324",
    trend: "up",
  },
];

export const SEED_NETWORK_NODES: NetworkNode[] = [
  { id: "hub", x: 500, y: 250, label: "Global Treasury Pool", amount: "$4.28B", type: "hub", status: "optimal" },
  { id: "na", x: 180, y: 140, label: "NA - US East", amount: "$1.12B", type: "region", status: "flowing" },
  { id: "eu", x: 620, y: 110, label: "EU - Frankfurt", amount: "$840M", type: "region", status: "flowing" },
  { id: "apac", x: 820, y: 320, label: "APAC - Singapore", amount: "$1.45B", type: "region", status: "flowing" },
  { id: "latam", x: 280, y: 420, label: "LATAM - São Paulo", amount: "$320M", type: "region", status: "warning" },
];

export const SEED_NETWORK_EDGES: NetworkEdge[] = [
  { from: "na", to: "hub", flow: "in", amount: "+$45M" },
  { from: "eu", to: "hub", flow: "in", amount: "+$12M" },
  { from: "apac", to: "hub", flow: "in", amount: "+$128M" },
  { from: "latam", to: "hub", flow: "out", amount: "-$8M" },
];

export const SEED_TOP_ENTITIES: TopEntity[] = [
  { id: 1, name: "Nexus North America", region: "US-East", balance: "1,124,500", currency: "USD", trend: 4.2 },
  { id: 2, name: "Nexus APAC Holdings", region: "SG-Central", balance: "1,450,200", currency: "SGD", trend: 8.7 },
  { id: 3, name: "Nexus Europe GmbH", region: "EU-Frankfurt", balance: "840,100", currency: "EUR", trend: -1.2 },
  { id: 4, name: "Nexus LatAm SA", region: "BR-Sao Paulo", balance: "320,450", currency: "BRL", trend: 2.1 },
];

// ==========================================
// SEED DATA: RISK VIEW
// ==========================================

export const SEED_RISK_KPIS: KPI[] = [
  { label: "99% Daily VaR", value: "$14.2M", change: "-2.1%", trend: "down", description: "Value at Risk" },
  { label: "Hedging Coverage", value: "78.4%", change: "+4.2%", trend: "up", description: "Of total exposure" },
  { label: "Max Drawdown", value: "-4.8%", change: "Stable", trend: "neutral", description: "Trailing 90 days" },
];

export const SEED_RISK_VECTORS: RiskVector[] = [
  { id: "fx", label: "FX Volatility", value: 82, max: 100, description: "High exposure to EUR/USD fluctuations" },
  { id: "ir", label: "Interest Rate", value: 45, max: 100, description: "Moderate SOFR sensitivity in Q3 debt" },
  { id: "credit", label: "Credit Spread", value: 68, max: 100, description: "Widening spreads in high-yield portfolio" },
  { id: "liq", label: "Liquidity", value: 28, max: 100, description: "Ample cash reserves, low immediate risk" },
  { id: "op", label: "Operational", value: 15, max: 100, description: "Minimal counterparty settlement delays" },
];

export const SEED_HEATMAP_DATA: HeatmapCell[] = [
  { id: "1", pair: "EUR/USD", score: 88, volume: "$1.24B", status: "critical" },
  { id: "2", pair: "USD/JPY", score: 64, volume: "$840M", status: "warning" },
  { id: "3", pair: "GBP/USD", score: 42, volume: "$520M", status: "normal" },
  { id: "4", pair: "USD/CHF", score: 31, volume: "$310M", status: "normal" },
  { id: "5", pair: "AUD/USD", score: 76, volume: "$415M", status: "warning" },
  { id: "6", pair: "USD/CAD", score: 22, volume: "$680M", status: "normal" },
  { id: "7", pair: "NZD/USD", score: 58, volume: "$140M", status: "warning" },
  { id: "8", pair: "USD/MXN", score: 92, volume: "$285M", status: "critical" },
];

export const SEED_ACTIVE_HEDGES: ActiveHedge[] = [
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

// ==========================================
// SEED DATA: FORECAST VIEW
// ==========================================

export const SEED_FORECAST_KPIS: KPI[] = [
  { label: "Projected Runway", value: "18.4", change: "+1.2", trend: "up", description: "Months" },
  { label: "Expected Net Burn", value: "-1.24", change: "-0.4", trend: "down", description: "M / mo" },
  { label: "AI Model Confidence", value: "94.2", change: "High", trend: "neutral", description: "%" },
];

export const SEED_FORECAST_DATASETS: Record<"bear" | "base" | "bull", ForecastDataset> = {
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

export const SEED_FORECAST_INSIGHTS: ForecastInsight[] = [
  {
    id: 1,
    type: "warning",
    title: "OpEx Anomaly Detected",
    desc: "Cloud infrastructure spend projected to exceed budget by 14% in Q3.",
  },
  {
    id: 2,
    type: "success",
    title: "Revenue Acceleration",
    desc: "Enterprise tier upgrades trending 22% above baseline forecast.",
  },
];

export const SEED_FORECAST_TIMELINE = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

// ==========================================
// SEED DATA: ACTIVITY FEED
// ==========================================

export const SEED_ACTIVITY_FEED: ActivityItem[] = [
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
  {
    id: "act-006",
    type: "inflow",
    title: "Enterprise Settlement Received",
    description: "Acme Corp Q3 licensing fee cleared via SWIFT.",
    amount: "+$12.5M",
    amountType: "positive",
    timestamp: "3h ago",
    node: "US-WEST",
  },
];