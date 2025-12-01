
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

async function inspectAndFix() {
    const api = getWooApi();
    console.log("Fetching all categories...");

    const { data: categories } = await api.get("products/categories", { per_page: 100 });

    // Helper to find category by name (case insensitive)
    const findCat = (name: string) => categories.find((c: any) => c.name.toLowerCase().trim() === name.toLowerCase().trim());

    const world = findCat("World");
    const zapNacionales = findCat("Zapatillas Nacionales");

    console.log("--- Targets ---");
    console.log("World:", world ? `${world.name} (${world.id})` : "NOT FOUND");
    console.log("Zapatillas Nacionales:", zapNacionales ? `${zapNacionales.name} (${zapNacionales.id})` : "NOT FOUND");

    // Define intended structure based on user images
    const structure = [
        {
            parentName: "World",
            childrenNames: ["Berlin", "Kids", "Londres", "Roma", "Tokio"]
        },
        {
            parentName: "Zapatillas Nacionales",
            childrenNames: ["Clásicas Sala", "PE", "Wonder"]
        }
    ];

    console.log("\n--- Applying Fixes ---");

    for (const group of structure) {
        const parent = findCat(group.parentName);
        if (!parent) {
            console.error(`Skipping group ${group.parentName} because parent was not found.`);
            continue;
        }

        for (const childName of group.childrenNames) {
            const child = findCat(childName);
            if (child) {
                if (child.parent !== parent.id) {
                    console.log(`Moving '${child.name}' (ID: ${child.id}) to parent '${parent.name}' (ID: ${parent.id})...`);
                    try {
                        await api.put(`products/categories/${child.id}`, { parent: parent.id });
                        console.log("  Success.");
                    } catch (e: any) {
                        console.error("  Failed:", e.message);
                    }
                } else {
                    console.log(`'${child.name}' is already correctly placed under '${parent.name}'.`);
                }
            } else {
                console.warn(`Child category '${childName}' not found.`);
            }
        }
    }

    console.log("\n--- Final Hierarchy Verification ---");
    // Re-fetch to see changes
    const { data: newCats } = await api.get("products/categories", { per_page: 100 });

    // Sort for easier reading
    newCats.sort((a: any, b: any) => a.name.localeCompare(b.name));

    const printTree = (parentId: number, level: number) => {
        const children = newCats.filter((c: any) => c.parent === parentId);
        children.forEach((c: any) => {
            console.log(`${"  ".repeat(level)}└─ ${c.name} (ID: ${c.id})`);
            printTree(c.id, level + 1);
        });
    };

    // Print Roots
    newCats.filter((c: any) => c.parent === 0).forEach((c: any) => {
        console.log(`[Root] ${c.name} (ID: ${c.id})`);
        printTree(c.id, 1);
    });
}

inspectAndFix();
