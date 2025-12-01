// En lib/woocommerce.ts
import "server-only";

import API from "@woocommerce/woocommerce-rest-api";
import type {
  Variation,
  Product,
  Category,
  Tag,
  ProductAttribute,
  AttributeTerm,
  AttributeWithTerms
} from "@/types/woocommerce";

let _api: API | null = null;

export function getWooApi(): API {
  if (_api) return _api;

  const url = process.env.WOOCOMMERCE_API_URL || process.env.NEXT_PUBLIC_WORDPRESS_URL || "https://pagos.saprix.com.co";
  const consumerKey = process.env.WOOCOMMERCE_CONSUMER_KEY || "";
  const consumerSecret = process.env.WOOCOMMERCE_CONSUMER_SECRET || "";

  _api = new API({ url, consumerKey, consumerSecret, version: "wc/v3" });
  return _api;
}

/**
 * Obtiene las variaciones de un producto por su ID.
 */
export async function getProductVariations(productId: number): Promise<Variation[]> {
  try {
    const response = await getWooApi().get(`products/${productId}/variations`, {
      per_page: 100,
    });

    if (response.status !== 200) {
      throw new Error(`Error en la API: ${response.statusText}`);
    }

    const data = response.data ?? [];
    return data as Variation[];
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error(`Error obteniendo variaciones para producto ${productId}:`, errMsg);
    return [];
  }
}

// Traer producto por slug (primer resultado)
// Revalidación desactivada (0) para evitar problemas de caché persistente y desincronización
export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const response = await wcFetchRaw<Product[]>("products", { slug, per_page: 1 }, 0);
    const items = response.data ?? [];
    if (Array.isArray(items) && items.length > 0) {
      return items[0];
    }
    return null;
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error(`Error obteniendo producto por slug ${slug}:`, errMsg);
    return null;
  }
}


// Traer el producto más reciente (fallback para la página de referencia)
export async function getLatestProduct(): Promise<Product | null> {
  try {
    const response = await getWooApi().get("products", { per_page: 1, order: "desc", orderby: "date" });
    const items = response.data ?? [];
    if (Array.isArray(items) && items.length > 0) {
      return items[0] as Product;
    }
    return null;
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error("Error obteniendo el producto más reciente:", errMsg);
    return null;
  }
}

// Helper: obtener URL de imagen de la librería de medios de WordPress por ID
async function getMediaSourceUrl(mediaId: number): Promise<string | undefined> {
  try {
    const base = process.env.WOOCOMMERCE_API_URL || "";
    if (!base) return undefined;
    const url = `${base.replace(/\/$/, "")}/wp-json/wp/v2/media/${mediaId}`;
    const res = await fetch(url);
    if (!res.ok) return undefined;
    const j = await res.json();
    return j?.source_url || undefined;
  } catch {
    return undefined;
  }
}

/**
 * Extrae opciones de color directamente de las variaciones del producto.
 */
export async function getColorOptionsFromVariations(productId: number): Promise<Array<{ option: string; variations: number[]; image?: string }>> {
  const variations = await getProductVariations(productId);
  const byColor: Record<string, { option: string; variations: number[]; image?: string }> = {};

  for (const v of variations) {
    const attrs = Array.isArray(v.attributes) ? v.attributes : [];
    const colorAttr = attrs.find((a) => {
      const slug = (a.slug || a.name || "").toString().toLowerCase();
      return slug.includes("color") || slug.includes("pa_color");
    });

    const option = colorAttr?.option;
    if (!option) continue;

    const key = option.toString();
    if (!byColor[key]) {
      byColor[key] = { option: key, variations: [], image: v.image?.src || undefined };
    }

    byColor[key].variations.push(v.id);

    // Preferir imagen de la variación
    if (!byColor[key].image && v.image?.src) {
      byColor[key].image = v.image.src;
    }

    // Soporte para plugins de galería de variaciones vía meta_data
    if (!byColor[key].image && Array.isArray(v.meta_data)) {
      const galleryMeta = v.meta_data?.find((m) => ["woo_variation_gallery_images", "rtwpvg_images"].includes(m.key));
      const ids: number[] = Array.isArray(galleryMeta?.value)
        ? (galleryMeta!.value as unknown[]).map((x) => Number(x)).filter((n: number) => Number.isFinite(n))
        : [];

      if (ids.length > 0) {
        const src = await getMediaSourceUrl(ids[0]);
        if (src) byColor[key].image = src;
      }
    }
  }
  return Object.values(byColor);
}

/**
 * Extrae opciones de talla directamente de las variaciones del producto.
 */
export async function getSizeOptionsFromVariations(productId: number): Promise<Array<{ option: string; variations: number[] }>> {
  const variations = await getProductVariations(productId);
  const bySize: Record<string, { option: string; variations: number[] }> = {};

  for (const v of variations) {
    const attrs = Array.isArray(v.attributes) ? v.attributes : [];
    const sizeAttr = attrs.find((a) => {
      const slug = (a.slug || a.name || "").toString().toLowerCase();
      return slug.includes("talla") || slug.includes("size") || slug.includes("pa_talla");
    });

    const option = sizeAttr?.option;
    if (!option) continue;

    const key = option.toString();
    if (!bySize[key]) {
      bySize[key] = { option: key, variations: [] };
    }
    bySize[key].variations.push(v.id);
  }
  return Object.values(bySize);
}

// -------- Catálogo global: categorías, etiquetas y atributos --------

