import { Favorite } from "@/types";
import { apiClient } from "./client";

export const favoritesApi = {
    getAll: () =>
        apiClient<Favorite[]>(`/favorites`),

    check: (productId: number) =>
        apiClient<{ isFavorite: boolean }>(`/favorites/${productId}/check`),

    add: (productId: number) =>
        apiClient<Favorite>(`/favorites`, {
            method: 'POST',
            body: { productId },
        }),

    remove: (productId: number) =>
        apiClient<Favorite>(`/favorites/${productId}`, { method: 'DELETE' }),
}
