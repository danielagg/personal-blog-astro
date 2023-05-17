/** @type {import('tailwindcss').Config} */


module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    screens: {
      sm: "640px",
    },
    textColor: {
      main: {
        base: '#6b7280',
        'base-inverted': "#6b7280",
        'base-light': '#9ca3af',
        accent: '#10b981',
        'accent-light': '#34d399',
        white: '#fff'
      }
    },
    backgroundColor: {
      main: {
        base: '#0f172a',
        'base-inverted': '#f1f5f9',
        accent: '#0f172a',
        highlight: '#475569'
      }
    },
    borderColor: {
      main: {
        base: '#374151',
        'base-inverted': '#d1d5db',
        'accent-dark': '#374151',
        'accent': '#d1d5db'
      }
    },
    fontFamily: {
      mono: ["Heebo", "sans-serif"],
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
