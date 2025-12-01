import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";

export const dynamic = "force-dynamic";

interface WooProduct {
    id: number;
    name: string;
    slug: string;
    price: string;
    regular_price: string;
    sale_price: string;
    images: Array<{ src: string; alt: string }>;
    categories: Array<{ id: number; name: string; slug: string }>;
    short_description: string;
    description: string;
    stock_status: string;
    stock_quantity: number | null;
}

export async function GET(req: Request) {
    try {
        const WORDPRESS_URL = "https://pagos.saprix.com.co";
        const CONSUMER_KEY = "ck_88721898d82f29e0f8664d7e3316aa460340f587";
        const CONSUMER_SECRET = "cs_37ebd5161dd1ed62e199570e702fb7d123454569";

        // Fetch all products from WooCommerce
        let allProducts: WooProduct[] = [];
        let page = 1;
        let hasMore = true;

        while (hasMore) {
            const url = `${WORDPRESS_URL}/wp-json/wc/v3/products?per_page=100&page=${page}&consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}`;

            try {
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    console.error(`Failed to fetch page ${page}:`, response.status, response.statusText);
                    break;
                }

                const products = await response.json();

                if (!Array.isArray(products) || products.length === 0) {
                    hasMore = false;
                    break;
                }

                allProducts = [...allProducts, ...products];
                page++;

                // Check if there are more pages
                const totalPages = response.headers.get('x-wp-totalpages');
                if (totalPages && page > parseInt(totalPages)) {
                    hasMore = false;
                }
            } catch (error) {
                console.error(`Error fetching page ${page}:`, error);
                hasMore = false;
            }
        }

        // Transform products to a simpler format for search
        const searchableProducts = allProducts.map(p => ({
            id: p.id,
            nombre: p.name,
            slug: p.slug,
            precio: p.price,
            precio_regular: p.regular_price,
            precio_oferta: p.sale_price,
            imagen: p.images?.[0]?.src || "/placeholder-image.png",
            categorias: p.categories?.map(c => ({ id: c.id, nombre: c.name, slug: c.slug })) || [],
            descripcion_corta: p.short_description || "",
            descripcion: p.description || "",
            en_stock: p.stock_status === "instock",
            cantidad_stock: p.stock_quantity,
            // Add searchable text for better matching
            texto_busqueda: `${p.name} ${p.categories?.map(c => c.name).join(' ')} ${p.short_description || ''}`
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, ""), // Remove accents
        }));

        // Save to file
        const filePath = join(process.cwd(), 'data', 'products-cache.json');
        await writeFile(filePath, JSON.stringify({
            products: searchableProducts,
            lastSync: new Date().toISOString(),
            totalProducts: searchableProducts.length
        }, null, 2));

        return NextResponse.json({
            success: true,
            message: `Successfully synced ${searchableProducts.length} products`,
            totalProducts: searchableProducts.length,
            lastSync: new Date().toISOString()
        });

    } catch (error: any) {
        console.error("Sync error:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Failed to sync products",
                message: error?.message || "Unknown error"
            },
            { status: 500 }
        );
    }
}
