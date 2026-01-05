/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    // If you keep code in `app` or `src` folders, add them too:
    // './app/**/*.{js,ts,jsx,tsx}',
    // './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        charcoal: "#0F0F0F",
        parchment: "#F4F1EA",
        smoke: "#2F362F",
        paper: "#D9D3C6",
        sage: '#788978'
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
