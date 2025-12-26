import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "flower-sway": {
          "0%, 100%": { transform: "rotate(0deg) translateX(0)" },
          "25%": { transform: "rotate(2deg) translateX(2px)" },
          "50%": { transform: "rotate(0deg) translateX(0)" },
          "75%": { transform: "rotate(-2deg) translateX(-2px)" },
        },
        "flower-quiver": {
          "0%, 100%": { transform: "rotate(0deg) scale(1)" },
          "10%": { transform: "rotate(0.5deg) scale(1.01)" },
          "20%": { transform: "rotate(-0.5deg) scale(0.99)" },
          "30%": { transform: "rotate(0.3deg) scale(1.005)" },
          "40%": { transform: "rotate(-0.3deg) scale(0.995)" },
          "50%": { transform: "rotate(0deg) scale(1)" },
        },
        "petal-flutter": {
          "0%, 100%": { transform: "scaleY(1)" },
          "50%": { transform: "scaleY(0.95)" },
        },
        "bee-figure8": {
          "0%": { transform: "translate(0, 0)" },
          "12.5%": { transform: "translate(30px, -20px)" },
          "25%": { transform: "translate(50px, 0)" },
          "37.5%": { transform: "translate(30px, 20px)" },
          "50%": { transform: "translate(0, 0)" },
          "62.5%": { transform: "translate(-30px, -20px)" },
          "75%": { transform: "translate(-50px, 0)" },
          "87.5%": { transform: "translate(-30px, 20px)" },
          "100%": { transform: "translate(0, 0)" },
        },
        "bee-flight": {
          "0%": { transform: "translate(0, 0) rotate(0deg)" },
          "25%": { transform: "translate(100px, -30px) rotate(10deg)" },
          "50%": { transform: "translate(200px, 0px) rotate(-5deg)" },
          "75%": { transform: "translate(300px, -20px) rotate(8deg)" },
          "100%": { transform: "translate(400px, 0) rotate(0deg)" },
        },
        "wing-buzz": {
          "0%, 100%": { transform: "scaleY(1) rotate(0deg)" },
          "50%": { transform: "scaleY(0.3) rotate(5deg)" },
        },
        "bee-hover": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-5px)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "flower-sway": "flower-sway 4s ease-in-out infinite",
        "flower-quiver": "flower-quiver 3s ease-in-out infinite",
        "petal-flutter": "petal-flutter 2s ease-in-out infinite",
        "bee-figure8": "bee-figure8 6s ease-in-out infinite",
        "bee-flight": "bee-flight 8s linear infinite",
        "wing-buzz": "wing-buzz 0.1s ease-in-out infinite",
        "bee-hover": "bee-hover 1.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
