import { usersApi } from "@/lib/api/users";
import { useAuthStore } from "@/stores/auth.store";
import { useEffect } from "react";

export const useSessionSync = () => {
  useEffect(() => {
    const syncSession = async () => {
      await useAuthStore.persist.rehydrate();

      const { isAuthenticated, updateUser, logout } = useAuthStore.getState();
      if (!isAuthenticated) return;

      try {
        updateUser(await usersApi.getMe());
      } catch (error) {
        if ((error as { statusCode?: number })?.statusCode === 401) {
          logout();
        }
      }
    };

    void syncSession();
  }, []);
};
