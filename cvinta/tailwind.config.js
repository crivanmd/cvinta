/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#161B18",
        "ink-soft": "#4B5550",
        "ink-faint": "#9AA39D",
        paper: "#FAFAF7",
        "paper-raised": "#FFFFFF",
        line: "#E4E7E3",
        accent: "#1F6F54",
        "accent-strong": "#16553F",
        "accent-tint": "#E4F2EC",
        "accent-tint-2": "#EFF7F2",
        danger: "#B4483A",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        sans: ["var(--font-body)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
