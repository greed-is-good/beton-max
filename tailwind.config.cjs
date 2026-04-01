/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        accent: {
          50: "#f3f7ff",
          100: "#e6eeff",
          200: "#c8d7ff",
          300: "#a2bbff",
          400: "#7a9bff",
          500: "#5278ff",
          600: "#3c5fe6",
          700: "#314ac0",
          800: "#2a3d9b",
          900: "#253578"
        },
        slatey: {
          50: "#f6f8fb",
          100: "#eef2f7",
          200: "#d8e0eb",
          300: "#b7c4d6",
          400: "#8da0b9",
          500: "#6f83a0",
          600: "#556783",
          700: "#455469",
          800: "#364254",
          900: "#2b3646"
        }
      },
      boxShadow: {
        phone: "0 24px 60px -36px rgba(15, 23, 42, 0.45)",
        lift: "0 14px 40px -24px rgba(30, 64, 175, 0.5)"
      }
    }
  },
  plugins: []
};
