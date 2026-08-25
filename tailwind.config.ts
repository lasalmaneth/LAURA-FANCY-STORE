import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0a0a0a",
        paper: "#f5f4f0",
        "paper-warm": "#eeece5",
        "paper-mid": "#e0ddd4",
        grey: "#888888",
        "grey-light": "#cccccc",
        border: "#0a0a0a",
        background: "#f5f4f0",
        foreground: "#0a0a0a",
      },
      fontFamily: {
        display: ["var(--font-bebas)", "sans-serif"],
        body: ["var(--font-mono)", "monospace"],
        hand: ["var(--font-hand)", "cursive"],
      },
      animation: {
        ticker: "ticker 25s linear infinite",
        float: "float 4s ease-in-out infinite",
        spinSlow: "spinSlow 8s linear infinite",
        fadeIn: "fadeIn 0.4s ease forwards",
      },
      keyframes: {
        ticker: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        spinSlow: {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        fadeIn: {
          from: { opacity: "0", transform: "translateY(4px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
