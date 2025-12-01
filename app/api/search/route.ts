import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export const revalidate = 0;
export const dynamic = "force-dynamic";

interface CachedProduct {
  id: number;
  nombre: string;
  slug: string;
  precio: string;
  precio_regular: string;
  precio_oferta: string;
  imagen: string;
  categorias: Array<{ id: number; nombre: string; slug: string }>;
  descripcion_corta: string;
  descripcion: string;
  en_stock: boolean;
  cantidad_stock: number | null;
  texto_busqueda: string;
}

interface ProductCache {
  products: CachedProduct[];
  lastSync: string;
  totalProducts: number;
}

// Simple fuzzy search function
function fuzzyMatch(text: string, query: string): number {
  const textLower = text.toLowerCase();
  const queryLower = query.toLowerCase();

  // Exact match gets highest score
  if (textLower.includes(queryLower)) {
    return 100;
  }

  // Check if all query words are in text
  const queryWords = queryLower.split(/\s+/);
  const matchedWords = queryWords.filter(word => textLower.includes(word));

  if (matchedWords.length === queryWords.length) {
    return 80;
  }

  // Partial match
  if (matchedWords.length > 0) {
    return (matchedWords.length / queryWords.length) * 60;
  }

  // Character-by-character fuzzy matching
  let score = 0;
  let queryIndex = 0;

  for (let i = 0; i < textLower.length && queryIndex < queryLower.length; i++) {
    if (textLower[i] === queryLower[queryIndex]) {
      score++;
      queryIndex++;
    }
  }

  return (score / queryLower.length) * 40;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get("q") || "").trim();
    const per_page = Math.min(Math.max(parseInt(searchParams.get("per_page") || "6"), 1), 20);

    if (!q) {
      return NextResponse.json({ productos: [], categorias: [], paginas: [] });
    }

    // Read from cache file
    const filePath = join(process.cwd(), 'data', 'products-cache.json');

    if (!existsSync(filePath)) {
      console.log("Cache file not found. Triggering initial sync...");

      // Trigger sync in background (don't wait for it)
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001';
      fetch(`${baseUrl}/api/sync-products`).catch(err =>
        console.error("Background sync failed:", err)
      );

      return NextResponse.json({
        productos: [],
        categorias: [],
        paginas: [],
        message: "Initializing product cache. Please try again in a few moments."
      });
    }

    const fileContent = await readFile(filePath, 'utf-8');
    const cache: ProductCache = JSON.parse(fileContent);

    // Check if cache is older than 24 hours
    const cacheAge = Date.now() - new Date(cache.lastSync).getTime();
    const twentyFourHours = 24 * 60 * 60 * 1000;

    if (cacheAge > twentyFourHours) {
      console.log("Cache is older than 24 hours. Triggering background sync...");

      // Trigger sync in background (don't wait for it)
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001';
      fetch(`${baseUrl}/api/sync-products`).catch(err =>
        console.error("Background sync failed:", err)
      );
    }

    // Normalize search query
    const normalizedQuery = q
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, ""); // Remove accents

    // Search products with fuzzy matching
    const scoredProducts = cache.products.map(product => ({
      ...product,
      score: fuzzyMatch(product.texto_busqueda, normalizedQuery)
    }));

    // Filter and sort by score
    const matchedProducts = scoredProducts
      .filter(p => p.score > 20) // Only include products with decent match
      .sort((a, b) => b.score - a.score)
      .slice(0, per_page);

    // Transform to API format
    const productos = matchedProducts.map(p => ({
      id: p.id,
      nombre: p.nombre,
      slug: p.slug,
      precio: p.precio,
      imagen: p.imagen,
    }));

    // Get unique categories from matched products
    const categorias = Array.from(
      new Map(
        matchedProducts
          .flatMap(p => p.categorias)
          .map(c => [c.slug, { nombre: c.nombre, slug: c.slug, count: 0 }])
      ).values()
    ).slice(0, 8);

    // Static pages search
    const paginasFuente = [
      { nombre: "Inicio", href: "/" },
      { nombre: "Tienda", href: "/productos" },
      { nombre: "Blog", href: "/blog" },
      { nombre: "Contacto", href: "/contacto" },
    ];
    const qLower = q.toLowerCase();
    const paginas = paginasFuente.filter((p) => p.nombre.toLowerCase().includes(qLower)).slice(0, 6);

    return NextResponse.json({
      productos,
      categorias,
      paginas,
      totalResults: matchedProducts.length,
      cacheInfo: {
        lastSync: cache.lastSync,
        totalProducts: cache.totalProducts
      }
    });

  } catch (error: any) {
    console.error("Search API error:", error);
    return NextResponse.json({
      productos: [],
      categorias: [],
      paginas: [],
      error: error?.message || "Search failed"
    });
  }
}
