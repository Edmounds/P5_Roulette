/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      keyframes: {
        "bounce-custom": {
          "0%, 100%": {
            transform: "translateY(-10%) rotate(-2deg)",
          },
          "50%": {
            transform: "translateY(0) rotate(2deg)",
          }
        }
      },
      animation: {
        "bounce-custom": "bounce-custom 1s ease-in-out infinite"
      }
    }
  },
  plugins: []
};
