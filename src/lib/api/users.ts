import {PaginatedResponse, Stats, UpdateUserData, User} from "@/types";
import { apiClient } from "./client";
import {UpdateUserFormValues} from "@/common/schemas/user.schema";

export const usersApi = {
    getMe: (token: string) =>
        apiClient<User>('/users/me', { token }),



    updateMe: (data: UpdateUserData, token: string) =>
        apiClient<User>('/users/me', {
            method: 'PATCH',
            body: data,
            token,
        }),

    uploadMeImage: (file: File, token: string) => {
        const formData = new FormData();
        formData.append('file', file);

        return apiClient<User>('/users/me/image', {
            method: 'PATCH',
            body: formData,
            token,
        });
    },

    updateUser: (id: string, data: UpdateUserFormValues, token: string) =>
        apiClient<User>(`/users/${id}`, {
            method: 'PATCH',
            body: data,
            token,
        }),

    uploadUserImage: (id: string, file: File, token: string) => {
        const formData = new FormData();
        formData.append('file', file);

        return apiClient<User>(`/users/${id}/image`, {
            method: 'PATCH',
            body: formData,
            token,
        });
    },

    /**
     changePassword: (oldPassword: string, newPassword: string, token: string) =>
     apiClient<User>('/users/me/password', {
     method: 'PATCH',
     body: { oldPassword, newPassword },
     token,
     }), **/

    getAll: (token: string, page = 1, limit = 10, search?: string) => {
        const params = new URLSearchParams({
            page: String(page),
            limit: String(limit),
        });

        if (search) {
            params.set("search", search);
        }

        return apiClient<PaginatedResponse<User>>(`/users?${params.toString()}`, { token });
    },

    getStats: (token: string) =>
        apiClient<Stats>('/users/stats', { token }),

    getUserById: (id: string, token: string) =>
        apiClient<User>(`/users/${id}`, { token }),

    deleteUser: (id: string, token: string) =>
        apiClient<User>(`/users/${id}`, {
            method: 'DELETE',
            token,
        }),
}
