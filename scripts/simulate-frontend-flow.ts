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

async function simulateFrontendFlow() {
    const api = getWooApi();

    console.log("=== SIMULATING FRONTEND FLOW ===\n");

    // Step 1: Get all categories (like getShopSidebarData does)
    console.log("Step 1: Fetching categories...");
    const { data: categories } = await api.get("products/categories", { per_page: 100 });
    console.log(`  ✅ Got ${categories.length} categories`);

    // Step 2: User clicks on "Guayeras" - we have the slug
    const selectedSlug = "guayeras";
    console.log(`\nStep 2: User clicked on category with slug: "${selectedSlug}"`);

    // Step 3: Convert slug to ID
    const category = categories.find((c: any) => c.slug === selectedSlug);
    if (!category) {
        console.error(`  ❌ ERROR: Category with slug "${selectedSlug}" not found!`);
        return;
    }

    console.log(`  ✅ Found category:`, {
        id: category.id,
        name: category.name,
        slug: category.slug,
        count: category.count
    });

    // Step 4: Fetch products with this category ID
    console.log(`\nStep 3: Fetching products with category=${category.id}...`);
    const { data: products } = await api.get("products", {
        category: category.id,
        per_page: 12,
        status: 'publish',
        orderby: 'date',
        order: 'desc'
    });

    console.log(`  ✅ Got ${products.length} products`);

    if (products.length > 0) {
        console.log(`\n  Products returned:`);
        products.forEach((p: any) => {
            const cats = p.categories.map((c: any) => c.name).join(", ");
            console.log(`    - ${p.name} (Categories: ${cats})`);
        });
    } else {
        console.log(`  ⚠️  No products found!`);
    }

    // Step 5: Verify the products actually belong to this category
    console.log(`\n  Verification:`);
    const correctProducts = products.filter((p: any) =>
        p.categories.some((c: any) => c.id === category.id)
    );

    if (correctProducts.length === products.length) {
        console.log(`    ✅ All ${products.length} products correctly belong to "${category.name}"`);
    } else {
        console.log(`    ❌ ERROR: Only ${correctProducts.length}/${products.length} products belong to "${category.name}"`);
    }
}

simulateFrontendFlow().catch(console.error);
