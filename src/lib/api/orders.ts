import { Order, PaginatedResponse } from "@/types";
import { apiClient } from "./client";

export const ordersApi = {
    checkout: (token: string) => 
        apiClient<Order>(`/orders/checkout`, {
            method: 'POST',
            token,
        }),

    getMyOrders: (token: string, page = 1, limit = 10) => 
        apiClient<PaginatedResponse<Order>>(`/orders/me?page=${page}&limit=${limit}`, {token }),

    getById: (id: string, token: string) => 
        apiClient<Order>(`/orders/${id}`, { token }),

    cancel: (id: string, reason: string | undefined, token: string) =>
        apiClient <Order>(`/orders/${id}/cancel`, {
            method: 'PATCH',
            body: { reason },
            token,
        }),
    
    getAll: (token: string, page = 1, limit = 10) =>
        apiClient<PaginatedResponse<Order>>(
            `/orders?page=${page}&limit=${limit}`, { token }
        ),

    searchByNumber: (orderNumber: number, token: string) =>
        apiClient<Order>(`/orders/search?number=${orderNumber}`, { token }),

    updateStatus: (id: string, status: string, token: string) =>
        apiClient<Order>(`/orders/${id}/status`, {
            method: 'PATCH',
            body: { status },
            token,
        }),   
}