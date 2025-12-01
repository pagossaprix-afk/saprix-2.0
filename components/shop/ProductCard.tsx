import BaseProductCard from "@/components/product/ProductCard";

export type ProductSummary = {
  id: number;
  name: string;
  slug: string;
  price: string;
  sale_price?: string | null;
  image_url: string;
  is_new?: boolean;
};

// Re-export con props adaptadas al `ProductCard` existente
export function ProductCard({ product }: { product: ProductSummary }) {
  return (
    <BaseProductCard
      id={product.id}
      name={product.name}
      price={product.sale_price || product.price}
      imageUrl={product.image_url}
      slug={product.slug}
    />
  );
}