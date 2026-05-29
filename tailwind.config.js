/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', "Georgia", "serif"],
        body: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        handwritten: ['"Caveat"', "cursive"],
      },
      colors: {
        midnight: "#07111f",
        ink: "#0d1b2f",
        moon: "#fff6dc",
        pearl: "#f7ead1",
        rose: "#d9918d",
        ember: "#f0b35f",
        wine: "#5b1631",
        sea: "#6cb9c7",
        pine: "#436759",
      },
      boxShadow: {
        moon: "0 0 40px rgba(255, 236, 179, 0.35)",
        lantern: "0 0 50px rgba(240, 179, 95, 0.28)",
        card: "0 24px 80px rgba(0, 0, 0, 0.3)",
      },
      backgroundImage: {
        "gold-glow":
          "radial-gradient(circle at 50% 50%, rgba(240, 179, 95, 0.22), transparent 62%)",
      },
    },
  },
  plugins: [],
};
