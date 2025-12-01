/**
 * Script para habilitar gestión de stock en TODOS los productos variables
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

async function fixAllStock(options: { apply: boolean; defaultStock: number }) {
    const output: string[] = [];
    const log = (msg: string) => {
        console.log(msg);
        output.push(msg);
    };

    log('\n' + '='.repeat(60));
    log('REPARACION MASIVA DE STOCK');
    log('='.repeat(60));
    log(`Modo: ${options.apply ? 'APLICAR CAMBIOS REALES' : 'SIMULACRO (Dry Run)'}`);
    log(`Stock por defecto a asignar: ${options.defaultStock}`);

    try {
        // 1. Obtener todos los productos variables
        log('\n1. Buscando productos variables...');
        let page = 1;
        let allProducts: any[] = [];
        let hasMore = true;

        while (hasMore) {
            const res = await api.get('products', {
                type: 'variable',
                per_page: 50,
                page: page,
            });

            if (res.data.length === 0) {
                hasMore = false;
            } else {
                allProducts = [...allProducts, ...res.data];
                process.stdout.write(`\rEncontrados: ${allProducts.length} productos...`);
                page++;
            }
        }
        log(`\nTotal productos variables encontrados: ${allProducts.length}`);

        // 2. Procesar cada producto
        let productsUpdated = 0;
        let variationsUpdated = 0;

        for (const product of allProducts) {
            log(`\nAnalizando: ${product.name} (ID: ${product.id})`);

            // Obtener variaciones
            const varRes = await api.get(`products/${product.id}/variations`, { per_page: 100 });
            const variations = varRes.data;

            const toUpdate = variations.filter((v: any) => !v.manage_stock);

            if (toUpdate.length === 0) {
                log(`  ✅ Todo OK (Ya gestionan stock)`);
                continue;
            }

            log(`  ⚠️  ${toUpdate.length} variaciones sin gestión de stock`);
            productsUpdated++;

            if (options.apply) {
                log(`  ⏳ Aplicando correcciones...`);
                // Actualizar en lotes
                for (const v of toUpdate) {
                    try {
                        await api.put(`products/${product.id}/variations/${v.id}`, {
                            manage_stock: true,
                            stock_quantity: options.defaultStock,
                            stock_status: 'instock'
                        });
                        variationsUpdated++;
                    } catch (e: any) {
                        log(`  ❌ Error en var ${v.id}: ${e.message}`);
                    }
                }
                log(`  ✨ Corregido`);
            } else {
                variationsUpdated += toUpdate.length;
                log(`  [SIMULACRO] Se activarían ${toUpdate.length} variaciones con stock ${options.defaultStock}`);
            }
        }

        log('\n' + '='.repeat(60));
        log('RESUMEN FINAL');
        log('='.repeat(60));
        log(`Productos analizados: ${allProducts.length}`);
        log(`Productos que necesitan corrección: ${productsUpdated}`);
        log(`Total variaciones a corregir: ${variationsUpdated}`);

        if (!options.apply) {
            log('\nPara aplicar estos cambios ejecuta:');
            log('npx tsx scripts/fix-all-stock.ts --apply');
        }

        writeFileSync('stock-fix-report.txt', output.join('\n'));

    } catch (error: any) {
        log(`\nERROR FATAL: ${error.message}`);
    }
}

const apply = process.argv.includes('--apply');
fixAllStock({ apply, defaultStock: 10 });
