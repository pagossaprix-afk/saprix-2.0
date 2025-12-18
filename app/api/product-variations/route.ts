import { NextRequest, NextResponse } from 'next/server';
import { getColorOptionsFromVariations, getSizeOptionsFromVariations, getProductVariations } from '@/lib/woocommerce';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const productId = searchParams.get('productId');

    if (!productId) {
        return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    try {
        const id = parseInt(productId);

        const [colorOptions, sizeOptions, variations] = await Promise.all([
            getColorOptionsFromVariations(id),
            getSizeOptionsFromVariations(id),
            getProductVariations(id)
        ]);

        return NextResponse.json({
            colorOptions,
            sizeOptions,
            variations
        });
    } catch (error) {
        console.error('Error fetching product variations:', error);
        return NextResponse.json({ error: 'Failed to fetch variations' }, { status: 500 });
    }
}
