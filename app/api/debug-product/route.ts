import { NextResponse } from 'next/server';
import { getWooApi } from '@/lib/woocommerce';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

/**
 * Debug endpoint to check product slug mapping
 * Usage: /api/debug-product?slug=zapatilla-world-kids-negro-neon
 */
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const slug = searchParams.get('slug');

        if (!slug) {
            return NextResponse.json({ error: 'Missing slug parameter' }, { status: 400 });
        }

        // Get product by slug
        const api = getWooApi();
        const response = await api.get('products', {
            slug,
            per_page: 10, // Get multiple in case there are similar slugs
            status: 'publish',
        });

        const products = Array.isArray(response.data) ? response.data : [];

        if (products.length === 0) {
            return NextResponse.json({
                slug,
                found: false,
                message: 'No products found with this slug',
            });
        }

        // Return detailed information about the products found
        const productInfo = products.map((p: any) => ({
            id: p.id,
            name: p.name,
            slug: p.slug,
            price: p.price,
            regular_price: p.regular_price,
            sale_price: p.sale_price,
            categories: p.categories?.map((c: any) => ({ id: c.id, name: c.name, slug: c.slug })),
            images: p.images?.map((img: any) => ({
                id: img.id,
                src: img.src,
                name: img.name,
            })),
            attributes: p.attributes?.map((attr: any) => ({
                id: attr.id,
                name: attr.name,
                options: attr.options,
            })),
            variations: p.variations,
            stock_status: p.stock_status,
            permalink: p.permalink,
        }));

        return NextResponse.json({
            slug_searched: slug,
            products_found: products.length,
            exact_match: products.find((p: any) => p.slug === slug) ? true : false,
            products: productInfo,
        });

    } catch (error: any) {
        console.error('Debug product error:', error);
        return NextResponse.json(
            {
                error: 'Failed to debug product',
                message: error?.message || 'Unknown error',
            },
            { status: 500 }
        );
    }
}
