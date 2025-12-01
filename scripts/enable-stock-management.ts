/**
 * Script para habilitar la gestión de stock en variaciones de productos
 * 
 * Uso:
 * - Modo dry-run (solo ver cambios): npx tsx scripts/enable-stock-management.ts <slug> --dry-run
 * - Habilitar con stock por defecto: npx tsx scripts/enable-stock-management.ts <slug> --default-stock=10
 * - Aplicar cambios reales: npx tsx scripts/enable-stock-management.ts <slug> --apply --default-stock=10
 */

import API from '@woocommerce/woocommerce-rest-api';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { writeFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env.local') });

const api = new API({
    url: process.env.WOOCOMMERCE_API_URL || process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://pagos.saprix.com.co',
    consumerKey: process.env.WOOCOMMERCE_CONSUMER_KEY || '',
    consumerSecret: process.env.WOOCOMMERCE_CONSUMER_SECRET || '',
    version: 'wc/v3',
});

interface VariationUpdate {
    id: number;
    color: string;
    size: string;
    currentStock: number | null;
    currentStatus: string;
    newStock: number;
    willManageStock: boolean;
}

async function enableStockManagement(
    slug: string,
    options: {
        dryRun?: boolean;
        apply?: boolean;
        defaultStock?: number;
        customStockFile?: string;
    }
) {
    const output: string[] = [];
    const updates: VariationUpdate[] = [];

    output.push('\n' + '='.repeat(80));
    output.push('HABILITAR GESTION DE STOCK');
    output.push('='.repeat(80));
    output.push(`Producto: ${slug}`);
    output.push(`Modo: ${options.apply ? 'APLICAR CAMBIOS' : 'DRY-RUN (solo visualizar)'}`);
    output.push(`Stock por defecto: ${options.defaultStock ?? 'No especificado'}`);
    output.push('='.repeat(80));

    try {
        // 1. Buscar producto
        const productsResponse = await api.get('products', { slug, per_page: 1 });
        const products = productsResponse.data;

        if (!products || products.length === 0) {
            output.push(`\nERROR: No se encontro el producto con slug: ${slug}`);
            console.log(output.join('\n'));
            return;
        }

        const product = products[0];
        output.push(`\nProducto encontrado: ${product.name} (ID: ${product.id})`);

        if (product.type !== 'variable') {
            output.push('ERROR: Este no es un producto variable');
            console.log(output.join('\n'));
            return;
        }

        // 2. Obtener todas las variaciones
        let allVariations: any[] = [];
        let page = 1;
        let hasMore = true;

        output.push('\nObteniendo variaciones...');
        while (hasMore) {
            const variationsResponse = await api.get(`products/${product.id}/variations`, {
                per_page: 100,
                page: page,
            });
            const variations = variationsResponse.data;
            if (variations.length === 0) {
                hasMore = false;
            } else {
                allVariations = [...allVariations, ...variations];
                page++;
            }
        }

        output.push(`Total de variaciones: ${allVariations.length}`);

        // 3. Preparar actualizaciones
        output.push('\n' + '='.repeat(80));
        output.push('CAMBIOS A REALIZAR');
        output.push('='.repeat(80));

        for (const variation of allVariations) {
            let color = '';
            let size = '';

            variation.attributes.forEach((attr: any) => {
                if (attr.name.toLowerCase() === 'color') color = attr.option;
                if (attr.name.toLowerCase() === 'talla') size = attr.option;
            });

            // Determinar nuevo stock
            let newStock = options.defaultStock ?? 0;

            // Si la variación ya gestiona stock y tiene cantidad, mantenerla
            if (variation.manage_stock && variation.stock_quantity !== null && variation.stock_quantity !== undefined) {
                newStock = variation.stock_quantity;
            }

            const update: VariationUpdate = {
                id: variation.id,
                color,
                size,
                currentStock: variation.stock_quantity,
                currentStatus: variation.stock_status,
                newStock,
                willManageStock: true,
            };

            updates.push(update);

            const statusIcon = variation.manage_stock ? '[+]' : '[ ]';
            const change = variation.manage_stock
                ? `Mantener stock: ${variation.stock_quantity}`
                : `Habilitar gestion con stock: ${newStock}`;

            output.push(`${statusIcon} Color: ${color.padEnd(20)} | Talla: ${size.padEnd(5)} | ${change}`);
        }

        output.push('\n' + '='.repeat(80));
        output.push('RESUMEN');
        output.push('='.repeat(80));

        const needsUpdate = updates.filter(u => !allVariations.find(v => v.id === u.id)?.manage_stock);
        const alreadyManaged = updates.length - needsUpdate.length;

        output.push(`Total variaciones: ${updates.length}`);
        output.push(`Ya gestionan stock: ${alreadyManaged}`);
        output.push(`Necesitan actualizacion: ${needsUpdate.length}`);

        // 4. Aplicar cambios si se especificó
        if (options.apply && needsUpdate.length > 0) {
            output.push('\n' + '='.repeat(80));
            output.push('APLICANDO CAMBIOS...');
            output.push('='.repeat(80));

            let success = 0;
            let errors = 0;

            for (const update of needsUpdate) {
                try {
                    const variation = allVariations.find(v => v.id === update.id);
                    if (!variation.manage_stock) {
                        await api.put(`products/${product.id}/variations/${update.id}`, {
                            manage_stock: true,
                            stock_quantity: update.newStock,
                            stock_status: update.newStock > 0 ? 'instock' : 'outofstock',
                        });

                        output.push(`[OK] Variacion ${update.id} (${update.color} - ${update.size})`);
                        success++;
                    }
                } catch (error: any) {
                    output.push(`[ERROR] Variacion ${update.id}: ${error.message}`);
                    errors++;
                }
            }

            output.push('\n' + '='.repeat(80));
            output.push('RESULTADO');
            output.push('='.repeat(80));
            output.push(`Exitosas: ${success}`);
            output.push(`Errores: ${errors}`);
            output.push(`Sin cambios (ya gestionaban): ${alreadyManaged}`);

        } else if (!options.apply) {
            output.push('\n[INFO] Modo DRY-RUN: No se aplicaron cambios');
            output.push('[INFO] Para aplicar los cambios, ejecuta el comando con --apply');
        }

        // 5. Guardar reporte
        const fullOutput = output.join('\n');
        const reportFile = `stock-management-report-${slug}-${Date.now()}.txt`;
        writeFileSync(reportFile, fullOutput, 'utf-8');

        console.log(fullOutput);
        console.log(`\n[INFO] Reporte guardado en: ${reportFile}\n`);

    } catch (error: any) {
        output.push('\nERROR: ' + error.message);
        console.log(output.join('\n'));
    }
}

// Parsear argumentos
const args = process.argv.slice(2);
const slug = args[0] || 'zapatilla-world-londres';

const options = {
    dryRun: args.includes('--dry-run'),
    apply: args.includes('--apply'),
    defaultStock: parseInt(args.find(a => a.startsWith('--default-stock='))?.split('=')[1] || '0'),
};

// Validación
if (!slug) {
    console.error('ERROR: Debe especificar un slug de producto');
    console.log('\nUso:');
    console.log('  npx tsx scripts/enable-stock-management.ts <slug> [opciones]');
    console.log('\nOpciones:');
    console.log('  --dry-run              Solo ver cambios sin aplicar');
    console.log('  --apply                Aplicar los cambios realmente');
    console.log('  --default-stock=N      Stock por defecto para variaciones sin gestion');
    console.log('\nEjemplos:');
    console.log('  npx tsx scripts/enable-stock-management.ts zapatilla-world-londres --dry-run');
    console.log('  npx tsx scripts/enable-stock-management.ts zapatilla-world-londres --apply --default-stock=5');
    process.exit(1);
}

if (options.apply && options.dryRun) {
    console.error('ERROR: No puede usar --apply y --dry-run al mismo tiempo');
    process.exit(1);
}

if (!options.apply && !options.dryRun) {
    console.log('[INFO] No se especifico --apply ni --dry-run, usando modo DRY-RUN por defecto\n');
    options.dryRun = true;
}

enableStockManagement(slug, options)
    .then(() => process.exit(0))
    .catch((error) => {
        console.error('ERROR FATAL:', error);
        process.exit(1);
    });
