// Tailwind through PostCSS, as Next's docs set it up. The Turbopack loader
// (@tailwindcss/turbopack) kept compiling an old globals.css after it changed,
// dropping the Appearance tokens and --spacing-header.
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
