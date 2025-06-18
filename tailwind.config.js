/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}", // Esta linha já é suficiente!
  ],
  extend: {
    animation: {
      shimmer: "shimmer 1.5s infinite linear",
    },
    keyframes: {
      shimmer: {
        "0%": { transform: "translateX(-100%)" },
        "100%": { transform: "translateX(100%)" },
      },
    },
  },
};
