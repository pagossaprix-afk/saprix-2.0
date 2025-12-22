import { MetadataRoute } from 'next';
import { getProducts, getAllProductCategories } from '@/lib/woocommerce';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://saprix.com.co';

    // 1. Static Routes
    const staticRoutes = [
        '',
        '/tienda',
        '/blog',
        '/contacto',
        '/guia-tallas',
        '/preguntas-frecuentes',
        '/devoluciones',
        '/envios',
        '/terminos-y-condiciones',
        '/politica-de-privacidad',
        '/cookies',
        '/wishlist',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    // 2. Products from WooCommerce
    // We fetch a larger number to cover most products. If there are thousands, 
    // we might need pagination or multiple sitemaps, but 100 is a good start.
    let productRoutes: MetadataRoute.Sitemap = [];
    try {
        const { products } = await getProducts({ perPage: 100 });
        productRoutes = products.map((product) => ({
            url: `${baseUrl}/[slug]?slug=${product.slug}`, // Based on app structure [slug]
            // In a real scenario, we'd use the mapping or the actual route if different
            // If the app uses /productos/[slug], adjust accordingly.
            // Based on app structure, products seem to be at /[slug]
            url: `${baseUrl}/${product.slug}`,
            lastModified: new Date(product.date_modified || product.date_created),
            changeFrequency: 'weekly' as const,
            priority: 0.7,
        }));
    } catch (error) {
        console.error('Error fetching products for sitemap:', error);
    }

    // 3. Categories from WooCommerce
    let categoryRoutes: MetadataRoute.Sitemap = [];
    try {
        const categories = await getAllProductCategories();
        categoryRoutes = categories.map((category) => ({
            url: `${baseUrl}/tienda?category=${category.slug}`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.6,
        }));
    } catch (error) {
        console.error('Error fetching categories for sitemap:', error);
    }

    return [...staticRoutes, ...productRoutes, ...categoryRoutes];
}
