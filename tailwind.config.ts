import type { Config } from "tailwindcss";
import { colors } from "./src/theme/colors";

const config = {
  theme: {
    extend: {
      colors,
    },
  },
} satisfies Config;

export default config;
