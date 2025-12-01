/**
 * Script Maestro de Migración
 * 
 * Ejecuta todos los scripts de migración en el orden correcto:
 * 1. Crear atributos globales
 * 2. Migrar y normalizar etiquetas
 * 3. Reorganizar categorías
 * 
 * USO:
 * npx tsx scripts/run-migration.ts
 */

import { config } from 'dotenv';
import { resolve } from 'path';

// Cargar variables de entorno desde .env.local
config({ path: resolve(process.cwd(), '.env.local') });

import { createAttributes } from './create-attributes';
import { migrateTags } from './migrate-tags';
import { migrateCategories } from './migrate-categories';

async function runFullMigration() {
    console.log("╔════════════════════════════════════════════════════════════╗");
    console.log("║   MIGRACIÓN COMPLETA DE WOOCOMMERCE - SAPRIX ECOMMERCE    ║");
    console.log("╚════════════════════════════════════════════════════════════╝\n");

    const startTime = Date.now();

    try {
        // PASO 1: Crear atributos
        console.log("═══════════════════════════════════════════════════════════");
        console.log("PASO 1/3: CREACIÓN DE ATRIBUTOS GLOBALES");
        console.log("═══════════════════════════════════════════════════════════\n");
        await createAttributes();
        console.log("\n✅ Paso 1 completado\n");

        // Pausa de 2 segundos
        await sleep(2000);

        // PASO 2: Migrar etiquetas
        console.log("═══════════════════════════════════════════════════════════");
        console.log("PASO 2/3: MIGRACIÓN Y NORMALIZACIÓN DE ETIQUETAS");
        console.log("═══════════════════════════════════════════════════════════\n");
        await migrateTags();
        console.log("\n✅ Paso 2 completado\n");

        // Pausa de 2 segundos
        await sleep(2000);

        // PASO 3: Reorganizar categorías
        console.log("═══════════════════════════════════════════════════════════");
        console.log("PASO 3/3: REORGANIZACIÓN DE CATEGORÍAS");
        console.log("═══════════════════════════════════════════════════════════\n");
        await migrateCategories();
        console.log("\n✅ Paso 3 completado\n");

        // Resumen final
        const endTime = Date.now();
        const duration = ((endTime - startTime) / 1000).toFixed(2);

        console.log("\n╔════════════════════════════════════════════════════════════╗");
        console.log("║                  MIGRACIÓN COMPLETADA                      ║");
        console.log("╚════════════════════════════════════════════════════════════╝");
        console.log(`\n⏱️  Tiempo total: ${duration} segundos`);
        console.log("\n📋 Resumen:");
        console.log("  ✅ Atributos globales creados (Color, Talla, Línea, Audiencia, Superficie)");
        console.log("  ✅ Etiquetas normalizadas y organizadas");
        console.log("  ✅ Categorías reorganizadas a estructura Opción A");
        console.log("\n🎯 Próximos pasos:");
        console.log("  1. Verificar categorías en WooCommerce Admin");
        console.log("  2. Asignar atributos a productos existentes");
        console.log("  3. Probar navegación en frontend");
        console.log("  4. Configurar redirecciones SEO si es necesario\n");

    } catch (error) {
        console.error("\n╔════════════════════════════════════════════════════════════╗");
        console.error("║                    ERROR EN MIGRACIÓN                      ║");
        console.error("╚════════════════════════════════════════════════════════════╝\n");
        console.error(error);
        console.error("\n⚠️  La migración se detuvo. Revisa el error arriba.");
        console.error("💡 Tip: Puedes ejecutar los scripts individuales para continuar:");
        console.error("   - npx tsx scripts/create-attributes.ts");
        console.error("   - npx tsx scripts/migrate-tags.ts");
        console.error("   - npx tsx scripts/migrate-categories.ts\n");
        process.exit(1);
    }
}

function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Ejecutar migración completa
if (require.main === module) {
    runFullMigration().catch((error) => {
        console.error("💥 Error fatal:", error);
        process.exit(1);
    });
}

export { runFullMigration };
