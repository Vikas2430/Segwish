import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#66BB6A",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#E8F5E9",
          foreground: "#424242",
        },
        destructive: {
          DEFAULT: "#F44336",
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "#F5F5F5",
          foreground: "#757575",
        },
        accent: {
          DEFAULT: "#FAFAFA",
          foreground: "#424242",
        },
        popover: {
          DEFAULT: "#FFFFFF",
          foreground: "#424242",
        },
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#424242",
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config

