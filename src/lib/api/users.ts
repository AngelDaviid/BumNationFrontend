import { AdminUpdateUserData, PaginatedResponse, RegisterData, UpdateUserData, User } from "@/types";
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

    getById: (id: string, token: string) =>
        apiClient<User>(`/users/${id}`, { token }),

    create: (data: RegisterData, token: string) =>
        apiClient<User>('/users', {
            method: 'POST',
            body: data,
            token,
        }),

    update: (id: string, data: AdminUpdateUserData, token: string) =>
        apiClient<User>(`/users/${id}`, {
            method: 'PATCH',
            body: data,
            token,
        }),

    deleteUser: (id: string, token: string) =>
        apiClient<User>(`/users/${id}`, {
            method: 'DELETE',
            token,
        }),
}