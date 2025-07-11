import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'green-fluor': '#00FF99',
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: {
        edu: ['"Edu AU VIC WA NT Pre"', 'sans-serif'],
      },
      fontSize: {
        'size-4.5':'4.5rem',
        'size-2.5': '2.5rem',
        'size-1.5': '1.5rem',
        'size-1':'1rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'fade-in-bounce': 'fade-in-bounce 0.6s ease-out both',
      },
      keyframes: {
        'fade-in-bounce': {
          '0%': { opacity: '0', transform: 'scale(0.8) translateY(-10px)' },
          '50%': { opacity: '0.5', transform: 'scale(1.05)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
