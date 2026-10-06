import { Cart, CartItem } from "@/types";
import { apiClient } from "./client";

export const cartApi = {
    getCart: () =>
        apiClient<Cart>(`/cart`),

    addItem: (productId: number, quantity: number) =>
        apiClient<CartItem>(`/cart/items`, {
            method: 'POST',
            body: { productId, quantity },
        }),

    updateItem: (itemId: string, quantity: number) =>
        apiClient<CartItem>(`/cart/items/${itemId}`, {
            method: 'PATCH',
            body: { quantity },
        }),

    removeItem: (itemId: string) =>
        apiClient<void>(`/cart/items/${itemId}`, { method: 'DELETE' }),

    clearCart: () =>
        apiClient<void>(`/cart`, { method: 'DELETE' }),
}
