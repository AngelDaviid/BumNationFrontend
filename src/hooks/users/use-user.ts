import { usersApi } from "@/lib/api/users";
import { useAuthStore } from "@/stores/auth.store";
import { useQuery } from "@tanstack/react-query";

const useUser = (id: string) => {
    const { token } = useAuthStore();

    return useQuery({
        queryKey: ['users', id],
        queryFn: () => usersApi.getUserById(id, token!),
        enabled: !!token && !!id,
    })
}

export { useUser }