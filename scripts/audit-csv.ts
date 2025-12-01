
import fs from 'fs';
import path from 'path';
import { getWooApi } from '../lib/woocommerce';
import https from 'https';

// Helper to fetch CSV content
function fetchCsv(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => resolve(data));
            res.on('error', reject);
        }).on('error', reject);
    });
}

// Simple CSV parser (handles quoted fields)
function parseCsv(csv: string) {
    const lines = csv.split(/\r?\n/);
    const headers = lines[0].split(',').map(h => h.replace(/^"|"$/g, '').trim());
    const result = [];

    for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;

        const obj: any = {};
        let currentLine = lines[i];

        // Regex to match CSV fields, handling quotes
        const regex = /(?:^|,)(?:"([^"]*(?:""[^"]*)*)"|([^",]*))/g;
        let match;
        let colIndex = 0;

        while ((match = regex.exec(currentLine)) !== null && colIndex < headers.length) {
            // match[1] is quoted value, match[2] is unquoted
            let val = match[1] ? match[1].replace(/""/g, '"') : match[2];
            obj[headers[colIndex]] = val ? val.trim() : '';
            colIndex++;
        }
        result.push(obj);
    }
    return result;
}

async function audit() {
    console.log("Fetching CSV...");
    const csvUrl = "https://pagos.saprix.com.co/wp-content/uploads/2025/11/wc-product-export-28-11-2025-1764330446484.csv";
    const csvContent = await fetchCsv(csvUrl);
    const csvProducts = parseCsv(csvContent);

    console.log(`CSV loaded: ${csvProducts.length} rows found.`);

    const api = getWooApi();
    console.log("Fetching API products...");
    const { data: apiProducts } = await api.get("products", { per_page: 100 });

    console.log(`API loaded: ${apiProducts.length} products found.`);

    console.log("\n--- AUDIT REPORT ---");

    // Check Categories for specific items mentioned by user
    const checkCategory = (nameFragment: string) => {
        console.log(`\nChecking products matching '${nameFragment}' in CSV vs API:`);

        const csvMatches = csvProducts.filter((p: any) => p['Nombre']?.toLowerCase().includes(nameFragment.toLowerCase()));

        csvMatches.forEach((csvP: any) => {
            const apiP = apiProducts.find((p: any) => p.name === csvP['Nombre'] || p.slug === csvP['Slug']);

            if (apiP) {
                const apiCats = apiP.categories.map((c: any) => c.name).join(', ');
                console.log(`  [${csvP['Nombre']}]`);
                console.log(`    CSV Categories: ${csvP['Categorías']}`);
                console.log(`    API Categories: ${apiCats}`);

                // Check if categories match roughly
                const csvCatList = csvP['Categorías']?.split(',').map((c: string) => c.trim()) || [];
                const apiCatList = apiP.categories.map((c: any) => c.name);

                const missingInApi = csvCatList.filter((c: string) => !apiCatList.includes(c.replace(/>/g, '').trim())); // Simple check
                if (missingInApi.length > 0) {
                    console.warn(`    WARNING: Categories missing in API: ${missingInApi.join(', ')}`);
                }
            } else {
                console.error(`  [${csvP['Nombre']}] NOT FOUND IN API`);
            }
        });
    };

    checkCategory("Media");
    checkCategory("Balón");
    checkCategory("Guayeras");

    console.log("\n--- Category Structure in API ---");
    // Check what products are in "Zapatillas" category in API
    const zapatillas = apiProducts.filter((p: any) => p.categories.some((c: any) => c.name.toLowerCase().includes('zapatillas')));
    console.log(`Products in 'Zapatillas' category (API): ${zapatillas.length}`);
    zapatillas.forEach((p: any) => console.log(`  - ${p.name}`));

}

audit();
