import { getProductBySlug, getAllProductCategories } from '@/lib/woocommerce-edge';

/**
 * Helper to fetch a product by slug and return the full path:
 * /productos/:category/:subcategory/:slug
 */
export async function getProductRedirectPath(slug: string): Promise<string> {
    try {
        const product = await getProductBySlug(slug);

        if (!product || !product.categories || product.categories.length === 0) {
            return `/productos/general/general/${slug}`;
        }

        // 1. Try to find a subcategory (category with a parent)
        const subCat = product.categories.find(c => c.parent !== 0);

        if (subCat) {
            // Try to find parent in the product's categories first
            let parentCat = product.categories.find(c => c.id === subCat.parent);

            // If not found, fetch all categories to find the parent
            if (!parentCat) {
                const allCats = await getAllProductCategories();
                parentCat = allCats.find(c => c.id === subCat.parent);
            }

            if (parentCat) {
                return `/productos/${parentCat.slug}/${subCat.slug}/${slug}`;
            }
        }

        // 2. If no subcategory or parent not found, use the first category
        // and duplicate it as subcategory (or use it as both if it's a root)
        const firstCat = product.categories[0];
        return `/productos/${firstCat.slug}/${firstCat.slug}/${slug}`;
    } catch (e) {
        console.error('Error fetching product for redirect:', e);
        return `/productos/general/general/${slug}`;
    }
}

// Deprecated but kept for compatibility if needed
export async function getProductCategorySlug(slug: string): Promise<string> {
    const path = await getProductRedirectPath(slug);
    const parts = path.split('/');
    // path is /productos/cat/sub/slug -> parts[2] is cat
    return parts[2] || 'general';
}
