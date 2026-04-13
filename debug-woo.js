async function fetchProduct(productId) {
    const url = `https://pagos.saprix.com.co/wp-json/wc/v3/products/${productId}?consumer_key=ck_9a4fc1afc791276ea1bc5fe5f074ec04f450955b&consumer_secret=cs_3de760630dc6d8457995b1f339c3e1519cb415f2`;
    try {
        const response = await fetch(url);
        const p = await response.json();
        console.log(`Product ${productId}:`);
        console.log(`Name: ${p.name}`);
        console.log(`Attributes:`, JSON.stringify(p.attributes, null, 2));
        console.log('---');
    } catch (error) {
        console.error(error.message);
    }
}

async function run() {
    await fetchProduct(9848);
}

run();
