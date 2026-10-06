"use client";
import {DataTable} from "@/components/ui/data-table";
import {columns} from "@/app/admin/productos/columns";
import {useProducts} from "@/hooks/products/use-products";
import {BrandSection} from "@/components/shop/brand-divider";
import {CreateProductButton} from "@/app/admin/productos/create-product-button";
import {useListParams} from "@/hooks/use-list-params";

export default function AdminProductsPage() {
    const { search, setSearch, debouncedSearch, page, nextPage, prevPage } = useListParams()
    const { products, isLoading, error, totalPages } = useProducts({ limit: 10, page, search: debouncedSearch })

    if (error) {
        return <p className="text-red-500 p-6">{error}</p>
    }

    return (
        <BrandSection logo="inventario" className="bg-white ring-1 ring-zinc-200">
            <DataTable
                columns={columns}
                data={products}
                isLoading={isLoading}
                searchValue={search}
                onSearchChange={setSearch}
                searchPlaceholder="Buscar por nombre..."
                page={page}
                totalPages={totalPages}
                onNextPage={nextPage}
                onPrevPage={prevPage}
                toolbar={<CreateProductButton/>}
            />
        </BrandSection>
    );
}
