import {getApiErrorMessage} from "@/hooks/memberships/use-memberships";
import {toast} from "sonner";
import {ordersApi} from "@/lib/api/orders";
import {useMutation, useQueryClient} from "@tanstack/react-query";

function useCancelOrder() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
            ordersApi.cancelAsAdmin(id, reason),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["orders"] });
            queryClient.invalidateQueries({ queryKey: ["products"] });
            queryClient.invalidateQueries({ queryKey: ["my-orders"] });
            toast.success("Orden cancelada, el stock volvió al inventario");
        },
        onError: (error) => toast.error(getApiErrorMessage(error) ?? "No se pudo cancelar la orden"),
    });
}

export { useCancelOrder };