function buildUrl(endpoint: string, params: Record<string, unknown> = {}): string {
  const base = (process.env.WOOCOMMERCE_API_URL || process.env.NEXT_PUBLIC_WORDPRESS_URL || "https://pagos.saprix.com.co").replace(/\/$/, "");
  const ck = process.env.WOOCOMMERCE_CONSUMER_KEY || "";
  const cs = process.env.WOOCOMMERCE_CONSUMER_SECRET || "";
  const url = new URL(`${base}/wp-json/wc/v3/${endpoint}`);

  Object.entries(params || {}).forEach(([k, v]) => {
    if (v === undefined || v === null) return;
    url.searchParams.set(k, String(v));
  });

  url.searchParams.set("consumer_key", ck);
  url.searchParams.set("consumer_secret", cs);
  return url.toString();
}

export async function wcFetchRaw<T>(endpoint: string, params: Record<string, unknown> = {}, revalidate = 600): Promise<{ data: T; headers: Headers }> {
  const url = buildUrl(endpoint, params);

  const fetchOptions: RequestInit = {};
  if (revalidate === 0) {
    fetchOptions.cache = 'no-store';
  } else {
    fetchOptions.next = { revalidate };
  }

  const res = await fetch(url, fetchOptions);
  if (!res.ok) {
    const msg = `WooCommerce fetch failed: ${res.status} ${res.statusText}`;
    if (res.status === 401 || res.status === 403) {
      console.warn(`${msg}. Verifica WOOCOMMERCE_API_URL, WOOCOMMERCE_CONSUMER_KEY y WOOCOMMERCE_CONSUMER_SECRET.`);
      return { data: [] as unknown as T, headers: res.headers };
    }
    throw new Error(msg);
  }
  const data = (await res.json()) as T;
  return { data, headers: res.headers };
}

async function wcFetchAll<T>(endpoint: string, params: Record<string, unknown> = {}, revalidate = 600): Promise<T[]> {
  const first = await wcFetchRaw<T[]>(endpoint, { ...params, page: 1 }, revalidate);
  const totalPages = parseInt(first.headers.get("x-wp-totalpages") || "1");
  const all: T[] = Array.isArray(first.data) ? [...first.data] : [];

  for (let page = 2; page <= totalPages; page++) {
    const resp = await wcFetchRaw<T[]>(endpoint, { ...params, page }, revalidate);
    if (Array.isArray(resp.data)) all.push(...resp.data);
  }
  return all;
}

export async function getAllProductCategories(): Promise<Category[]> {
  try {
    return await wcFetchAll<Category>("products/categories", { per_page: 100 }, 600);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export async function getAllProductTags(): Promise<Tag[]> {
  try {
    return await wcFetchAll<Tag>("products/tags", { per_page: 100 }, 600);
  } catch (error) {
    console.error("Error fetching tags:", error);
    return [];
  }
}

export async function getAllProductAttributes(): Promise<ProductAttribute[]> {
  try {
    return await wcFetchAll<ProductAttribute>("products/attributes", { per_page: 100 }, 600);
  } catch (error) {
    console.error("Error fetching attributes:", error);
    return [];
  }
}

export async function getAttributeTerms(attributeId: number): Promise<AttributeTerm[]> {
  try {
    return await wcFetchAll<AttributeTerm>(`products/attributes/${attributeId}/terms`, { per_page: 100 }, 600);
  } catch (error) {
    console.error(`Error fetching terms for attribute ${attributeId}:`, error);
    return [];
  }
}

export async function getAllProductAttributesWithTerms(): Promise<AttributeWithTerms[]> {
  try {
    const attrs = await getAllProductAttributes();
    const termsList = await Promise.all((attrs || []).map((a) => getAttributeTerms(Number(a.id))));
    return attrs.map((a, idx) => ({ attribute: a, terms: termsList[idx] || [] }));
  } catch (error) {
    console.error("Error fetching attributes with terms:", error);
    return [];
  }
}

export async function getShopSidebarData(): Promise<{
  categories: Category[];
  tags: Tag[];
  attributes: AttributeWithTerms[];
}> {
  const [categories, tags, attributes] = await Promise.all([
    getAllProductCategories(),
    getAllProductTags(),
    getAllProductAttributesWithTerms(),
  ]);
  return { categories, tags, attributes };
}

/**
 * Obtiene productos con filtros, paginación y ordenamiento
 */
export async function getProducts(params: {
  category?: string;
  tag?: string;
  page?: number;
  perPage?: number;
  orderby?: string;
  order?: 'asc' | 'desc';
  search?: string;
} = {}): Promise<{ products: Product[]; total: number; totalPages: number }> {
  try {
    const {
      category,
      tag,
      page = 1,
      perPage = 20,
      orderby = 'date',
      order = 'desc',
      search,
    } = params;

    const queryParams: any = {
      per_page: perPage,
      page,
      orderby,
      order,
      status: 'publish',
    };

    if (category) {
      queryParams.category = category;
    }

    if (tag) {
      queryParams.tag = tag;
    }

    if (search) {
      queryParams.search = search;
    }

    const response = await getWooApi().get('products', queryParams);

    const products = (response.data ?? []) as Product[];
    const total = parseInt(response.headers?.['x-wp-total'] || '0');
    const totalPages = parseInt(response.headers?.['x-wp-totalpages'] || '1');

    return { products, total, totalPages };
  } catch (error) {
    console.error('Error fetching products:', error);
    return { products: [], total: 0, totalPages: 0 };
  }
}


