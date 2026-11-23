import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#030712",
        surface: "#0f172a",
        "surface-hover": "#1e293b",
      },
    },
  },
};

export default config;