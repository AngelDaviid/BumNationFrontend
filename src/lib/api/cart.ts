import { Cart, CartItem } from "@/types";
import { apiClient } from "./client";

export const cartApi = {
    getCart: (token: string) =>
        apiClient<Cart>(`/cart`, { token}),

    addItem: (productId: number, quantity: number, token: string) =>
        apiClient<Cart>(`/cart/items`, {
            method: 'POST',
            body: { productId, quantity },
            token,
        }),

    updateItem: (itemId: string, quantity: number, token: string) =>
        apiClient<CartItem>(`/cart/items/${itemId}`, {
            method: 'PATCH',
            body: { quantity },
            token,
        }),
    
    removeItem: (itemId: string, token: string) => 
        apiClient<void>(`/cart/items/${itemId}`, {
            method: 'DELETE',
            token,
        }),
    
    clearCart: (token: string) => 
        apiClient<void>(`/cart`, {
            method: 'DELETE',
            token,
        }),
}