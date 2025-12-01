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

async function debugGuayeras() {
    const api = getWooApi();

    console.log("=== DEBUGGING GUAYERAS FILTER ===\n");

    // 1. Find Guayeras category
    const { data: categories } = await api.get("products/categories", { per_page: 100 });
    const guayeras = categories.find((c: any) => c.name.toLowerCase().includes("guayera"));

    if (!guayeras) {
        console.error("❌ Guayeras category not found!");
        return;
    }

    console.log(`✅ Found category: ${guayeras.name}`);
    console.log(`   ID: ${guayeras.id}`);
    console.log(`   Slug: ${guayeras.slug}`);
    console.log(`   Parent: ${guayeras.parent}`);
    console.log(`   Count: ${guayeras.count}`);

    // 2. Fetch products with this category
    console.log(`\n--- Testing API filter with category ID ${guayeras.id} ---`);
    const { data: productsByID } = await api.get("products", {
        category: guayeras.id,
        per_page: 100,
        status: 'publish'
    });

    console.log(`\nProducts returned by API (category=${guayeras.id}):`);
    console.log(`Total: ${productsByID.length} products`);
    productsByID.forEach((p: any) => {
        const cats = p.categories.map((c: any) => `${c.name} (ID:${c.id})`).join(", ");
        console.log(`  - ${p.name}`);
        console.log(`    Categories: ${cats}`);
    });

    // 3. Check what slug would be used
    console.log(`\n--- Testing with slug "${guayeras.slug}" ---`);

    // 4. Get ALL products and manually filter
    const { data: allProducts } = await api.get("products", { per_page: 100, status: 'publish' });
    const manuallyFiltered = allProducts.filter((p: any) =>
        p.categories.some((c: any) => c.id === guayeras.id)
    );

    console.log(`\nManually filtered products (checking category ID ${guayeras.id}):`);
    console.log(`Total: ${manuallyFiltered.length} products`);
    manuallyFiltered.forEach((p: any) => {
        console.log(`  - ${p.name}`);
    });

    // 5. Check if there are products incorrectly assigned
    console.log(`\n--- Checking for incorrectly assigned products ---`);
    const incorrectProducts = allProducts.filter((p: any) => {
        const hasGuayeras = p.categories.some((c: any) => c.id === guayeras.id);
        const nameHasGuayera = p.name.toLowerCase().includes("guayera");
        return hasGuayeras !== nameHasGuayera;
    });

    if (incorrectProducts.length > 0) {
        console.log(`\n⚠️  Found ${incorrectProducts.length} potentially misassigned products:`);
        incorrectProducts.forEach((p: any) => {
            const cats = p.categories.map((c: any) => c.name).join(", ");
            console.log(`  - ${p.name} (Categories: ${cats})`);
        });
    } else {
        console.log(`\n✅ All products are correctly assigned!`);
    }
}

debugGuayeras().catch(console.error);
