// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1440px",
      },
    },
    extend: {
      colors: {
        obsidian: {
          DEFAULT: "#09090B",
          950: "#050506",
          900: "#09090B",
          800: "#101014",
          700: "#17171C",
          600: "#1F1F26",
        },
        surface: {
          DEFAULT: "#0D0D11",
          raised: "#121218",
          overlay: "#17171F",
          muted: "#1D1D27",
        },
        line: {
          DEFAULT: "#232329",
          subtle: "#1B1B21",
          strong: "#33333D",
        },
        ink: {
          DEFAULT: "#F4F4F5",
          muted: "#A1A1AA",
          faint: "#71717A",
          disabled: "#52525B",
        },
        accent: {
          DEFAULT: "#10B981",
          soft: "#34D399",
          dim: "#059669",
          glow: "rgba(16, 185, 129, 0.16)",
          ring: "rgba(16, 185, 129, 0.42)",
        },
        danger: {
          DEFAULT: "#F43F5E",
          soft: "rgba(244, 63, 94, 0.14)",
        },
        warning: {
          DEFAULT: "#F59E0B",
          soft: "rgba(245, 158, 11, 0.14)",
        },
        info: {
          DEFAULT: "#38BDF8",
          soft: "rgba(56, 189, 248, 0.14)",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
      },
      fontSize: {
        "2xs": ["0.6875rem", { lineHeight: "0.875rem" }],
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1.125rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      boxShadow: {
        micro:
          "inset 0 1px 0 rgba(255,255,255,0.035), 0 1px 2px rgba(0,0,0,0.55)",
        glass:
          "0 18px 50px rgba(0,0,0,0.42), inset 0 1px 0 rgba(255,255,255,0.05)",
        "glass-hover":
          "0 24px 70px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.07)",
        glow:
          "0 0 0 1px rgba(16,185,129,0.22), 0 0 28px rgba(16,185,129,0.16)",
        "focus-ring": "0 0 0 2px rgba(16,185,129,0.35)",
      },
      transitionTimingFunction: {
        "spring-soft": "cubic-bezier(0.22, 1, 0.36, 1)",
        spring: "cubic-bezier(0.175, 0.885, 0.32, 1.1)",
        "spring-lux": "cubic-bezier(0.34, 1.56, 0.64, 1)",
        lux: "cubic-bezier(0.4, 0, 0.2, 1)",
        exit: "cubic-bezier(0.55, 0, 1, 0.45)",
      },
      transitionDuration: {
        fast: "160ms",
        base: "260ms",
        slow: "480ms",
        slower: "720ms",
      },
      keyframes: {
        "fade-up": {
          from: {
            opacity: "0",
            transform: "translateY(18px) scale(0.985)",
          },
          to: {
            opacity: "1",
            transform: "translateY(0) scale(1)",
          },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "scale-in": {
          from: {
            opacity: "0",
            transform: "scale(0.97)",
          },
          to: {
            opacity: "1",
            transform: "scale(1)",
          },
        },
        "slide-in-right": {
          from: {
            opacity: "0",
            transform: "translateX(24px)",
          },
          to: {
            opacity: "1",
            transform: "translateX(0)",
          },
        },
        shimmer: {
          from: { transform: "translateX(-100%)" },
          to: { transform: "translateX(100%)" },
        },
        "glow-pulse": {
          "0%, 100%": {
            boxShadow:
              "0 0 0 1px rgba(16,185,129,0.16), 0 0 22px rgba(16,185,129,0.12)",
          },
          "50%": {
            boxShadow:
              "0 0 0 1px rgba(16,185,129,0.32), 0 0 34px rgba(16,185,129,0.22)",
          },
        },
      },
      animation: {
        "fade-up": "fade-up 720ms cubic-bezier(0.22,1,0.36,1) both",
        "fade-in": "fade-in 480ms cubic-bezier(0.4,0,0.2,1) both",
        "scale-in":
          "scale-in 560ms cubic-bezier(0.175,0.885,0.32,1.1) both",
        "slide-in-right":
          "slide-in-right 620ms cubic-bezier(0.22,1,0.36,1) both",
        shimmer: "shimmer 1600ms linear infinite",
        "glow-pulse": "glow-pulse 2800ms ease-in-out infinite",
      },
      backgroundImage: {
        "lux-grid":
          "linear-gradient(to right, rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.035) 1px, transparent 1px)",
        "radial-fade":
          "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(16,185,129,0.13), transparent)",
        aurora:
          "radial-gradient(60rem 30rem at 15% 0%, rgba(16,185,129,0.08), transparent), radial-gradient(45rem 28rem at 85% 20%, rgba(56,189,248,0.05), transparent)",
      },
      backgroundSize: {
        grid: "42px 42px",
      },
    },
  },
  plugins: [],
};

export default config;