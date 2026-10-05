import {ColumnDef} from "@tanstack/react-table";
import {Order} from "@/types";
import {formatDate} from "@/lib/utils/date";
import {formattedPrice} from "@/common/formatted-price";
import {OrderStatusBadge} from "@/components/admin/orders/order-status-badge";

export const columns: ColumnDef<Order>[] = [
    { id: "number", header: "#", meta: { mobile: "title" }, cell: ({ row }) => <span className="font-mono">#{row.original.orderNumber}</span> },
    {
        id: "customer",
        header: "Cliente",
        cell: ({ row }) => `${row.original.user?.firstName ?? ""} ${row.original.user?.firstLastName ?? ""}`,
    },
    { id: "date", header: "Fecha", cell: ({ row }) => formatDate(row.original.createdAt) },
    {
        id: "items",
        header: "Productos",
        cell: ({ row }) => row.original.items.reduce((sum, item) => sum + item.quantity, 0),
    },
    { id: "total", header: "Total", cell: ({ row }) => `$${formattedPrice(row.original.total)}` },
    { id: "status", header: "Estado", cell: ({ row }) => <OrderStatusBadge status={row.original.status} /> },
];