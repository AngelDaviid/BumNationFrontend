import { ProductDetail } from "@/components/shop/product-detail";

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:py-8">
      <ProductDetail productId={Number(id)} />
    </div>
  );
}
