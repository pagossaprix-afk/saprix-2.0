/**
 * Script de Creación de Atributos Globales de WooCommerce
 * 
 * Crea los siguientes atributos:
 * - Color (pa_color)
 * - Talla (pa_talla)
 * - Línea (pa_linea)
 * - Audiencia (pa_audiencia)
 * - Superficie (pa_superficie)
 * 
 * USO:
 * npx tsx scripts/create-attributes.ts
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

interface Attribute {
    id: number;
    name: string;
    slug: string;
}

async function createAttributes() {
    console.log("🚀 Iniciando creación de atributos globales...\\n");

    try {
        // ATRIBUTO 1: Color
        console.log("🎨 Creando atributo: Color");
        const colorAttr = await createAttribute("Color", "pa_color");
        await createAttributeTerms(colorAttr.id, [
            // Colores básicos
            "Amarillo", "Azul", "Azul Rey", "Azul Menta", "Azul Oscuro",
            "Blanco", "Bronce", "Dorado", "Fucsia", "Gris", "Jade",
            "Morado", "Naranja", "Negro", "Neón", "Rojo", "Verde",
            "Verde Jade", "Verde Neón",

            // Combinaciones comunes
            "Azul y Blanco", "Blanco y Negro", "Negro y Amarillo",
            "Rojo y Blanco", "Verde y Azul", "Dorado y Negro",
            "Blanco y Neón", "Negro y Gris", "Fucsia y Azul",

            // Especiales
            "Colombia", "Chispas", "Variedad"
        ]);
        console.log("✅ Atributo Color creado\\n");

        // ATRIBUTO 2: Talla
        console.log("👟 Creando atributo: Talla");
        const tallaAttr = await createAttribute("Talla", "pa_talla");
        await createAttributeTerms(tallaAttr.id, [
            // Tallas EU para zapatillas
            "34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45",

            // Tallas de ropa
            "XS", "S", "M", "L", "XL", "XXL",

            // Tallas para niños
            "8", "10", "12", "14", "16",

            // Especiales
            "Única"
        ]);
        console.log("✅ Atributo Talla creado\\n");

        // ATRIBUTO 3: Línea
        console.log("📦 Creando atributo: Línea");
        const lineaAttr = await createAttribute("Línea", "pa_linea");
        await createAttributeTerms(lineaAttr.id, [
            "World",
            "Nacionales",
            "Accesorios",
            "Ropa"
        ]);
        console.log("✅ Atributo Línea creado\\n");

        // ATRIBUTO 4: Audiencia
        console.log("👥 Creando atributo: Audiencia");
        const audienciaAttr = await createAttribute("Audiencia", "pa_audiencia");
        await createAttributeTerms(audienciaAttr.id, [
            "Adulto",
            "Kids",
            "Unisex"
        ]);
        console.log("✅ Atributo Audiencia creado\\n");

        // ATRIBUTO 5: Superficie
        console.log("🏟️ Creando atributo: Superficie");
        const superficieAttr = await createAttribute("Superficie", "pa_superficie");
        await createAttributeTerms(superficieAttr.id, [
            "Sintética",
            "Césped Natural",
            "Césped Artificial",
            "Multisuperficie"
        ]);
        console.log("✅ Atributo Superficie creado\\n");

        console.log("🎉 ¡Todos los atributos creados exitosamente!");
        console.log("\\n📊 Resumen de atributos:");
        await printAttributesSummary();

    } catch (error) {
        console.error("❌ Error durante la creación de atributos:", error);
        throw error;
    }
}

// ============================================================================
// FUNCIONES AUXILIARES
// ============================================================================

async function createAttribute(name: string, slug: string): Promise<Attribute> {
    try {
        const response = await api.post("products/attributes", {
            name,
            slug,
            type: "select",
            order_by: "menu_order",
            has_archives: true
        });
        console.log(`  ✓ Atributo creado: ${name} (${slug})`);
        return response.data;
    } catch (error: any) {
        if (error.response?.data?.code === 'term_exists') {
            console.log(`  ℹ Atributo ya existe: ${name}`);
            const existing = await api.get("products/attributes");
            const found = existing.data.find((a: any) => a.slug === slug);
            if (found) return found;
        }
        throw error;
    }
}

async function createAttributeTerms(attributeId: number, terms: string[]): Promise<void> {
    let created = 0;
    let skipped = 0;

    for (const term of terms) {
        try {
            await api.post(`products/attributes/${attributeId}/terms`, {
                name: term,
                slug: term.toLowerCase()
                    .replace(/\s+/g, '-')
                    .replace(/\+/g, '')
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
            });
            created++;
            process.stdout.write(`\r  Creando términos... ${created}/${terms.length}`);
        } catch (error: any) {
            if (error.response?.data?.code === 'term_exists') {
                skipped++;
            } else {
                console.error(`\n  ✗ Error creando término "${term}":`, error.message);
            }
        }
    }

    console.log(`\n  ✓ ${created} términos creados${skipped > 0 ? `, ${skipped} ya existían` : ''}`);
}

async function printAttributesSummary(): Promise<void> {
    const attributes = await api.get("products/attributes");

    for (const attr of attributes.data) {
        const terms = await api.get(`products/attributes/${attr.id}/terms`, { per_page: 100 });
        console.log(`\n${attr.name} (${attr.slug})`);
        console.log(`  └── ${terms.data.length} términos`);
    }
}

// Ejecutar creación
if (require.main === module) {
    createAttributes().catch((error) => {
        console.error("💥 Error fatal:", error);
        process.exit(1);
    });
}

export { createAttributes };
