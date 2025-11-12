/**
 * PostCSS configuration for the frontend project.
 * Uses the @tailwindcss/postcss package as the PostCSS plugin for Tailwind
 * and Autoprefixer. Make sure to install:
 *
 *   npm install -D @tailwindcss/postcss autoprefixer
 *
 * or, if you haven't already installed Tailwind's runtime dependency:
 *
 *   npm install -D tailwindcss @tailwindcss/postcss autoprefixer
 *
 * Note: this file uses the require() form which is compatible with Vite/PostCSS.
 */

// postcss.config.cjs

module.exports = {
  plugins: {
    "@tailwindcss/postcss": {}, // <-- Esta es la forma correcta
    autoprefixer: {},
  },
};
