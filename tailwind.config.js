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
        charcoal: "#080808",
        parchment: "#FFFFFF",
        smoke: "#525252",
        paper: "#F5F5F3",
        sage: "#C4956A",
        // Darker tint of the sage accent for accent TEXT on light (paper)
        // surfaces: sage itself is only 2.45:1 on paper (fails WCAG AA for
        // text), so labels use bark (5.12:1). Sage stays for hairlines/borders
        // and for accent text on dark surfaces, where it passes comfortably.
        bark: "#8C5E30",
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      letterSpacing: {
        // DESIGN.md tracking ladder
        eyebrow: "0.2em",
        cta: "0.15em",
        nav: "0.1em",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slow-zoom": {
          "0%": { transform: "scale(1.0)" },
          "100%": { transform: "scale(1.06)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.8s ease-out forwards",
        "fade-up-delay": "fade-up 0.8s ease-out 0.25s forwards",
        "fade-in": "fade-in 1s ease-out forwards",
        "slow-zoom": "slow-zoom 20s ease-out forwards",
      },
    },
  },
  plugins: [],
};
