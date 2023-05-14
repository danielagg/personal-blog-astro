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
        'base-light': '#9ca3af',
        accent: '#10b981',
        'accent-light': '#34d399',
      }
    },
    backgroundColor: {
      main: {
        base: '#0f172a',
        accent: '#0f172a',
      }
    },
    borderColor: {
      main: {
        base: '#374151',
        'accent-dark': '#047857'
      }
    },
    fontFamily: {
      mono: ["Heebo", "sans-serif"],
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
