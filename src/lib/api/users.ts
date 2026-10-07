import {PaginatedResponse, Stats, UpdateUserData, User} from "@/types";
import { apiClient } from "./client";
import {UpdateUserFormValues} from "@/common/schemas/user.schema";

export const usersApi = {
    getMe: () =>
        apiClient<User>('/users/me'),



    updateMe: (data: UpdateUserData) =>
        apiClient<User>('/users/me', {
            method: 'PATCH',
            body: data,
        }),

    uploadMeImage: (file: File) => {
        const formData = new FormData();
        formData.append('file', file);

        return apiClient<User>('/users/me/image', {
            method: 'PATCH',
            body: formData,
        });
    },

    updateUser: (id: string, data: UpdateUserFormValues) =>
        apiClient<User>(`/users/${id}`, {
            method: 'PATCH',
            body: data,
        }),

    uploadUserImage: (id: string, file: File) => {
        const formData = new FormData();
        formData.append('file', file);

        return apiClient<User>(`/users/${id}/image`, {
            method: 'PATCH',
            body: formData,
        });
    },

    /**
     changePassword: (oldPassword: string, newPassword: string) =>
     apiClient<User>('/users/me/password', {
     method: 'PATCH',
     body: { oldPassword, newPassword },
     }), **/

    getAll: (page = 1, limit = 10, search?: string) => {
        const params = new URLSearchParams({
            page: String(page),
            limit: String(limit),
        });

        if (search) {
            params.set("search", search);
        }

        return apiClient<PaginatedResponse<User>>(`/users?${params.toString()}`);
    },

    getStats: () =>
        apiClient<Stats>('/users/stats'),

    getUserById: (id: string) =>
        apiClient<User>(`/users/${id}`),

    deleteUser: (id: string) =>
        apiClient<User>(`/users/${id}`, { method: 'DELETE' }),
}
