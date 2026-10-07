export const colors = {
  brand: {
    DEFAULT: "#65C33A",
    hover: "#58AD32",
    text: "#367A1A",
    foreground: "#09090B",
  },

  neon: {
    DEFAULT: "#6BFF3C",
    foreground: "#0B2E04",
  },
} as const;

export type AppColors = typeof colors;
