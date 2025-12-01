import API from "@woocommerce/woocommerce-rest-api";
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

function getWooApi() {
    const url = process.env.WOOCOMMERCE_API_URL || "https://pagos.saprix.com.co";
    const consumerKey = process.env.WOOCOMMERCE_CONSUMER_KEY || "";
    const consumerSecret = process.env.WOOCOMMERCE_CONSUMER_SECRET || "";

    if (!consumerKey || !consumerSecret) {
        throw new Error("Missing WooCommerce credentials");
    }

    return new API({ url, consumerKey, consumerSecret, version: "wc/v3" });
}

async function testCategoryFiltering() {
    const api = getWooApi();

    console.log("Fetching categories...");
    const { data: categories } = await api.get("products/categories", { per_page: 100 });

    // Test filtering by "Medias Futsal"
    const mediasCategory = categories.find((c: any) => c.name === "Medias Futsal");

    if (!mediasCategory) {
        console.error("Medias Futsal category not found!");
        return;
    }

    console.log(`\nTesting filter for "Medias Futsal" (ID: ${mediasCategory.id})`);
    console.log(`Category slug: ${mediasCategory.slug}`);
    console.log(`Category parent: ${mediasCategory.parent}`);

    // Fetch products with this category ID
    console.log(`\nFetching products with category=${mediasCategory.id}...`);
    const { data: products } = await api.get("products", {
        category: mediasCategory.id,
        per_page: 100,
        status: 'publish'
    });

    console.log(`\nFound ${products.length} products:`);
    products.forEach((p: any) => {
        const cats = p.categories.map((c: any) => `${c.name} (${c.id})`).join(", ");
        console.log(`  - ${p.name}`);
        console.log(`    Categories: ${cats}`);
    });

    // Now test with "Balones Futsal"
    const balonesCategory = categories.find((c: any) => c.name === "Balones Futsal");

    if (balonesCategory) {
        console.log(`\n\nTesting filter for "Balones Futsal" (ID: ${balonesCategory.id})`);
        const { data: balonesProducts } = await api.get("products", {
            category: balonesCategory.id,
            per_page: 100,
            status: 'publish'
        });

        console.log(`\nFound ${balonesProducts.length} products:`);
        balonesProducts.forEach((p: any) => {
            const cats = p.categories.map((c: any) => `${c.name} (${c.id})`).join(", ");
            console.log(`  - ${p.name}`);
            console.log(`    Categories: ${cats}`);
        });
    }
}

testCategoryFiltering().catch(console.error);
