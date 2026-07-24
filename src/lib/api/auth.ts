import { RegisterData, User } from "@/types";
import { apiClient } from "./client";

interface AuthResponse {
    access_token: string;
    user: User;
}

export const authApi = {
    login: (identification: string, password: string) =>
        apiClient<AuthResponse>('auth/login', {
            method: 'POST',
            body: { identification, password },
        }),


    register: (data: RegisterData) =>
        apiClient<AuthResponse>('auth/register', {
            method: 'POST',
            body: data
        })
}