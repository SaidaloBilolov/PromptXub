/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0F172A", // Deep Slate / Obsidian
        surface: "#1E293B",
        "surface-card": "rgba(30, 41, 59, 0.7)",
        "surface-card-hover": "rgba(51, 65, 85, 0.8)",
        border: "#334155",
        "neon-purple": "#8B5CF6",
        "neon-cyan": "#06B6D4",
        "neon-pink": "#EC4899",
      },
      fontFamily: {
        sans: ["var(--font-outfit)", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      boxShadow: {
        "neon-purple": "0 0 20px -5px rgba(139, 92, 246, 0.5)",
        "neon-cyan": "0 0 20px -5px rgba(6, 182, 212, 0.5)",
        "neon-card": "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};
