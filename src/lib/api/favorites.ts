import { Favorite } from "@/types";
import { apiClient } from "./client";

export const favoritesApi = {
    getAll: (token: string) =>
        apiClient<Favorite[]>(`/favorites`, { token }),

    check: (productId: number, token: string) =>
        apiClient<{ isFavorite: boolean }>(`/favorites/${productId}/check`, { token }),

    add: (productId: number, token: string) =>
        apiClient<Favorite>(`/favorites`, {
            method: 'POST',
            body: { productId },
            token,
        }),

    remove: (productId: number, token: string) =>
        apiClient<Favorite>(`/favorites/${productId}`, {
            method: 'DELETE',
            token,
        }),
}
