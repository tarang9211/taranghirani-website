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
        espresso: "#1B1A1F",
        taupe: "#2B292F",
        gold: "#C6A76B",
        parchment: "#F4F1EA",
        lilac: "#A6A2B2",
        smoke: "#3A3842",
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
