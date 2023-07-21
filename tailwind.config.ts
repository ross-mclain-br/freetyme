import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#2f056b",
        secondary: "#f9e1cf",
        tertiary: "#44079c",
        quaternary: "#1a033a",
        quinary: "#fffdfc",
        sexinary: "#f9e1cf",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
} satisfies Config;
