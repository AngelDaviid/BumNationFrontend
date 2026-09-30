import { MyOrderDetail } from "@/components/shop/orders/my-order-detail";

export default async function MyOrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:py-8">
      <MyOrderDetail orderId={id} />
    </div>
  );
}
