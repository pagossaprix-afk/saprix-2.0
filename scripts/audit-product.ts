/**
 * Script para auditar las variaciones de un producto específico - VERSION SIMPLIFICADA
 */

import API from '@woocommerce/woocommerce-rest-api';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { writeFileSync } from 'fs';

// Cargar variables de entorno
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env.local') });

const api = new API({
    url: process.env.WOOCOMMERCE_API_URL || process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://pagos.saprix.com.co',
    consumerKey: process.env.WOOCOMMERCE_CONSUMER_KEY || '',
    consumerSecret: process.env.WOOCOMMERCE_CONSUMER_SECRET || '',
    version: 'wc/v3',
});

async function auditProduct(slug: string) {
    const output: string[] = [];

    output.push(`\nAUDITORIA DE PRODUCTO: ${slug}\n`);
    output.push('='.repeat(80));

    try {
        // 1. Buscar el producto por slug
        const productsResponse = await api.get('products', {
            slug: slug,
            per_page: 1,
        });

        const products = productsResponse.data;

        if (!products || products.length === 0) {
            output.push(`\nERROR: No se encontro el producto con slug: ${slug}`);
            console.log(output.join('\n'));
            return;
        }

        const product = products[0];
        output.push(`\nProducto: ${product.name}`);
        output.push(`ID: ${product.id}`);
        output.push(`Tipo: ${product.type}`);
        output.push(`Gestiona stock: ${product.manage_stock ? 'SI' : 'NO'}`);

        if (product.type !== 'variable') {
            output.push('\nEste no es un producto variable');
            console.log(output.join('\n'));
            return;
        }

        // 2. Obtener todas las variaciones
        let allVariations: any[] = [];
        let page = 1;
        let hasMore = true;

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

        output.push(`\nTotal de variaciones: ${allVariations.length}`);

        // 3. Análisis por color y talla
        const colorMap = new Map<string, any[]>();
        const sizeMap = new Map<string, any[]>();

        allVariations.forEach((variation) => {
            let color = '';
            let size = '';

            variation.attributes.forEach((attr: any) => {
                if (attr.name.toLowerCase() === 'color') {
                    color = attr.option;
                }
                if (attr.name.toLowerCase() === 'talla') {
                    size = attr.option;
                }
            });

            if (!colorMap.has(color)) {
                colorMap.set(color, []);
            }
            colorMap.get(color)?.push({
                size,
                stock: variation.stock_quantity,
                status: variation.stock_status,
                manages_stock: variation.manage_stock,
            });

            if (!sizeMap.has(size)) {
                sizeMap.set(size, []);
            }
            sizeMap.get(size)?.push({
                color,
                stock: variation.stock_quantity,
                status: variation.stock_status,
                manages_stock: variation.manage_stock,
            });
        });

        output.push(`Colores unicos: ${colorMap.size}`);
        output.push(`Tallas unicas: ${sizeMap.size}`);

        // 4. Resultados por color
        output.push('\n' + '='.repeat(80));
        output.push('DISPONIBILIDAD POR COLOR');
        output.push('='.repeat(80));

        for (const [color, variations] of Array.from(colorMap.entries()).sort()) {
            output.push(`\nColor: ${color}`);

            const sortedVariations = variations.sort((a, b) => {
                const aNum = parseFloat(a.size);
                const bNum = parseFloat(b.size);
                return aNum - bNum;
            });

            sortedVariations.forEach((v) => {
                const status = v.status === 'instock' ? 'DISPONIBLE' : 'AGOTADO';
                const stockStr = v.manages_stock ? `Stock: ${v.stock ?? 'null'}` : 'Sin gestion';
                output.push(`  Talla ${v.size}: ${status} - ${stockStr}`);
            });
        }

        // 5. Estadísticas
        output.push('\n' + '='.repeat(80));
        output.push('ESTADISTICAS');
        output.push('='.repeat(80));

        const inStock = allVariations.filter(v => v.stock_status === 'instock').length;
        const outOfStock = allVariations.filter(v => v.stock_status === 'outofstock').length;
        const managesStock = allVariations.filter(v => v.manage_stock).length;

        output.push(`En stock: ${inStock} de ${allVariations.length} (${((inStock / allVariations.length) * 100).toFixed(1)}%)`);
        output.push(`Agotadas: ${outOfStock} de ${allVariations.length} (${((outOfStock / allVariations.length) * 100).toFixed(1)}%)`);
        output.push(`Con gestion de stock: ${managesStock} de ${allVariations.length} (${((managesStock / allVariations.length) * 100).toFixed(1)}%)`);

        // 6. Problemas detectados
        output.push('\n' + '='.repeat(80));
        output.push('PROBLEMAS DETECTADOS');
        output.push('='.repeat(80));

        if (inStock === allVariations.length && allVariations.length > 0) {
            output.push('\n[ALERTA] TODAS las variaciones estan marcadas como "en stock"');
            output.push('Esto indica que no hay gestion de stock real habilitada.');
            output.push('El frontend mostrara todas las opciones como disponibles.');
        }

        const withoutManagement = allVariations.filter(v => !v.manage_stock);
        if (withoutManagement.length > 0) {
            output.push(`\n[ADVERTENCIA] ${withoutManagement.length} variaciones SIN gestion de stock`);
            output.push('Estas siempre se mostraran como disponibles.');
        }

        const totalPossible = colorMap.size * sizeMap.size;
        if (allVariations.length < totalPossible) {
            output.push(`\n[INFO] Faltan combinaciones: ${totalPossible - allVariations.length} de ${totalPossible} posibles`);
        }

        // Guardar en archivo
        const fullOutput = output.join('\n');
        writeFileSync('audit-result.txt', fullOutput, 'utf-8');
        console.log(fullOutput);
        console.log('\n[INFO] Reporte guardado en: audit-result.txt');

    } catch (error: any) {
        output.push('\nERROR: ' + error.message);
        console.log(output.join('\n'));
    }
}

// Ejecutar
const slug = process.argv[2] || 'zapatilla-world-londres';
auditProduct(slug).then(() => process.exit(0)).catch(() => process.exit(1));
