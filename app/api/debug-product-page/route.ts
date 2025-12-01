import { NextResponse } from 'next/server';
import { getProductBySlug, getColorOptionsFromVariations, getSizeOptionsFromVariations } from '@/lib/woocommerce';
import { applyMapping } from '@/lib/mapping';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * Debug endpoint que simula EXACTAMENTE lo que hace la página de producto
 * Usage: /api/debug-product-page?slug=zapatilla-world-kids-negro-neon
 */
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const slug = searchParams.get('slug');

        if (!slug) {
            return NextResponse.json({ error: 'Missing slug parameter' }, { status: 400 });
        }

        console.log(`\n========== DEBUG PRODUCT PAGE ==========`);
        console.log(`Slug requested: ${slug}`);

        // PASO 1: Obtener producto por slug (igual que la página)
        console.log(`\nPASO 1: Llamando getProductBySlug("${slug}")...`);
        const product = await getProductBySlug(slug);

        if (!product) {
            console.log(`ERROR: Producto no encontrado`);
            return NextResponse.json({
                step: 1,
                error: 'Product not found',
                slug,
            });
        }

        console.log(`✓ Producto encontrado:`);
        console.log(`  - ID: ${product.id}`);
        console.log(`  - Name: ${product.name}`);
        console.log(`  - Price: ${product.price}`);
        console.log(`  - Images: ${product.images?.length || 0}`);

        // PASO 2: Obtener variaciones
        console.log(`\nPASO 2: Obteniendo variaciones para producto ID ${product.id}...`);
        const [colorOptions, sizeOptions] = await Promise.all([
            getColorOptionsFromVariations(product.id),
            getSizeOptionsFromVariations(product.id),
        ]);

        console.log(`✓ Variaciones obtenidas:`);
        console.log(`  - Colores: ${colorOptions.length}`);
        console.log(`  - Tallas: ${sizeOptions.length}`);

        // PASO 3: Aplicar mapping (igual que la página)
        console.log(`\nPASO 3: Aplicando mapping...`);
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
            { id: "variations", label: "variations", source: "variations", type: "any" },
            { id: "stock_status", label: "stock_status", source: "stock_status", type: "any" },
            { id: "stock_quantity", label: "stock_quantity", source: "stock_quantity", type: "any" },
        ]);

        console.log(`✓ Mapping aplicado:`);
        console.log(`  - Mapped ID: ${mappedProduct.id}`);
        console.log(`  - Mapped Name: ${mappedProduct.name}`);
        console.log(`  - Mapped Price: ${mappedProduct.price}`);
        console.log(`  - Mapped Images: ${mappedProduct.images?.length || 0}`);
        console.log(`  - Mapped Slug: ${mappedProduct.slug}`);

        console.log(`\n========================================\n`);

        // Retornar toda la data que se pasa al componente
        return NextResponse.json({
            success: true,
            slug_requested: slug,
            raw_product: {
                id: product.id,
                name: product.name,
                slug: product.slug,
                price: product.price,
                images: product.images?.map(img => ({ src: img.src, alt: img.alt })),
            },
            mapped_product: {
                id: mappedProduct.id,
                name: mappedProduct.name,
                slug: mappedProduct.slug,
                price: mappedProduct.price,
                images: mappedProduct.images,
                categories: mappedProduct.categories,
                variations: mappedProduct.variations,
            },
            color_options: colorOptions,
            size_options: sizeOptions,
            props_sent_to_component: {
                mapped: mappedProduct,
                images: mappedProduct.images || [],
                colorOptions,
                sizeOptions,
                variations: mappedProduct.variations || [],
                slug: mappedProduct.slug,
            }
        });

    } catch (error: any) {
        console.error('Debug product page error:', error);
        return NextResponse.json(
            {
                error: 'Failed to debug product page',
                message: error?.message || 'Unknown error',
                stack: error?.stack,
            },
            { status: 500 }
        );
    }
}
