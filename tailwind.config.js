/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "rgba(var(--background))",
        foreground: "rgba(var(--foreground))",
        primary: "rgba(var(--primary))",
        secondary: "rgba(var(--secondary))",
        accent: "rgba(var(--accent))",
      },
    },
  },
  plugins: [],
}
