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
        edu: ['"Edu AU VIC WA NT Pre"', 'sans-serif'], // Usar el nombre exacto de la fuente entre comillas dobles
      },
      fontSize: {
        'size-4.5':'4.5rem',
        'size-2.5': '2.5rem', // Tamaño personalizado
        'size-1.5': '1.5rem', // Tamaño personalizado
        'size-1':'1rem',
      },
    },
  },
  plugins: [],
};
export default config;

