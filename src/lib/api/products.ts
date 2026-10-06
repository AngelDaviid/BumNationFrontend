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

    create: (data: CreateProductData, token: string) =>
        apiClient<Product>('/products', {
            method: 'POST',
            body: data,
            token,
        }),

    uploadProductImage: (id: number, file: File, token: string) => {
        const formData = new FormData();
        formData.append('file', file);

        return apiClient<Product>(`/products/${id}/image`, {
            method: 'PATCH',
            body: formData,
            token,
        });
    },

    removeProductImage: (id: number, token: string) =>
        apiClient<Product>(`/products/${id}/image`, {
            method: 'DELETE',
            token,
        }),

    update: (id: number, data: UpdateProductData, token: string) =>
        apiClient<Product>(`/products/${id}`, {
            method: 'PATCH',
            body: data,
            token,
        }),

    changeCategory: (id: number, categoryId: number, token: string) =>
        apiClient<Product>(`/products/${id}`, {
            method: 'PATCH',
            body: { categoryId },
            token,
        }),

    delete: (id: number, token: string) =>
        apiClient<void>(`/products/${id}`, {
            method: 'DELETE',
            token,
        }),
}