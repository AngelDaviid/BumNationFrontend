import {useAuthStore} from "@/stores/auth.store";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {OrderStatus} from "@/types";
import {ordersApi} from "@/lib/api/orders";
import {toast} from "sonner";
import {getApiErrorMessage} from "@/hooks/memberships/use-memberships";

function useUpdateOrderStatus() {
    const { token } = useAuthStore();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
            ordersApi.updateStatus(id, status, token!),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["orders"] });
            queryClient.invalidateQueries({ queryKey: ["my-orders"] });
            toast.success("Estado de la orden actualizado");
        },
        onError: (error) => toast.error(getApiErrorMessage(error) ?? "No se pudo cambiar el estado de la orden"),
    });
}

export { useUpdateOrderStatus };