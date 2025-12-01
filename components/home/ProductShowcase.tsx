'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { ensureHttps } from '@/lib/utils';

interface Product {
    id: number;
    name: string;
    slug: string;
    images: Array<{ src: string; alt?: string }>;
    price_html?: string;
    price?: string;
}

interface ProductShowcaseProps {
    products: Product[];
    title?: string;
    subtitle?: string;
}

export default function ProductShowcase({
    products,
    title = "Productos Destacados",
    subtitle = "Lo mejor de nuestra colección seleccionado para ti"
}: ProductShowcaseProps) {
    // Tomar los primeros 6 productos
    const displayProducts = products.slice(0, 6);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: 'easeOut',
            },
        },
    };

    const { addItem } = useCart();

    const handleAddToCart = (e: React.MouseEvent, product: Product) => {
        e.preventDefault();
        e.stopPropagation();

        // Extract numeric price from price_html if possible, or default to 0
        // This is a fallback since we don't have raw price here yet
        // Ideally we should pass raw price from parent
        const priceString = product.price || product.price_html?.replace(/[^0-9.]/g, '') || "0";
        const price = parseFloat(priceString);

        addItem({
            id: product.id,
            name: product.name,
            price: price,
            quantity: 1,
            image: ensureHttps(product.images[0]?.src) || '/placeholder-image.png',
            slug: product.slug
        });
    };

    return (
        <section className="py-20 bg-gray-50 dark:bg-gray-800">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-3xl sm:text-5xl lg:text-6xl font-bold mb-4 text-gray-900 dark:text-white font-inter italic"
                    >
                        {title}
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
                    >
                        {subtitle}
                    </motion.p>
                </div>

                {/* Products Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {displayProducts.map((product) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <Link
                                href={`/producto/${product.slug}`}
                                className="group block bg-white dark:bg-gray-900/40 dark:backdrop-blur-md dark:border dark:border-white/10 overflow-hidden hover:shadow-2xl dark:hover:shadow-saprix-electric-blue/30 dark:hover:border-saprix-electric-blue/50 transition-all duration-500"
                            >
                                {/* Image Container */}
                                <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800">
                                    {product.images && product.images[0] ? (
                                        <Image
                                            src={ensureHttps(product.images[0].src)}
                                            alt={product.images[0].alt || product.name}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <svg
                                                className="w-24 h-24 text-gray-300"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={1}
                                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                />
                                            </svg>
                                        </div>
                                    )}

                                    {/* Quick View Button */}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                                        <span className="px-6 py-3 bg-white dark:bg-saprix-lime text-black font-semibold rounded-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                            Ver Detalles
                                        </span>
                                    </div>
                                </div>

                                {/* Product Info */}
                                <div className="p-6">
                                    <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white group-hover:text-saprix-electric-blue dark:group-hover:text-saprix-lime transition-colors line-clamp-2 font-inter not-italic">
                                        {product.name}
                                    </h3>

                                    {product.price_html && (
                                        <div
                                            className="text-lg font-semibold text-saprix-electric-blue dark:text-saprix-lime"
                                            dangerouslySetInnerHTML={{ __html: product.price_html }}
                                        />
                                    )}

                                    {/* Add to Cart Icon */}
                                    <div className="mt-4 flex items-center justify-between">
                                        <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-saprix-electric-blue dark:group-hover:text-saprix-lime transition-colors">
                                            Ver producto →
                                        </span>
                                        <button
                                            onClick={(e) => handleAddToCart(e, product)}
                                            className="w-10 h-10 rounded-full bg-saprix-electric-blue text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 hover:bg-saprix-electric-blue-dark"
                                            title="Agregar al carrito"
                                        >
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>

                {/* View All Products Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="text-center mt-12"
                >
                    <Link
                        href="/tienda"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-saprix-electric-blue text-white font-semibold rounded-full hover:bg-saprix-electric-blue-dark transition-colors duration-300 shadow-lg hover:shadow-xl"
                    >
                        Ver Todos los Productos
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
