/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        faculty: ["Faculty Glyphic", "sans-serif"],
      },
      colors: {
        "primary-light": "#86e7b8",
        "primary-dark": "#232B2B",
        accent: "#86e7b8",
      },
      boxShadow: {
        "custom-combined": `
          -2px 16px 35px 0px rgba(134, 231, 184, 0.1),
          -9px 63px 64px 0px rgba(134, 231, 184, 0.09),
          -21px 143px 87px 0px rgba(134, 231, 184, 0.05),
          -38px 254px 103px 0px rgba(134, 231, 184, 0.03),
          -59px 396px 112px 0px rgba(134, 231, 184, 0.00)
        `,
        "custom-light": "0px 28px 28px 0px #F1F5F9",
        "custom-shadow": "0px 6px 6px 0px #F1F5F9",
        "custom-shadow-hover": "0px 10px 10px 0px #F1F5F9",
      },
      backgroundImage: {
        "custom-gradient":
          "linear-gradient(88.39deg, #86e7b8 -11.84%, #86e7b0 46.78%, #86e7c8 96.47%)",
        "custom-gradient-disable":
          "linear-gradient(88.39deg, #D3D3D3 -11.84%, #B0B0B0 46.78%, #D0D0D0 96.47%)",
      },
    },
  },
  plugins: [],
};
