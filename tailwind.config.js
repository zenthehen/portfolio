/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0D1117",
        panel: "#131922",
        "panel-2": "#171E29",
        "panel-3": "#1C2432",
        line: "#222B37",
        "line-gold": "rgba(200, 146, 42, 0.35)",
        cream: "#F5F0E8",
        slate: {
          DEFAULT: "#9AA5B1",
          dim: "#6E7885",
        },
        gold: {
          DEFAULT: "#C8922A",
          bright: "#E0AC49",
          soft: "rgba(200, 146, 42, 0.12)",
        },
        bull: "#3FB68B",
        bear: "#EF4444",
      },
      fontFamily: {
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
        display: ['"Fraunces"', 'Georgia', 'serif'],
        sans: ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
