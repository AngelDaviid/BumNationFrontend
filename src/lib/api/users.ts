import { PaginatedResponse, UpdateUserData, User } from "@/types";
import { apiClient } from "./client";

export const usersApi = {
    getMe: (token: string) => 
        apiClient<User>('/users/me', { token }),

    updateMe: (data: UpdateUserData, token: string) =>
        apiClient<User>('/users/me', {
            method: 'PATCH',
            body: data,
            token,
        }),

    /**
    changePassword: (oldPassword: string, newPassword: string, token: string) =>
        apiClient<User>('/users/me/password', {
            method: 'PATCH',
            body: { oldPassword, newPassword },
            token,
        }), **/

    getAll:(token: string, page = 1, limit = 10) =>
        apiClient<PaginatedResponse<User>>(`/users?page=${page}&limit=${limit}`, { token }),

    deleteUser: (id: string, token: string) =>
        apiClient<User>(`/users/${id}`, {
            method: 'DELETE',
            token,
        }),
}