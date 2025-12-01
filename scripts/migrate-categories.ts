/**
 * Script de Migración de Categorías de WooCommerce
 * 
 * Reorganiza la estructura de categorías a:
 * - Zapatillas
 *   - World (Berlin, Kids, Londres, Roma, Tokio)
 *   - Nacionales (Clásicas Sala, PE, Wonder)
 * - Ropa Deportiva
 *   - Medias Futsal (Clásicas, Pernera, Técnica)
 * - Accesorios
 *   - Balones Futsal, Guayeras, Maletas
 * 
 * USO:
 * npx tsx scripts/migrate-categories.ts
 */

import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";

// Hardcoded credentials (same as lib/woocommerce.ts)
const LOCALHOST_URL = "https://pagos.saprix.com.co";
const LOCALHOST_CK = "ck_88721898d82f29e0f8664d7e3316aa460340f587";
const LOCALHOST_CS = "cs_37ebd5161dd1ed62e199570e702fb7d123454569";

const api = new WooCommerceRestApi({
    url: process.env.NEXT_PUBLIC_WORDPRESS_URL || LOCALHOST_URL,
    consumerKey: process.env.WOOCOMMERCE_CONSUMER_KEY || LOCALHOST_CK,
    consumerSecret: process.env.WOOCOMMERCE_CONSUMER_SECRET || LOCALHOST_CS,
    version: "wc/v3"
});

interface Category {
    id: number;
    name: string;
    slug: string;
    parent: number;
}

async function migrateCategories() {
    console.log("🚀 Iniciando migración de categorías...\\n");

    try {
        // PASO 1: Crear categorías principales
        console.log("📁 PASO 1: Creando categorías principales...");
        const zapatillas = await createOrGetCategory("Zapatillas", "zapatillas", 0);
        const ropa = await createOrGetCategory("Ropa Deportiva", "ropa-deportiva", 0);
        const accesorios = await createOrGetCategory("Accesorios", "accesorios", 0);
        console.log("✅ Categorías principales creadas\\n");

        // PASO 2: Reorganizar World como subcategoría de Zapatillas
        console.log("📁 PASO 2: Reorganizando línea World...");
        const world = await getCategoryBySlug("world");
        if (world) {
            await updateCategoryParent(world.id, zapatillas.id);
            console.log(`✓ World movido a Zapatillas`);

            // Verificar subcategorías de World
            const worldSubcats = ["berlin", "kids", "londres-world", "roma", "tokio"];
            for (const slug of worldSubcats) {
                const subcat = await getCategoryBySlug(slug);
                if (subcat && subcat.parent !== world.id) {
                    await updateCategoryParent(subcat.id, world.id);
                    console.log(`  ✓ ${slug} asignado a World`);
                }
            }
        }
        console.log("✅ Línea World reorganizada\\n");

        // PASO 3: Crear/reorganizar Nacionales
        console.log("📁 PASO 3: Reorganizando línea Nacionales...");
        const nacionales = await createOrGetCategory("Nacionales", "nacionales", zapatillas.id);

        // Mover productos de "Zapatillas Nacionales" si existe
        const zapatillasNacionales = await getCategoryBySlug("zapatillas-nacionales");
        if (zapatillasNacionales) {
            await moveCategoryProducts(zapatillasNacionales.id, nacionales.id);
            console.log(`✓ Productos movidos de Zapatillas Nacionales a Nacionales`);
        }

        // Verificar subcategorías de Nacionales
        const nacionalesSubcats = ["clasicas-sala", "pe", "wonder"];
        for (const slug of nacionalesSubcats) {
            const subcat = await getCategoryBySlug(slug);
            if (subcat && subcat.parent !== nacionales.id) {
                await updateCategoryParent(subcat.id, nacionales.id);
                console.log(`  ✓ ${slug} asignado a Nacionales`);
            }
        }
        console.log("✅ Línea Nacionales reorganizada\\n");

        // PASO 4: Reorganizar Ropa Deportiva
        console.log("📁 PASO 4: Reorganizando Ropa Deportiva...");
        const ropaFutsal = await getCategoryBySlug("ropa-deportiva-futsal");
        if (ropaFutsal) {
            await updateCategoryParent(ropaFutsal.id, ropa.id);
            console.log(`✓ Ropa Deportiva Futsal movido a Ropa Deportiva`);
        }
        console.log("✅ Ropa Deportiva reorganizada\\n");

        // PASO 5: Reorganizar Accesorios
        console.log("📁 PASO 5: Reorganizando Accesorios...");
        const accesoriosFutsal = await getCategoryBySlug("accesorios-deportivos-futsal");
        if (accesoriosFutsal) {
            // Mover productos a la nueva categoría Accesorios
            await moveCategoryProducts(accesoriosFutsal.id, accesorios.id);

            // Mover subcategorías
            const subcats = await getSubcategories(accesoriosFutsal.id);
            for (const subcat of subcats) {
                await updateCategoryParent(subcat.id, accesorios.id);
                console.log(`  ✓ ${subcat.slug} movido a Accesorios`);
            }

            console.log(`✓ Accesorios reorganizados`);
        }
        console.log("✅ Accesorios reorganizados\\n");

        // PASO 6: Eliminar categoría duplicada "Londres" si existe como principal
        console.log("📁 PASO 6: Limpiando duplicados...");
        const londresCategories = await api.get("products/categories", { search: "londres", per_page: 10 });
        for (const cat of londresCategories.data) {
            // Si Londres no es hijo de World, mover sus productos
            if (cat.parent === 0 && cat.slug !== "londres-world") {
                const worldLondres = await getCategoryBySlug("londres-world");
                if (worldLondres) {
                    await moveCategoryProducts(cat.id, worldLondres.id);
                    console.log(`✓ Productos de Londres duplicado movidos`);
                }
            }
        }
        console.log("✅ Duplicados limpiados\\n");

        console.log("🎉 ¡Migración de categorías completada exitosamente!");
        console.log("\\n📊 Estructura final:");
        await printCategoryTree();

    } catch (error) {
        console.error("❌ Error durante la migración:", error);
        throw error;
    }
}

