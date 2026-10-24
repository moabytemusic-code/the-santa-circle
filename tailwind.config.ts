import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        christmas: {
          darkgreen: "#0B2B20",
          evergreen: "#144534",
          forest: "#1D5943",
          lightgreen: "#2E7D5B",
          darkred: "#680C0C",
          ruby: "#9B111E",
          berry: "#C41E3A",
          brightred: "#DC2626",
          gold: "#D4AF37",
          warmgold: "#F3C053",
          lightgold: "#FDE68A",
          snow: "#F8FAFC",
          ice: "#E2E8F0",
          cream: "#FEF9EE",
        },
      },
      fontFamily: {
        festive: ["Georgia", "serif"],
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
        sparkle: {
          "0%, 100%": { opacity: "0.4", transform: "scale(0.95)" },
          "50%": { opacity: "1", transform: "scale(1.05)" },
        },
        unwrap: {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.1) rotate(-3deg)" },
          "100%": { transform: "scale(1) rotate(0deg)" },
        },
      },
      animation: {
        float: "float 4s ease-in-out infinite",
        sparkle: "sparkle 2.5s ease-in-out infinite",
        unwrap: "unwrap 0.8s ease-in-out",
      },
    },
  },
  plugins: [],
};
export default config;
