import type { Config } from "tailwindcss";

/**
 * Tailwind is used sparingly for layout utilities only. Brand colours,
 * radii, shadows and easings come from src/constants/tokens.ts (mirrored here
 * so utilities exist, but components import tokens directly for anything
 * non-trivial). PRD Part 2 forbids "default Tailwind-looking" layouts.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "bg-primary": "#F8FCFF",
        "bg-secondary": "#F3FAFD",
        ocean: "#1597FF",
        "light-water": "#77D7FF",
        "crystal-cyan": "#DFF8FF",
        "deep-ocean": "#0057C8",
        accent: "#00AEEF",
        ink: "#0A1B2B",
        "ink-secondary": "#4F6778",
        "ink-muted": "#93A6B5",
      },
      borderRadius: {
        sm: "12px",
        md: "20px",
        lg: "32px",
        card: "40px",
      },
      maxWidth: {
        shell: "1440px",
        content: "1280px",
      },
      transitionTimingFunction: {
        primary: "cubic-bezier(0.22,0.61,0.36,1)",
        secondary: "cubic-bezier(0.16,1,0.3,1)",
        bounce: "cubic-bezier(0.34,1.56,0.64,1)",
      },
    },
  },
  plugins: [],
};

export default config;
