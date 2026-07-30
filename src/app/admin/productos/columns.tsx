import {ColumnDef} from "@tanstack/react-table";
import {Product} from "@/types";
import Image from "next/image";
import {StatusBadge} from "@/components/ui/status-badge";

export const columns: ColumnDef<Product>[] = [
    {
        id: "image",
        header: "Imagen",
        accessorKey: "image",
        cell: ({row}) => {
            const imageUrl = row.original.imageUrl;

            if (!imageUrl) return null

            return (
                <div className="h-10 w-10 mx-auto relative rounded-md overflow-hidden">
                    <Image
                        src={imageUrl}
                        alt="Imagen del producto"
                        fill
                        className="object-cover"
                    />
                </div>
            )


        }
    },
    {
        accessorKey: 'name',
        header: 'Nombre',
    },
    {
        accessorKey: 'brand',
        header: 'Marca',
    },
    {
        accessorKey: 'category.name',
        header: 'Categoria',
    },
    {
        accessorKey: 'price',
        header: 'Precio',
    },
    {
        accessorKey: 'stock',
        header: 'Stock',
        cell: ({row}) => {
            const stock = row.original.stock

            if (stock <= 5) {
                return <StatusBadge TypeStatus={"warning"}/>
            } else {
                return <StatusBadge TypeStatus={"success"}/>
            }
        }
    },
]