/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        "brand-dark": "#0B1629",
        "brand-teal": "#00E3C2",
        "brand-gray": "#F5F7FA",
        "brand-border": "#E5E7EB",
        "text-dark": "#1A2B4A",
        "text-muted": "#686868",
        "text-input": "#A7A7A7",
        "alert-info-bg": "#EFF6FF",
        "alert-info-border": "#BFDBFE",
        "alert-warn-bg": "#FFF7ED",
        "alert-warn-border": "#FED7AA",
        "error": "#EB5757",
      },
    },
  },
  plugins: [],
};
