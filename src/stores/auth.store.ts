import { User } from "@/types";
import { createJSONStorage } from "zustand/middleware";
import { persist } from "zustand/middleware";
import { create } from "zustand/react";

interface AuthState {
    token: string | null;
    user: User | null;
    isAuthenticated: boolean;
    setAuth: (token: string, user: User) => void;
    updateUser: (user: User) => void;
    logout: () => void;
}

const cookieStorage = {
  getItem: (name: string) => {
    if (typeof document === 'undefined') return null;
    const cookies = document.cookie.split(';');
    const cookie = cookies.find((c) => c.trim().startsWith(`${name}=`));
    return cookie ? decodeURIComponent(cookie.split('=')[1]) : null;
  },
  setItem: (name: string, value: string) => {
    if (typeof document === 'undefined') return;
    document.cookie = `${name}=${encodeURIComponent(value)};path=/;max-age=${60 * 60 * 24 * 7}`; // 7 días
  },
  removeItem: (name: string) => {
    if (typeof document === 'undefined') return;
    document.cookie = `${name}=;path=/;max-age=0`;
  },
};


export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            token: null,
            user: null,
            isAuthenticated: false,

            setAuth: (token, user) => 
                set({ token, user, isAuthenticated: true }),

            updateUser: (user) => 
                set({ user }),

            logout: () => 
                set({ token: null, user: null, isAuthenticated: false }),
        }),
        {
            name: "auth-storage",
            storage: createJSONStorage(() => cookieStorage),
        },
    )
)