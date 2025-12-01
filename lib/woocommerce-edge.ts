import type { Category, Product } from "@/types/woocommerce";

function buildUrl(endpoint: string, params: Record<string, unknown> = {}): string {
    // TEMP: Hardcoded fallback for localhost development due to .env file corruption issues
    const LOCALHOST_URL = "https://pagos.saprix.com.co";
    const LOCALHOST_CK = "ck_88721898d82f29e0f8664d7e3316aa460340f587";
    const LOCALHOST_CS = "cs_37ebd5161dd1ed62e199570e702fb7d123454569";

    const base = (process.env.NEXT_PUBLIC_WORDPRESS_URL || LOCALHOST_URL).replace(/\/$/, "");
    const ck = process.env.WOOCOMMERCE_CONSUMER_KEY || LOCALHOST_CK;
    const cs = process.env.WOOCOMMERCE_CONSUMER_SECRET || LOCALHOST_CS;

    // Validate that we have a proper URL
    if (!base || base.trim() === "") {
        throw new Error("WooCommerce URL is not configured. Please set NEXT_PUBLIC_WORDPRESS_URL environment variable.");
    }

    const url = new URL(`${base}/wp-json/wc/v3/${endpoint}`);

    Object.entries(params || {}).forEach(([k, v]) => {
        if (v === undefined || v === null) return;
        url.searchParams.set(k, String(v));
    });

    url.searchParams.set("consumer_key", ck);
    url.searchParams.set("consumer_secret", cs);
    return url.toString();
}

async function wcFetchRaw<T>(endpoint: string, params: Record<string, unknown> = {}, revalidate = 600): Promise<{ data: T; headers: Headers }> {
    try {
        const url = buildUrl(endpoint, params);
        const res = await fetch(url, { next: { revalidate } });
        if (!res.ok) {
            throw new Error(`WooCommerce fetch failed: ${res.status} ${res.statusText}`);
        }
        const data = (await res.json()) as T;
        return { data, headers: res.headers };
    } catch (error) {
        console.error(`Failed to fetch from WooCommerce endpoint "${endpoint}":`, error);
        throw error;
    }
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

export async function getProductBySlug(slug: string): Promise<Product | null> {
    try {
        // Revalidación reducida a 60 segundos para productos individuales
        const response = await wcFetchRaw<Product[]>("products", { slug, per_page: 1 }, 60);
        const items = response.data ?? [];
        if (Array.isArray(items) && items.length > 0) {
            return items[0];
        }
        return null;
    } catch (error: unknown) {
        const errMsg = error instanceof Error ? error.message : String(error);
        console.error(`Error obtaining product by slug ${slug}:`, errMsg);
        return null;
    }
}

// Edge‑compatible wrapper used by middleware and API routes
export function getWooApi() {
    return {
        get: async (endpoint: string, params: Record<string, any> = {}) => {
            const { data, headers } = await wcFetchRaw<any>(endpoint, params);
            return { data, headers };
        }
    };
}
