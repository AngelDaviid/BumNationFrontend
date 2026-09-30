import { Product } from "@/types";

export const LOW_STOCK_THRESHOLD = 5;
const NEW_PRODUCT_DAYS = 14;

export type ProductBadgeTone = "danger" | "warning" | "new";

export interface ProductBadge {
  label: string;
  tone: ProductBadgeTone;
}

// Etiquetas de la tarjeta: agotado, últimas unidades y nuevo
export function getProductBadges(product: Product, now = Date.now()): ProductBadge[] {
  const badges: ProductBadge[] = [];

  if (product.stock <= 0) badges.push({ label: "Agotado", tone: "danger" });
  else if (product.stock <= LOW_STOCK_THRESHOLD) badges.push({ label: "Últimas unidades", tone: "warning" });

  const ageInDays = (now - new Date(product.createdAt).getTime()) / (1000 * 60 * 60 * 24);
  if (ageInDays >= 0 && ageInDays <= NEW_PRODUCT_DAYS) badges.push({ label: "Nuevo", tone: "new" });

  return badges;
}
