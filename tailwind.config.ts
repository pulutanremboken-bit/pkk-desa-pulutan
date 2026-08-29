import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        pkk: {
          50: "#f3f8ff",
          100: "#e6f0ff",
          500: "#2f6db2",
          600: "#255b97",
          700: "#1d4a7d",
          900: "#102b4c"
        }
      },
      boxShadow: {
        soft: "0 10px 35px rgba(16,43,76,.08)"
      }
    }
  },
  plugins: []
};
export default config;
