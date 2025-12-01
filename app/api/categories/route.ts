import { NextResponse } from 'next/server';
import { getAllProductCategories } from '@/lib/woocommerce';

export async function GET() {
    try {
        const categories = await getAllProductCategories();
        return NextResponse.json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
    }
}
