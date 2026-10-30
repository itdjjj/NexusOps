import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { LazyMotion, domAnimation } from "framer-motion";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import "./global.css";

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  axes: ["opsz"],
});

const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "NexusOps | Enterprise AI Financial Operations",
  description:
    "Premium B2B SaaS dashboard for high-frequency financial operations, liquidity forecasting, and algorithmic risk management.",
  keywords: [
    "NexusOps",
    "AI Financial Ops",
    "Enterprise SaaS",
    "Liquidity Dashboard",
    "Risk Management",
  ],
  authors: [{ name: "NexusOps Engineering" }],
  openGraph: {
    type: "website",
    title: "NexusOps | Enterprise AI Financial Operations",
    description:
      "Command your liquidity. Premium AI-driven financial operations for modern enterprises.",
    siteName: "NexusOps",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${fontSans.variable} ${fontMono.variable} font-sans min-h-screen overflow-x-hidden bg-obsidian text-ink antialiased`}
      >
        <LazyMotion features={domAnimation} strict>
          <TooltipProvider delayDuration={300} skipDelayDuration={100}>
            {/* Global Background Layers */}
            <div className="fixed inset-0 -z-30 bg-aurora" />
            <div className="fixed inset-0 -z-20 bg-lux-grid bg-grid opacity-[0.35] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_40%,transparent_100%)]" />
            <div className="fixed inset-0 -z-10 bg-radial-fade" />

            {/* Premium SVG Noise Texture */}
            <svg
              className="fixed inset-0 -z-10 h-full w-full opacity-[0.015] mix-blend-overlay pointer-events-none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <filter id="noiseFilter">
                <feTurbulence
                  type="fractalNoise"
                  baseFrequency="0.85"
                  numOctaves="3"
                  stitchTiles="stitch"
                />
              </filter>
              <rect width="100%" height="100%" filter="url(#noiseFilter)" />
            </svg>

            <main className="relative z-0 flex min-h-screen flex-col">
              {children}
            </main>
          </TooltipProvider>
        </LazyMotion>
      </body>
    </html>
  );
}