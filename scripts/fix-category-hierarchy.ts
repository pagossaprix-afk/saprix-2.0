
import API from "@woocommerce/woocommerce-rest-api";
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

function getWooApi() {
    const url = process.env.WOOCOMMERCE_API_URL || process.env.NEXT_PUBLIC_WORDPRESS_URL || "https://pagos.saprix.com.co";
    const consumerKey = process.env.WOOCOMMERCE_CONSUMER_KEY || "";
    const consumerSecret = process.env.WOOCOMMERCE_CONSUMER_SECRET || "";

    if (!consumerKey || !consumerSecret) {
        throw new Error("Missing WooCommerce credentials");
    }

    return new API({ url, consumerKey, consumerSecret, version: "wc/v3" });
}

async function fixHierarchy() {
    const api = getWooApi();

    // Categories to move to Root (parent: 0)
    // 58: Accesorios Deportivos Futsal
    // 59: Balones Futsal
    // 61: Maleta Deportiva
    // 62: Ropa Deportiva Futsal
    const idsToMove = [58, 59, 61, 62];

    console.log("Fixing category hierarchy...");

    for (const id of idsToMove) {
        try {
            console.log(`Updating category ${id} to parent 0...`);
            const response = await api.put(`products/categories/${id}`, {
                parent: 0
            });
            console.log(`Success: ${response.data.name} is now a root category.`);
        } catch (error: any) {
            console.error(`Failed to update category ${id}:`, error.message);
        }
    }
}

fixHierarchy();
