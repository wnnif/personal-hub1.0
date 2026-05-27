import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        surface: "#f9f9fb",
        "surface-container": "#eeeef0",
        "surface-container-low": "#f3f3f5",
        "surface-container-high": "#e8e8ea",
        "surface-container-highest": "#e2e2e4",
        "on-surface": "#1a1c1d",
        "on-surface-variant": "#414755",
        outline: "#717786",
        "outline-variant": "#c1c6d7",
        primary: "#0058bc",
        "primary-container": "#0070eb",
        "inverse-primary": "#adc6ff",
        "inverse-on-surface": "#f0f0f2"
      },
      borderRadius: {
        DEFAULT: "1rem",
        md: "1.5rem",
        lg: "2rem",
        xl: "3rem"
      },
      boxShadow: {
        glass: "0 10px 40px rgba(0, 0, 0, 0.04)"
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
