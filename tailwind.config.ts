import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./@neup/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#111827",
        charcoal: "#0B0D0F",
        ivory: "#F5F1E8",
        bronze: "#A97845",
        stone: "#9A978F",
        soft: "#F8F7F3",
      },
      boxShadow: {
        aura: "0 24px 80px rgba(11, 13, 15, 0.18)",
      },
      backgroundImage: {
        mesh:
          "radial-gradient(circle at top, rgba(169, 120, 69, 0.24), transparent 38%), radial-gradient(circle at 80% 20%, rgba(248, 247, 243, 0.09), transparent 34%)",
      },
      fontFamily: {
        display: ["var(--font-display)"],
        sans: ["var(--font-sans)"],
      },
    },
  },
  plugins: [],
};

export default config;
