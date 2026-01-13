import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        gold: {
          50: '#faf8f3',
          100: '#f5f0e6',
          200: '#e8d9b4',
          300: '#d4c08a',
          400: '#c9a961',
          500: '#a68b4a',
          600: '#8b7239',
          700: '#6d5829',
          800: '#4a3d1c',
          900: '#2d2411',
        },
        neutral: {
          50: '#fafafa',
          100: '#f5f5f3',
          200: '#e8e8e6',
          300: '#d4d4d2',
          400: '#a3a3a1',
          500: '#737371',
          600: '#525250',
          700: '#40403e',
          800: '#2d2d2d',
          900: '#1a1a1a',
        },
      },
    },
  },
  plugins: [],
};
export default config;
