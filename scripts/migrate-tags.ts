/**
 * Script de Migración y Normalización de Etiquetas de WooCommerce
 * 
 * - Normaliza etiquetas duplicadas (ej: "Fuccsia" → "Fucsia")
 * - Crea etiquetas de marketing y características
 * - Limpia etiquetas obsoletas
 * 
 * USO:
 * npx tsx scripts/migrate-tags.ts
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

// Mapeo de normalizaciones
const TAG_NORMALIZATION: Record<string, string> = {
    'Fuccsia': 'Fucsia',
    'Futbol de sala': 'Futsal',
    'Microfutbol': 'Futsal',
    'Micro': 'Futsal',
    'Originals': 'Originales',
};

async function migrateTags() {
    console.log("🚀 Iniciando migración de etiquetas...\\n");

    try {
        // PASO 1: Normalizar etiquetas duplicadas
        console.log("🔄 PASO 1: Normalizando etiquetas duplicadas...");
        const allTags = await api.get("products/tags", { per_page: 100 });

        let normalized = 0;
        for (const tag of allTags.data) {
            const normalizedName = TAG_NORMALIZATION[tag.name];
            if (normalizedName && normalizedName !== tag.name) {
                await mergeTag(tag, normalizedName);
                normalized++;
            }
        }
        console.log(`✅ ${normalized} etiquetas normalizadas\\n`);

        // PASO 2: Crear etiquetas de marketing
        console.log("📢 PASO 2: Creando etiquetas de marketing...");
        const marketingTags = [
            { name: "Nuevo", slug: "nuevo" },
            { name: "Oferta", slug: "oferta" },
            { name: "Bestseller", slug: "bestseller" },
            { name: "Exclusivo", slug: "exclusivo" },
            { name: "Agotándose", slug: "agotandose" },
        ];

        for (const tag of marketingTags) {
            await createTag(tag.name, tag.slug);
        }
        console.log(`✅ ${marketingTags.length} etiquetas de marketing creadas\\n`);

        // PASO 3: Crear etiquetas de características
        console.log("⚡ PASO 3: Creando etiquetas de características...");
        const featureTags = [
            { name: "Antideslizante", slug: "antideslizante" },
            { name: "Transpirable", slug: "transpirable" },
            { name: "Resistente", slug: "resistente" },
            { name: "Profesional", slug: "profesional" },
            { name: "Amateur", slug: "amateur" },
            { name: "Confort", slug: "confort" },
            { name: "Ligero", slug: "ligero" },
        ];

        for (const tag of featureTags) {
            await createTag(tag.name, tag.slug);
        }
        console.log(`✅ ${featureTags.length} etiquetas de características creadas\\n`);

        console.log("🎉 ¡Migración de etiquetas completada exitosamente!");
        console.log("\\n📊 Resumen de etiquetas:");
        await printTagsSummary();

    } catch (error) {
        console.error("❌ Error durante la migración de etiquetas:", error);
        throw error;
    }
}

// ============================================================================
// FUNCIONES AUXILIARES
// ============================================================================

async function mergeTag(oldTag: any, newTagName: string): Promise<void> {
    // Buscar o crear tag normalizado
    let newTag = await api.get("products/tags", { search: newTagName });

    if (newTag.data.length === 0) {
        const created = await api.post("products/tags", {
            name: newTagName,
            slug: newTagName.toLowerCase().replace(/\s+/g, '-')
        });
        newTag = { data: [created.data] };
    }

    // Mover productos del tag antiguo al nuevo
    const products = await api.get("products", { tag: oldTag.id, per_page: 100 });

    for (const product of products.data) {
        const tags = product.tags.filter((t: any) => t.id !== oldTag.id);

        // Agregar nuevo tag si no existe
        if (!tags.find((t: any) => t.id === newTag.data[0].id)) {
            tags.push({ id: newTag.data[0].id });
        }

        await api.put(`products/${product.id}`, { tags });
    }

    // Eliminar tag antiguo
    try {
        await api.delete(`products/tags/${oldTag.id}`, { force: true });
        console.log(`  ✓ Fusionado: "${oldTag.name}" → "${newTagName}"`);
    } catch (error) {
        console.log(`  ⚠ No se pudo eliminar tag antiguo: ${oldTag.name}`);
    }
}

async function createTag(name: string, slug: string): Promise<void> {
    try {
        await api.post("products/tags", { name, slug });
        console.log(`  ✓ Creada: ${name}`);
    } catch (error: any) {
        if (error.response?.data?.code === 'term_exists') {
            console.log(`  ℹ Ya existe: ${name}`);
        } else {
            console.error(`  ✗ Error creando ${name}:`, error.message);
        }
    }
}

async function printTagsSummary(): Promise<void> {
    const tags = await api.get("products/tags", { per_page: 100, orderby: "count", order: "desc" });

    console.log(`\nTotal de etiquetas: ${tags.data.length}`);
    console.log("\nTop 10 etiquetas más usadas:");

    for (let i = 0; i < Math.min(10, tags.data.length); i++) {
        const tag = tags.data[i];
        console.log(`  ${i + 1}. ${tag.name} (${tag.count} productos)`);
    }
}

// Ejecutar migración
if (require.main === module) {
    migrateTags().catch((error) => {
        console.error("💥 Error fatal:", error);
        process.exit(1);
    });
}

export { migrateTags };
