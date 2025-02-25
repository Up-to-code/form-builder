import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "white",
        foreground: "#111827", // gray-900
        card: {
          DEFAULT: "white",
          foreground: "#111827"
        },
        popover: {
          DEFAULT: "white",
          foreground: "#111827"
        },
        primary: {
          DEFAULT: "#2563eb", // blue-600
          foreground: "white"
        },
        secondary: {
          DEFAULT: "#f3f4f6", // gray-100
          foreground: "#111827"
        },
        muted: {
          DEFAULT: "#f3f4f6", // gray-100
          foreground: "#6b7280" // gray-500
        },
        accent: {
          DEFAULT: "#f3f4f6", // gray-100
          foreground: "#111827"
        },
        destructive: {
          DEFAULT: "#ef4444", // red-500
          foreground: "white"
        },
        border: "#e5e7eb", // gray-200
        input: "#e5e7eb", // gray-200
        ring: "#3b82f6", // blue-500
        chart: {
          "1": "#3b82f6", // blue-500
          "2": "#10b981", // emerald-500
          "3": "#f59e0b", // amber-500
          "4": "#ef4444", // red-500
          "5": "#8b5cf6" // violet-500
        },
        sidebar: {
          DEFAULT: "#f9fafb", // gray-50
          foreground: "#111827",
          primary: "#2563eb",
          "primary-foreground": "white",
          accent: "#f3f4f6",
          "accent-foreground": "#111827",
          border: "#e5e7eb",
          ring: "#3b82f6"
        }
      },
      borderRadius: {
        lg: "0.5rem",
        md: "0.375rem",
        sm: "0.25rem"
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" }
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out"
      }
    }
  },
  plugins: [require("tailwindcss-animate")]
};

export default config;