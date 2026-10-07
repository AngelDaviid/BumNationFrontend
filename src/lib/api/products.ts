import {CreateProductData, PaginatedResponse, Product, ProductListFilters, UpdateProductData} from "@/types";
import { apiClient } from "./client";



export const productsApi = {
    getAll: (
        page = 1,
        limit = 10,
        search?: string,
        categoryId?: string,
        options: { signal?: AbortSignal } & ProductListFilters = {},
    ) => {
        const params = new URLSearchParams({
            page: String(page),
            limit: String(limit),
        });

        if(search) {
            params.set("search", search);
        }

        if(categoryId) {
            params.set("categoryId", categoryId);
        }

        if(options.brand) {
            params.set("brand", options.brand);
        }

        if(options.sort) {
            params.set("sort", options.sort);
        }

        if(options.inStock) {
            params.set("inStock", "true");
        }

        return apiClient<PaginatedResponse<Product>>(`/products?${params.toString()}`, {
            signal: options.signal,
            // En el servidor, la misma consulta se reutiliza 30 s entre visitantes
            revalidate: 30,
        });
    },

    getBrands: () =>
        apiClient<string[]>('/products/brands', { revalidate: 300 }),

    getById: (id: number) =>
        apiClient<Product>(`/products/${id}`, {
            tags: ['products'],
        }),

    create: (data: CreateProductData) =>
        apiClient<Product>('/products', {
            method: 'POST',
            body: data,
        }),

    uploadProductImage: (id: number, file: File) => {
        const formData = new FormData();
        formData.append('file', file);

        return apiClient<Product>(`/products/${id}/image`, {
            method: 'PATCH',
            body: formData,
        });
    },

    removeProductImage: (id: number) =>
        apiClient<Product>(`/products/${id}/image`, { method: 'DELETE' }),

    update: (id: number, data: UpdateProductData) =>
        apiClient<Product>(`/products/${id}`, {
            method: 'PATCH',
            body: data,
        }),

    changeCategory: (id: number, categoryId: number) =>
        apiClient<Product>(`/products/${id}`, {
            method: 'PATCH',
            body: { categoryId },
        }),

    delete: (id: number) =>
        apiClient<void>(`/products/${id}`, { method: 'DELETE' }),
}