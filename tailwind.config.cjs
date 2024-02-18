/** @type {import('tailwindcss').Config} */


module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    screens: {
      sm: "640px",
    },
    textColor: {
      main: {
        base: '#a1a1aa',
        'base-inverted': "#a1a1aa", 
        'base-light': '#a1a1aa', 
        accent: '#10b981', 
        accentLight: '#10b981', 
      }
    },
    backgroundColor: {
      main: {
        base: '#09090b',
        'base-inverted': '#09090b',
        accent: '#18181b'
      }
    },
    borderColor: {
      main: {
        base: '#27272a',
        'base-inverted': '#27272a',
        'accent-dark': '#10b981',
        'accent': '#10b981'
      }
    },
    fontFamily: {
        sans: ['Inconsolata', "sans-serif"],
    }
  },
  plugins: [require("@tailwindcss/typography")],
};
