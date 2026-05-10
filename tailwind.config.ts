import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#070706",
        panel: "#12100c",
        line: "rgba(244, 220, 164, 0.16)",
        blue: "#67d5c0",
        violet: "#c89bff",
        emerald: "#79d8a6",
        champagne: "#f4dca4",
        copper: "#d79958",
        ruby: "#e46f72"
      },
      boxShadow: {
        glow: "0 28px 90px rgba(244, 220, 164, 0.16)",
        emerald: "0 24px 70px rgba(121, 216, 166, 0.16)"
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "ui-sans-serif", "system-ui"]
      }
    }
  },
  plugins: []
};

export default config;
