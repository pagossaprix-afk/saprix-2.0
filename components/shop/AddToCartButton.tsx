"use client";

import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import type { Product } from '@/types/woocommerce';

interface AddToCartButtonProps {
    product: Product;
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
    const { addItem } = useCart();

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const price = parseFloat(product.price || product.price_html?.replace(/[^0-9.]/g, '') || '0');

        addItem({
            id: product.id,
            name: product.name,
            price: price,
            quantity: 1,
            image: product.images?.[0]?.src || '/placeholder-image.png',
            slug: product.slug
        });
    };

    return (
        <button
            onClick={handleAddToCart}
            className="w-12 h-12 bg-white dark:bg-gray-900 rounded-full flex items-center justify-center shadow-lg hover:bg-saprix-electric-blue hover:text-white transition-all duration-300"
            aria-label="Agregar al carrito"
        >
            <ShoppingCart className="w-5 h-5" />
        </button>
    );
}
