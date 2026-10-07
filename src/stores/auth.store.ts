import { User } from "@/types";
import { createJSONStorage } from "zustand/middleware";
import { persist } from "zustand/middleware";
import { create } from "zustand/react";

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    // true cuando la sesión ya se leyó de la cookie (solo en el cliente)
    hasHydrated: boolean;
    setAuth: (user: User) => void;
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
    const secure = window.location.protocol === 'https:' ? ';Secure' : '';
    document.cookie = `${name}=${encodeURIComponent(value)};path=/;max-age=${60 * 60 * 24 * 7};SameSite=Lax${secure}`; // 7 días
  },
  removeItem: (name: string) => {
    if (typeof document === 'undefined') return;
    document.cookie = `${name}=;path=/;max-age=0;SameSite=Lax`;
  },
};


export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            hasHydrated: false,

            setAuth: (user) =>
                set({ user, isAuthenticated: true }),

            updateUser: (user) => 
                set({ user }),

            logout: () => 
                set({ user: null, isAuthenticated: false }),
        }),
        {
            name: "auth-storage",
            storage: createJSONStorage(() => cookieStorage),
            // El servidor no puede leer la cookie desde aquí: si el cliente la
            // leyera al crear el store, el primer render no coincidiría con el
            // HTML del servidor (error de hidratación). Se rehidrata en
            // AuthHydration, después del primer render.
            skipHydration: true,
            partialize: ({ user, isAuthenticated }) => ({ user, isAuthenticated }),
            onRehydrateStorage: () => () => {
                useAuthStore.setState({ hasHydrated: true });
            },
        },
    )
)