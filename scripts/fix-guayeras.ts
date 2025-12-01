
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

async function fixGuayeras() {
    const api = getWooApi();
    console.log("Fetching categories...");
    const { data: categories } = await api.get("products/categories", { per_page: 100 });

    const guayeras = categories.find((c: any) => c.name.toLowerCase().trim() === "guayeras");

    if (guayeras) {
        if (guayeras.parent !== 0) {
            console.log(`Moving 'Guayeras' (ID: ${guayeras.id}) to Root...`);
            await api.put(`products/categories/${guayeras.id}`, { parent: 0 });
            console.log("Success.");
        } else {
            console.log("'Guayeras' is already at Root.");
        }
    } else {
        console.warn("'Guayeras' category not found.");
    }
}

fixGuayeras();
