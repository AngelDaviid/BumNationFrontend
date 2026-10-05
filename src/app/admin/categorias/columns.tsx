import { ColumnDef } from "@tanstack/react-table";
import { Category } from "@/types";
import { CategoryActionsCell } from "@/app/admin/categorias/category-actions-cell";

export const columns: ColumnDef<Category>[] = [
  { accessorKey: "id", header: "#", meta: { mobile: "hidden" } },
  { accessorKey: "name", header: "Nombre", meta: { mobile: "title" } },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => <CategoryActionsCell category={row.original} />,
  },
];
