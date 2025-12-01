
import API from "@woocommerce/woocommerce-rest-api";
import dotenv from 'dotenv';
import path from 'path';

// Try to load .env from current directory
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

function getWooApi() {
    const url = process.env.WOOCOMMERCE_API_URL || process.env.NEXT_PUBLIC_WORDPRESS_URL || "https://pagos.saprix.com.co";
    const consumerKey = process.env.WOOCOMMERCE_CONSUMER_KEY || "";
    const consumerSecret = process.env.WOOCOMMERCE_CONSUMER_SECRET || "";

    console.log("URL:", url);
    console.log("Key length:", consumerKey.length);
    console.log("Secret length:", consumerSecret.length);

    if (!consumerKey || !consumerSecret) {
        throw new Error("Missing WooCommerce credentials");
    }

    return new API({ url, consumerKey, consumerSecret, version: "wc/v3" });
}

async function debugCategories() {
    try {
        const api = getWooApi();

        console.log("Fetching categories...");
        const { data: categories } = await api.get("products/categories", { per_page: 100 });

        console.log("\n--- Category Hierarchy ---");

        // Sort by ID to have a stable order
        categories.sort((a: any, b: any) => a.id - b.id);

        categories.forEach((c: any) => {
            if (c.parent === 0) {
                console.log(`[${c.id}] ${c.name} (${c.slug})`);
                printChildren(c.id, categories, 1);
            }
        });

        function printChildren(parentId: number, all: any[], level: number) {
            const children = all.filter((c: any) => c.parent === parentId);
            children.forEach((c: any) => {
                console.log(`${"  ".repeat(level)}└─ [${c.id}] ${c.name} (${c.slug})`);
                printChildren(c.id, all, level + 1);
            });
        }

        console.log("\n--- Checking specific products ---");
        // Search for "Media Pernera"
        const { data: products } = await api.get("products", { search: "Media Pernera" });
        if (products.length > 0) {
            const p = products[0];
            console.log(`Product: ${p.name} (ID: ${p.id})`);
            console.log("Categories:", p.categories.map((c: any) => `${c.name} (ID: ${c.id})`).join(", "));
        } else {
            console.log("Product 'Media Pernera' not found.");
        }

        // Check "Zapatillas" category specifically
        const zapatillas = categories.find((c: any) => c.slug === 'zapatillas' || c.name.toLowerCase() === 'zapatillas');
        if (zapatillas) {
            console.log(`\nCategory 'Zapatillas' found: ID ${zapatillas.id}, Slug: ${zapatillas.slug}`);
            // Check if "Accesorios-Deportivos-Futsal" is a child
            const accesorios = categories.find((c: any) => c.slug === 'accesorios-deportivos-futsal');
            if (accesorios) {
                console.log(`Category 'Accesorios-Deportivos-Futsal' found: ID ${accesorios.id}, Parent: ${accesorios.parent}`);
                if (accesorios.parent === zapatillas.id) {
                    console.log("!!! ALERT: Accesorios is a child of Zapatillas !!!");
                }
            }
        }

    } catch (error: any) {
        console.error("Error:", error.message);
        if (error.response) {
            console.error("Response data:", error.response.data);
        }
    }
}

debugCategories();