// ============================================================================
// FUNCIONES AUXILIARES
// ============================================================================

async function createOrGetCategory(name: string, slug: string, parent: number): Promise<Category> {
    try {
        const response = await api.post("products/categories", {
            name,
            slug,
            parent
        });
        console.log(`  ✓ Creada: ${name}`);
        return response.data;
    } catch (error: any) {
        if (error.response?.data?.code === 'term_exists') {
            const existing = await api.get("products/categories", { slug });
            console.log(`  ℹ Ya existe: ${name}`);
            return existing.data[0];
        }
        throw error;
    }
}

async function getCategoryBySlug(slug: string): Promise<Category | null> {
    const response = await api.get("products/categories", { slug, per_page: 1 });
    return response.data.length > 0 ? response.data[0] : null;
}

async function updateCategoryParent(categoryId: number, parentId: number): Promise<void> {
    await api.put(`products/categories/${categoryId}`, { parent: parentId });
}

async function getSubcategories(parentId: number): Promise<Category[]> {
    const response = await api.get("products/categories", { parent: parentId, per_page: 100 });
    return response.data;
}

async function moveCategoryProducts(fromCategoryId: number, toCategoryId: number): Promise<void> {
    // Obtener productos de la categoría origen
    const products = await api.get("products", { category: fromCategoryId, per_page: 100 });

    let movedCount = 0;
    for (const product of products.data) {
        // Remover categoría origen y agregar categoría destino
        const categories = product.categories.filter((c: any) => c.id !== fromCategoryId);

        // Agregar nueva categoría si no existe
        if (!categories.find((c: any) => c.id === toCategoryId)) {
            categories.push({ id: toCategoryId });
        }

        await api.put(`products/${product.id}`, { categories });
        movedCount++;
    }

    if (movedCount > 0) {
        console.log(`    → ${movedCount} producto(s) movido(s)`);
    }
}

async function printCategoryTree(): Promise<void> {
    const allCategories = await api.get("products/categories", { per_page: 100, orderby: "name" });
    const categories: Category[] = allCategories.data;

    // Filtrar solo categorías principales
    const topLevel = categories.filter(c => c.parent === 0);

    for (const cat of topLevel) {
        console.log(`\\n${cat.name} (${cat.slug})`);
        await printSubcategories(cat.id, categories, 1);
    }
}

async function printSubcategories(parentId: number, allCategories: Category[], level: number): Promise<void> {
    const children = allCategories.filter(c => c.parent === parentId);
    const indent = "  ".repeat(level);

    for (const child of children) {
        console.log(`${indent}├── ${child.name} (${child.slug})`);
        await printSubcategories(child.id, allCategories, level + 1);
    }
}

// Ejecutar migración
if (require.main === module) {
    migrateCategories().catch((error) => {
        console.error("💥 Error fatal:", error);
        process.exit(1);
    });
}

export { migrateCategories };
