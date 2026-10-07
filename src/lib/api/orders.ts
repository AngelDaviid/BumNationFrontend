import { Order, PaginatedResponse } from "@/types";
import { apiClient } from "./client";

export const ordersApi = {
    checkout: () => 
        apiClient<Order>(`/orders/checkout`, { method: 'POST' }),

    getMyOrders: (page = 1, limit = 10) => 
        apiClient<PaginatedResponse<Order>>(`/orders/me?page=${page}&limit=${limit}`),

    getById: (id: string) => 
        apiClient<Order>(`/orders/${id}`),

    cancel: (id: string, reason: string | undefined) =>
        apiClient <Order>(`/orders/${id}/cancel`, {
            method: 'PATCH',
            body: { cancelReason: reason },
        }),
    
    getAll: (page = 1, limit = 10) =>
        apiClient<PaginatedResponse<Order>>(`/orders?page=${page}&limit=${limit}`),

    searchByNumber: (orderNumber: number) =>
        apiClient<Order>(`/orders/search/${orderNumber}`),

    updateStatus: (id: string, status: string) =>
        apiClient<Order>(`/orders/${id}/status`, {
            method: 'PATCH',
            body: { status },
        }),

    cancelAsAdmin: (id: string, reason: string | undefined) =>
        apiClient<Order>(`/orders/${id}/admin-cancel`, {
            method: 'PATCH',
            body: { cancelReason: reason },
        }),
}