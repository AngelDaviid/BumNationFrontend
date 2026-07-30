import {CreateProductData, PaginatedResponse, Product, UpdateProductData} from "@/types";
import { apiClient } from "./client";



export const productsApi = {
    getAll: (token: string, page = 1, limit = 10, search?: string, categoryId?: string) => {
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

        return apiClient<PaginatedResponse<Product>>(`/products?${params.toString()}`, { token });


    },

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

    update: (id: number, data: UpdateProductData, token: string) =>
        apiClient<Product>(`/products/${id}`, {
            method: 'PATCH',
            body: data,
            token,
        }),

    delete: (id: number, token: string) =>
        apiClient<void>(`/products/${id}`, {
            method: 'DELETE',
            token,
        }),
}