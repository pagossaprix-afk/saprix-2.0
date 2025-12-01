import { NextResponse } from 'next/server';
import { getWooApi } from '@/lib/woocommerce';

export async function GET() {
    try {
        const api = getWooApi();

        // Intentamos buscar productos específicos como medias o balones, 
        // o simplemente traemos productos destacados/recientes.
        // Para este caso, traeremos productos de la categoría "Accesorios" si existe, 
        // o simplemente los últimos productos que sean baratos (como upsell).

        // Opción 1: Buscar por término "medias" o "balones"
        // Opción 2: Traer productos aleatorios/recientes.

        // Vamos a traer 8 productos recientes y en el frontend seleccionamos 4 aleatorios
        const response = await api.get("products", {
            per_page: 8,
            status: "publish",
            stock_status: "instock",
            // category: "accesorios" // Si supiéramos el ID de la categoría
        });

        if (response.status !== 200) {
            throw new Error(`Error en la API de WooCommerce: ${response.statusText}`);
        }

        const products = response.data.map((p: any) => ({
            id: p.id,
            name: p.name,
            price: parseInt(p.price || "0"),
            regular_price: parseInt(p.regular_price || "0"),
            image: p.images[0]?.src || '/placeholder.png',
            slug: p.slug,
            attributes: p.attributes,
            variations: p.variations
        }));

        return NextResponse.json({ products });

    } catch (error: any) {
        console.error("Error fetching recommended products:", error);
        return NextResponse.json(
            { error: error.message || "Error al obtener productos recomendados" },
            { status: 500 }
        );
    }
}
