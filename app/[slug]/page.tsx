import { notFound } from "next/navigation";
import { getProductBySlug, getColorOptionsFromVariations, getSizeOptionsFromVariations, getProductVariations } from "@/lib/woocommerce";
import ProductPageFigma from "@/components/product/ProductPageFigma";
import { applyMapping } from "@/lib/mapping";

// Forzar revalidación cada 60 segundos para evitar productos desactualizados
export const revalidate = 60;

interface ProductPageProps {
    params: {
        slug: string;
    };
}

export async function generateMetadata(props: ProductPageProps) {
    const params = await props.params;
    const product = await getProductBySlug(params.slug);

    if (!product) {
        return {
            title: "Producto no encontrado - Saprix",
        };
    }

    return {
        title: `${product.name} - Saprix`,
        description: product.short_description || product.description || `Compra ${product.name} en Saprix`,
    };
}

export default async function ProductPage(props: ProductPageProps) {
    const params = await props.params;
    const product = await getProductBySlug(params.slug);

    if (!product) {
        notFound();
    }

    const [colorOptions, sizeOptions, variations] = await Promise.all([
        getColorOptionsFromVariations(product.id),
        getSizeOptionsFromVariations(product.id),
        getProductVariations(product.id),
    ]);

    const mappedProduct = applyMapping(product, [
        { id: "id", label: "id", source: "id", type: "any" },
        { id: "name", label: "name", source: "name", type: "any" },
        { id: "slug", label: "slug", source: "slug", type: "any" },
        { id: "price", label: "price", source: "price", type: "any" },
        { id: "regular_price", label: "regular_price", source: "regular_price", type: "any" },
        { id: "sale_price", label: "sale_price", source: "sale_price", type: "any" },
        { id: "description", label: "description", source: "description", type: "any" },
        { id: "short_description", label: "short_description", source: "short_description", type: "any" },
        { id: "images", label: "images", source: "images", type: "any" },
        { id: "categories", label: "categories", source: "categories", type: "any" },
        { id: "tags", label: "tags", source: "tags", type: "any" },
        { id: "attributes", label: "attributes", source: "attributes", type: "any" },
        { id: "stock_status", label: "stock_status", source: "stock_status", type: "any" },
        { id: "stock_quantity", label: "stock_quantity", source: "stock_quantity", type: "any" },
        { id: "type", label: "type", source: "type", type: "any" },
    ]);

    return (
        <ProductPageFigma
            mapped={mappedProduct}
            images={mappedProduct.images || []}
            colorOptions={colorOptions}
            sizeOptions={sizeOptions}
            variations={variations}
            slug={mappedProduct.slug}
        />
    );
}
