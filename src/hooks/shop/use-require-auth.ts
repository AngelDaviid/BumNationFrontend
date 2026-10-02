import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/auth.store";


export function useRequireAuth() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (message = "Inicia sesión para continuar") => {
    if (isAuthenticated) return true;
    toast.info(message);
    router.push("/login");
    return false;
  };
}
