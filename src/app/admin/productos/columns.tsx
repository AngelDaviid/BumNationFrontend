import {ColumnDef} from "@tanstack/react-table";
import {Product} from "@/types";
import Image from "next/image";
import {StatusBadge} from "@/components/ui/status-badge";
import {formattedPrice} from "@/common/formatted-price";
import {Field} from "@/components/ui/field";
import {ProductActionsCell} from "./product-actions-cell";

export const columns: ColumnDef<Product>[] = [
    {
        id: "image",
        header: "Imagen",
        meta: {mobile: "media"},
        accessorKey: "image",
        cell: ({row}) => {
            const imageUrl = row.original.imageUrl;

            if (!imageUrl) return null

            return (
                <div className="h-14 w-14 mx-auto relative rounded-md overflow-hidden">
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
        meta: {mobile: "title"},
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
        cell: ({row}) => {
            const price = row.original.price;
            return `$ ${formattedPrice(price)} COP `;
        }
    },
    {
        accessorKey: 'stock',
        header: 'Stock',
        cell: ({row}) => {
            const stock = row.original.stock

            if (stock <= 5) {
                return (
                    <>
                        <div className={"flex items-center justify-center space-y-2"}>
                            <Field label={""}>{stock}</Field>
                            <StatusBadge TypeStatus={"warning"}/>
                        </div>
                    </>
                        )
            } else {
                return (
                    <>
                        <div className={"flex flex-col items-center justify-center space-y-2"}>
                            <Field label={""}>{stock}</Field>
                            <StatusBadge TypeStatus={"success"}/>
                        </div>
                    </>
                )
            }
        }
    },
    {
        id: "actions",
        header: "Acciones",
        cell: ({row}) => <ProductActionsCell product={row.original}/>,
    },
]
