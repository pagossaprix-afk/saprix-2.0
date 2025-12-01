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

async function auditCategories() {
    const api = getWooApi();

    console.log("Fetching all categories...");
    const { data: categories } = await api.get("products/categories", { per_page: 100 });

    console.log("Fetching all products...");
    const { data: products } = await api.get("products", { per_page: 100 });

    console.log("\n=== CATEGORY AUDIT ===\n");

    // Check specific problematic categories
    const problematicCategories = [
        "Medias Futsal",
        "Guayeras",
        "Balones Futsal",
        "Accesorios Deportivos Futsal"
    ];

    for (const catName of problematicCategories) {
        const category = categories.find((c: any) => c.name === catName);

        if (!category) {
            console.log(`❌ Category "${catName}" NOT FOUND`);
            continue;
        }

        console.log(`\n📁 ${catName} (ID: ${category.id}, Parent: ${category.parent})`);

        // Find products in this category
        const productsInCat = products.filter((p: any) =>
            p.categories.some((c: any) => c.id === category.id)
        );

        console.log(`   Products count: ${productsInCat.length}`);

        if (productsInCat.length > 0) {
            console.log(`   Products:`);
            productsInCat.forEach((p: any) => {
                const allCats = p.categories.map((c: any) => c.name).join(", ");
                console.log(`     - ${p.name} (Categories: ${allCats})`);
            });
        }
    }

    // Check for products with wrong categories
    console.log("\n\n=== CHECKING FOR MISPLACED PRODUCTS ===\n");

    const mediasCategory = categories.find((c: any) => c.name === "Medias Futsal");
    if (mediasCategory) {
        const mediasProducts = products.filter((p: any) =>
            p.categories.some((c: any) => c.id === mediasCategory.id)
        );

        console.log(`\nProducts in "Medias Futsal" category:`);
        mediasProducts.forEach((p: any) => {
            const isActuallyMedia = p.name.toLowerCase().includes("media");
            const status = isActuallyMedia ? "✅" : "❌ WRONG!";
            console.log(`  ${status} ${p.name}`);
        });
    }

    const balonesCategory = categories.find((c: any) => c.name === "Balones Futsal");
    if (balonesCategory) {
        const balonesProducts = products.filter((p: any) =>
            p.categories.some((c: any) => c.id === balonesCategory.id)
        );

        console.log(`\nProducts in "Balones Futsal" category:`);
        balonesProducts.forEach((p: any) => {
            const isActuallyBalon = p.name.toLowerCase().includes("balón") || p.name.toLowerCase().includes("balon");
            const status = isActuallyBalon ? "✅" : "❌ WRONG!";
            console.log(`  ${status} ${p.name}`);
        });
    }
}

auditCategories().catch(console.error);
