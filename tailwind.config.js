/** @type {import('tailwindcss').Config} */
// Colors live as RGB triplets in src/index.css so SVG and Tailwind share one palette.
const token = (name) => `rgb(var(--${name}) / <alpha-value>)`;

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: token('paper'),
        sheet: {
          DEFAULT: token('sheet'),
          2: token('sheet-2'),
          3: token('sheet-3'),
        },
        grid: token('grid'),
        rule: token('rule'),
        ink: {
          DEFAULT: token('ink'),
          soft: token('ink-soft'),
          faint: token('ink-faint'),
        },
        mark: token('mark'),
        'on-mark': token('on-mark'),
        night: token('night'),
        bull: token('bull'),
        bear: token('bear'),
      },
      fontFamily: {
        display: ['"Big Shoulders Display"', '"Arial Narrow"', 'sans-serif'],
        sans: ['"Instrument Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '2px',
        md: '2px',
        lg: '3px',
        xl: '3px',
      },
    },
  },
  plugins: [],
}
