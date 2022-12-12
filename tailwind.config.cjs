/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        dark: "hsl(0deg 0% 8%)",
      },
    },
  },
  plugins: [require("@tailwindcss/line-clamp")],
};
