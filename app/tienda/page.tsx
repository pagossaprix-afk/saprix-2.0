import { Suspense } from 'react';
import { ShopClient } from '@/components/shop/ShopClient';
import { getAllProductCategories } from '@/lib/woocommerce';
import { getWooApi } from '@/lib/woocommerce';

export const metadata = {
  title: 'Tienda - Saprix',
  description: 'Descubre nuestra colección completa de zapatillas, balones y accesorios para futsal',
};

async function getAllProducts() {
  try {
    const api = getWooApi();
    const { data } = await api.get('products', {
      per_page: 100,
      status: 'publish',
    });
    return data;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export default async function TiendaPage() {
  const [products, categories] = await Promise.all([
    getAllProducts(),
    getAllProductCategories(),
  ]);

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">
      <div className="text-2xl font-black">CARGANDO...</div>
    </div>}>
      <ShopClient
        initialProducts={products}
        categories={categories}
      />
    </Suspense>
  );
}