import { authApi } from "@/lib/api/auth";
import { useAuthStore } from "@/stores/auth.store";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const clearSession = useAuthStore((state) => state.logout);

  return async () => {
    try {
      await authApi.logout();
    } finally {
      clearSession();
      queryClient.clear();
      router.push("/login");
      router.refresh();
    }
  };
};
