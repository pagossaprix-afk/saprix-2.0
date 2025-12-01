import Link from 'next/link';
import Image from 'next/image';
import { getProducts } from '@/lib/woocommerce';
import { getCategoryBySlug } from '@/lib/category-utils';
import { AddToCartButton } from '@/components/shop/AddToCartButton';
import ProductCard from '@/components/product/ProductCard';
import { ensureHttps } from '@/lib/utils';

export type SortValue = 'newest' | 'price-asc' | 'price-desc' | 'popular';

interface ProductGridNikeProps {
    searchParams: {
        categoria?: string;
        tag?: string;
        sort?: string;
        page?: string;
        [key: string]: string | string[] | undefined;
    };
}

export async function ProductGridNike({ searchParams }: ProductGridNikeProps) {
    // Helper to build pagination URLs preserving existing params (except page)
    const buildPaginationUrl = (newPage: number) => {
        const stringParams: Record<string, string> = {};
        Object.entries(searchParams).forEach(([key, value]) => {
            if (typeof value === 'string' && key !== 'page') {
                stringParams[key] = value;
            }
        });
        stringParams.page = newPage.toString();
        return `?${new URLSearchParams(stringParams).toString()}`;
    };

    // Resolve top‑level category ID if provided
    let categoryId: number | undefined;
    if (searchParams.categoria) {
        const cat = await getCategoryBySlug(searchParams.categoria as string);
        categoryId = cat?.id;
    }

    // Sort mapping
    const sortMapping: Record<string, { orderby: string; order: 'asc' | 'desc' }> = {
        newest: { orderby: 'date', order: 'desc' },
        'price-asc': { orderby: 'price', order: 'asc' },
        'price-desc': { orderby: 'price', order: 'desc' },
        popular: { orderby: 'popularity', order: 'desc' },
    };

    const sort = (searchParams.sort as string) || 'newest';
    const { orderby, order } = sortMapping[sort] || sortMapping.newest;
    const page = parseInt((searchParams.page as string) || '1');

    // Fetch products
    const { products, total, totalPages } = await getProducts({
        category: categoryId?.toString(),
        tag: searchParams.tag as string,
        page,
        perPage: 12,
        orderby,
        order,
    });

    if (products.length === 0) {
        return (
            <div className="text-center py-16">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    No hay productos disponibles
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                    Intenta ajustar los filtros o vuelve más tarde
                </p>
            </div>
        );
    }

    return (
        <div>
            {/* Sort Bar */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    {total} {total === 1 ? 'producto' : 'productos'}
                </p>
                <form method="get" className="flex items-center gap-2">
                    {Object.entries(searchParams).map(([key, value]) =>
                        key !== 'sort' && typeof value === 'string' ? (
                            <input key={key} type="hidden" name={key} value={value} />
                        ) : null
                    )}
                    <select
                        name="sort"
                        className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-saprix-electric-blue"
                        defaultValue={sort}
                    >
                        <option value="newest">Más recientes</option>
                        <option value="price-asc">Precio: Menor a Mayor</option>
                        <option value="price-desc">Precio: Mayor a Menor</option>
                        <option value="popular">Más populares</option>
                    </select>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-saprix-electric-blue text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                        Aplicar
                    </button>
                </form>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
                {products.map((product) => {
                    const price = parseFloat(product.price || '0');
                    const salePrice = product.sale_price ? parseFloat(product.sale_price) : null;
                    const regularPrice = product.regular_price ? parseFloat(product.regular_price) : price;

                    // Build hierarchical URL logic is now handled inside ProductCard, but we pass the data
                    let categorySlug = undefined;
                    let subcategorySlug = undefined;

                    if (product.categories && product.categories.length > 0) {
                        const subCat = product.categories[0];
                        // If we are in a specific category page (searchParams.categoria), use that as top level
                        // Otherwise try to guess or just use the subcategory as is (ProductCard handles fallback)
                        categorySlug = searchParams.categoria || 'productos';
                        subcategorySlug = subCat.slug;

                        // Refinement: If the product has multiple categories, we might want to find the parent.
                        // But for now, using the first one as subcategory and the current page param as category is a safe bet for navigation continuity.
                    }

                    return (
                        <div key={product.id} className="group">
                            <ProductCard
                                id={product.id}
                                name={product.name}
                                price={product.price || '0'}
                                imageUrl={product.images?.[0]?.src || ''}
                                slug={product.slug}
                                category={categorySlug}
                                subcategory={subcategorySlug}
                                images={product.images?.map(img => img.src) || []}
                            />
                        </div>
                    );
                })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="mt-12 flex items-center justify-center gap-2">
                    {page > 1 && (
                        <Link
                            href={buildPaginationUrl(page - 1)}
                            className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                            Anterior
                        </Link>
                    )}
                    <span className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
                        Página {page} de {totalPages}
                    </span>
                    {page < totalPages && (
                        <Link
                            href={buildPaginationUrl(page + 1)}
                            className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                            Siguiente
                        </Link>
                    )}
                </div>
            )}
        </div>
    );
}
