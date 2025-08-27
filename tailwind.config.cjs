/**** Tailwind config ****/
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#6f3dc5",
        sidebarBg1: "#120a2b",
        sidebarBg2: "#170e36",
        pageBg: "#f5f6fb",
        cardBorder: "#e7e7f1",
        dim: "#b7b4d0",
      },
      boxShadow: {
        card: "0 10px 30px rgba(0,0,0,.08)"
      }
    },
  },
  plugins: [],
};
