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
        korvex: {
          bg: "#060d0a",
          "bg-secondary": "#0a1510",
          "bg-tertiary": "#0f1f15",
          accent: "#00ff87",
          "accent-secondary": "#00c96a",
          text: "#e8f5ee",
          muted: "#4d7a5f",
          card: "#0b1812",
          border: "#162a1e",
        },
      },
      fontFamily: {
        heading: ["Unbounded", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
