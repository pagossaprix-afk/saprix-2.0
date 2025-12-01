import { Category } from '@/types/woocommerce';

/**
 * Obtiene la jerarquía completa de categorías de WooCommerce
 */
export async function getCategoryHierarchy(): Promise<CategoryNode[]> {
    const categories = await getAllCategories();
    return buildCategoryTree(categories);
}

/**
 * Construye un árbol de categorías a partir de una lista plana
 */
function buildCategoryTree(categories: Category[]): CategoryNode[] {
    const categoryMap = new Map<number, CategoryNode>();
    const rootCategories: CategoryNode[] = [];

    // Crear nodos para todas las categorías
    categories.forEach(cat => {
        categoryMap.set(cat.id, {
            id: cat.id,
            name: cat.name,
            slug: cat.slug,
            parent: cat.parent,
            count: cat.count || 0,
            children: []
        });
    });

    // Construir el árbol
    categories.forEach(cat => {
        const node = categoryMap.get(cat.id)!;
        if (cat.parent === 0) {
            rootCategories.push(node);
        } else {
            const parent = categoryMap.get(cat.parent);
            if (parent) {
                parent.children.push(node);
            }
        }
    });

    return rootCategories;
}

/**
 * Genera la ruta jerárquica para un producto basado en sus categorías
 */
export function getCategoryPath(product: any): string {
    if (!product.categories || product.categories.length === 0) {
        return `/productos/${product.slug}`;
    }

    // Buscar la categoría más específica (la que tiene parent)
    const specificCategory = product.categories.find((cat: any) => cat.parent !== 0) || product.categories[0];

    // TODO: Implementar lógica para obtener la ruta completa de la categoría
    // Por ahora, retornamos una ruta simple
    return `/productos/${specificCategory.slug}/${product.slug}`;
}

/**
 * Obtiene una categoría por su slug
 */
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
    const categories = await getAllCategories();
    return categories.find(cat => cat.slug === slug) || null;
}

/**
 * Obtiene productos filtrados por categoría
 */
export async function getProductsByCategory(categorySlug: string, params: {
    page?: number;
    perPage?: number;
    orderby?: string;
    order?: 'asc' | 'desc';
} = {}): Promise<any[]> {
    const category = await getCategoryBySlug(categorySlug);
    if (!category) return [];

    // Usar la función existente de woocommerce.ts
    const { getWooApi } = await import('./woocommerce');
    const api = getWooApi();

    const response = await api.get('products', {
        category: category.id,
        per_page: params.perPage || 20,
        page: params.page || 1,
        orderby: params.orderby || 'date',
        order: params.order || 'desc',
        status: 'publish'
    });

    return response.data;
}

/**
 * Obtiene todas las categorías de WooCommerce
 */
async function getAllCategories(): Promise<Category[]> {
    const { getWooApi } = await import('./woocommerce');
    const api = getWooApi();

    const response = await api.get('products/categories', {
        per_page: 100,
        orderby: 'name',
        order: 'asc'
    });

    return response.data;
}

/**
 * Genera breadcrumbs para una categoría
 */
export async function getCategoryBreadcrumbs(categorySlug: string): Promise<Breadcrumb[]> {
    const categories = await getAllCategories();
    const category = categories.find(cat => cat.slug === categorySlug);

    if (!category) return [];

    const breadcrumbs: Breadcrumb[] = [
        { name: 'Inicio', href: '/' },
        { name: 'Productos', href: '/productos' }
    ];

    // Construir breadcrumbs jerárquicos
    const buildPath = (cat: Category): void => {
        if (cat.parent !== 0) {
            const parent = categories.find(c => c.id === cat.parent);
            if (parent) {
                buildPath(parent);
            }
        }
        breadcrumbs.push({
            name: cat.name,
            href: `/productos/${cat.slug}`
        });
    };

    buildPath(category);
    return breadcrumbs;
}

// Types
export interface CategoryNode {
    id: number;
    name: string;
    slug: string;
    parent: number;
    count: number;
    children: CategoryNode[];
}

export interface Breadcrumb {
    name: string;
    href: string;
}
