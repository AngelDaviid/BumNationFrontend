"use client";

import { usePathname } from "next/navigation";

const TITLES: { prefix: string; title: string }[] = [
  { prefix: "/admin/productos", title: "Productos" },
  { prefix: "/admin/categorias", title: "Categorías" },
  { prefix: "/admin/pagos", title: "Membresías y pagos" },
  { prefix: "/admin/ordenes", title: "Órdenes" },
  { prefix: "/admin/ui-test", title: "UI Test" },
];

export function AdminHeaderTitle() {
  const pathname = usePathname();
  const title = TITLES.find((item) => pathname.startsWith(item.prefix))?.title ?? "Resumen";

  return <span className="truncate text-sm font-medium text-zinc-700">{title}</span>;
}
