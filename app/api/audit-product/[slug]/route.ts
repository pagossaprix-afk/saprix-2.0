import { NextResponse } from 'next/server';
import { getWooApi } from '@/lib/woocommerce';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export async function GET(
  _req: any,
  context: any
) {
  try {
    const maybeParams = context?.params;
    const resolvedParams = maybeParams && typeof maybeParams.then === 'function' 
      ? await maybeParams 
      : maybeParams;
    const slug = resolvedParams?.slug;

    if (!slug) {
      return NextResponse.json({ error: 'Missing slug param' }, { status: 400 });
    }

    const productResponse = await getWooApi().get('products', {
      slug,
      per_page: 1,
    });

    if (!productResponse.data || productResponse.data.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const product = productResponse.data[0];

    let variations: any[] = [];
    if (product.type === 'variable' && product.variations?.length > 0) {
      const variationsResponse = await getWooApi().get(`products/${product.id}/variations`);
      variations = variationsResponse.data || [];
    }

    return NextResponse.json({
      product: {
        id: product.id,
        name: product.name,
        slug: product.slug,
        type: product.type,
      },
      attributes: product.attributes,
      variation_ids: product.variations,
      variations_sample: variations.slice(0, 1),
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to fetch product audit', message: error?.message ?? 'Unknown error' },
      { status: 500 }
    );
  }
}
