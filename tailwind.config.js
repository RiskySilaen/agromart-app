/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "agro-green": "#2F5E38",
        "agro-light": "#E8F5E9",
        "agro-card-green": "#468350",
      },
      fontFamily: {
        serif: ["Merriweather", "serif"],
        sans: ["Poppins", "sans-serif"],
      },
      boxShadow: {
        soft: "0 4px 20px rgba(0,0,0,0.08)",
      },
      animation: {
        "shape-morph": "morphRotate 2s cubic-bezier(0.4, 0, 0.2, 1) forwards",
        "fade-in-up": "fadeInUp 0.8s ease-out forwards",
      },
      keyframes: {
        morphRotate: {
          "0%": { borderRadius: "10%", transform: "rotate(0deg)" },
          "50%": { borderRadius: "15%", transform: "rotate(45deg)" },
          "100%": { borderRadius: "50%", transform: "rotate(45deg)" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
