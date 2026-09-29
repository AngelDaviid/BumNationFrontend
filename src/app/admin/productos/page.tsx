"use client";
import {DataTable} from "@/components/ui/data-table";
import {columns} from "@/app/admin/productos/columns";
import {useProducts} from "@/hooks/products/use-products";
import {useRouter} from "next/navigation";
import {Product} from "@/types";

export default function AdminProductsPage() {
    const router = useRouter();

    const { products, isLoading, error, page, totalPages, nextPage, prevPage, search, setSearch  } = useProducts({ limit: 10 })

    if (error) {
        return <p className="text-red-500 p-6">{error}</p>
    }

   return (
    <div className="flex min-h-screen bg-zinc-50">
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-6 space-y-6">
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
                onRowClick={(product: Product) => {
                    router.push(`/admin/productos/editar/${product.id}`);
                }}
            />
        </main>
      </div>
    </div>
  );
}