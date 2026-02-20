import "server-only";
import { WPPost, WPMedia, WPAuthor, WPCategory } from "@/types/wordpress";

const WP_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || "https://pagos.saprix.com.co";
const WP_API_USER = process.env.WORDPRESS_API_USER;
const WP_API_APP_PASSWORD = process.env.WORDPRESS_API_APP_PASSWORD;

/**
 * Cliente HTTP personalizado para WordPress API (wp/v2)
 * Maneja revalidación, autenticación opcional y errores.
 */
async function wpFetch<T>(endpoint: string, options: RequestInit = {}, revalidate = 600): Promise<T> {
    const url = `${WP_API_URL.replace(/\/$/, "")}/wp-json/wp/v2/${endpoint}`;

    const headers = new Headers(options.headers);
    if (WP_API_USER && WP_API_APP_PASSWORD) {
        const authString = Buffer.from(`${WP_API_USER}:${WP_API_APP_PASSWORD}`).toString("base64");
        headers.set("Authorization", `Basic ${authString}`);
    }
    if (!headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
    }

    const fetchOptions: RequestInit = {
        ...options,
        headers,
        next: revalidate !== undefined ? { revalidate } : undefined,
    };

    try {
        const res = await fetch(url, fetchOptions);

        if (!res.ok) {
            // Intentar leer el error del cuerpo si existe
            let errorBody = "";
            try {
                errorBody = await res.text();
            } catch { }
            throw new Error(`WordPress API Error (${res.status}): ${res.statusText} - ${errorBody}`);
        }

        return (await res.json()) as T;
    }
    catch (error) {
        console.error(`Error fetching ${url}:`, error);
        throw error;
    }
}

// --- LECTURA (GET) ---

export async function getPosts(params: {
    page?: number;
    per_page?: number;
    search?: string;
    categories?: number[];
} = {}): Promise<WPPost[]> {
    const query = new URLSearchParams();
    query.set("_embed", "true"); // Traer autor, media y categorías
    if (params.page) query.set("page", params.page.toString());
    if (params.per_page) query.set("per_page", params.per_page.toString());
    if (params.search) query.set("search", params.search);
    if (params.categories) query.set("categories", params.categories.join(","));

    return wpFetch<WPPost[]>(`posts?${query.toString()}`, { method: "GET" });
}

export async function getPostBySlug(slug: string): Promise<WPPost | null> {
    const posts = await wpFetch<WPPost[]>(`posts?slug=${slug}&_embed=true`, { method: "GET" });
    return posts.length > 0 ? posts[0] : null;
}

export async function getCategories(): Promise<WPCategory[]> {
    // Pedimos un número alto para traer todas (máx 100 por defecto en WP)
    return wpFetch<WPCategory[]>("categories?per_page=100&hide_empty=true", { method: "GET" }, 3600);
}

// --- ESCRITURA (POST) ---

/**
 * Crea un nuevo post en WordPress.
 * Requiere credenciales de administrador (Application Password).
 */
export async function createPost(data: {
    title: string;
    content: string;
    status?: "draft" | "publish" | "pending";
    categories?: number[];
    featured_media?: number;
    excerpt?: string;
}): Promise<WPPost> {
    return wpFetch<WPPost>("posts", {
        method: "POST",
        body: JSON.stringify(data),
    }, 0); // No cache para escritura
}

/**
 * Sube una imagen a la Biblioteca de Medios de WordPress.
 * Requiere credenciales de administrador.
 */
export async function uploadMedia(file: Blob, fileName: string, altText: string = ""): Promise<WPMedia> {
    const formData = new FormData();
    formData.append("file", file, fileName);
    formData.append("alt_text", altText);

    // Nota: wpFetch por defecto pone Content-Type: application/json.
    // Para FormData debemos dejar que el navegador/runtime ponga el boundary,
    // así que hacemos un fetch manual o modificamos wpFetch para aceptar FormData.
    // Aquí haremos un override manual en esta función para simplicidad.

    const url = `${WP_API_URL.replace(/\/$/, "")}/wp-json/wp/v2/media`;
    const headers = new Headers();
    if (WP_API_USER && WP_API_APP_PASSWORD) {
        const authString = Buffer.from(`${WP_API_USER}:${WP_API_APP_PASSWORD}`).toString("base64");
        headers.set("Authorization", `Basic ${authString}`);
    }
    // NO settear Content-Type para que fetch genere el multipart/form-data boundary

    const res = await fetch(url, {
        method: "POST",
        headers,
        body: formData,
    });

    if (!res.ok) {
        throw new Error(`Error subiendo imagen: ${res.status} ${res.statusText}`);
    }

    return (await res.json()) as WPMedia;
}
