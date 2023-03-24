/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
      mytheme: {
      
        "primary": "#dc2626",
        "secondary": "#D926AA",      
        "accent": "#1FB2A5",  
        "neutral": "#191D24",
        "base-100": "#2A303C",
        "info": "#3ABFF8",
        "success": "#36D399",
        "warning": "#FBBD23",
        "error": "#dc2626",
      },
    },]
  }
};

module.exports = config;
