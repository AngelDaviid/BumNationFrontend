import { CreateProductData, PaginatedResponse, Product, UpdateProductData } from "@/types";
import { apiClient } from "./client";

interface GetAllProductsParams {
    page?: number;
    limit?: number;
    search?: string;
    categoryId?: string;
}

interface RequestConfig {
    signal?: AbortSignal;
}

export const productsApi = {
    getAll: (params: GetAllProductsParams = {}, config: RequestConfig = {}) => {
        const { page = 1, limit = 10, search, categoryId } = params;
 
        const query = new URLSearchParams();
        query.set('page', String(page));
        query.set('limit', String(limit));
        if (search) query.set('search', search);
        if (categoryId) query.set('category', categoryId);
 
        return apiClient<PaginatedResponse<Product>>(`/products?${query.toString()}`, {
            tags: ['products'],
            signal: config.signal,
        });
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