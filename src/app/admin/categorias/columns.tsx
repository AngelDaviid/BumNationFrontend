import { ColumnDef } from "@tanstack/react-table";
import { Category } from "@/types";
import { CategoryActionsCell } from "@/app/admin/categorias/category-actions-cell";

export const columns: ColumnDef<Category>[] = [
  { accessorKey: "id", header: "#" },
  { accessorKey: "name", header: "Nombre" },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => <CategoryActionsCell category={row.original} />,
  },
];
