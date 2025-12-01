'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCreative, Autoplay, Pagination, Navigation } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { ensureHttps } from '@/lib/utils';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-creative';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

interface Product {
    id: number;
    name: string;
    slug: string;
    images: Array<{ src: string; alt?: string }>;
    price_html?: string;
    price?: string;
}

interface NewCollectionSectionProps {
    products: Product[];
}

export default function NewCollectionSection({ products }: NewCollectionSectionProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [swiper, setSwiper] = useState<SwiperType | null>(null);
    const { addItem } = useCart();

    // Si no hay productos, mostrar mensaje
    if (!products || products.length === 0) {
        return (
            <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-4xl font-bold text-gray-400 dark:text-gray-500">No hay productos destacados</h2>
                </div>
            </section>
        );
    }

    const currentProduct = products[activeIndex];

    return (
        <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 overflow-hidden py-20">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    key={`bg-1-${activeIndex}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 0.2, scale: 1 }}
                    transition={{ duration: 1 }}
                    className="absolute -top-40 -right-40 w-96 h-96 bg-saprix-electric-blue/30 rounded-full blur-3xl"
                />
                <motion.div
                    key={`bg-2-${activeIndex}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 0.2, scale: 1 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="absolute -bottom-40 -left-40 w-96 h-96 bg-saprix-lime/30 rounded-full blur-3xl"
                />
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    {/* Left Content - Animated */}
                    <div className="space-y-8 order-2 lg:order-1">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={`content-${activeIndex}`}
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 50 }}
                                transition={{ duration: 0.5 }}
                                className="space-y-8"
                            >
                                {/* Small badge */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2, duration: 0.6 }}
                                    className="inline-block"
                                >
                                    <span className="px-4 py-2 bg-saprix-electric-blue text-white text-sm font-medium rounded-full">
                                        Nueva Colección 2025
                                    </span>
                                </motion.div>

                                {/* Main heading */}
                                <motion.h1
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3, duration: 0.6 }}
                                    className="text-6xl sm:text-7xl lg:text-8xl font-bold leading-none tracking-tight text-gray-900 dark:text-white"
                                >
                                    {currentProduct.name.split(' ').slice(0, 2).join(' ')}
                                    <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-400 to-lime-400">
                                        {currentProduct.name.split(' ').slice(2).join(' ') || 'Premium'}
                                    </span>
                                </motion.h1>

                                {/* Description */}
                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4, duration: 0.6 }}
                                    className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 max-w-xl leading-relaxed"
                                >
                                    Descubre la nueva generación de calzado deportivo diseñado para atletas que no aceptan compromisos.
                                </motion.p>

                                {/* CTA Buttons */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5, duration: 0.6 }}
                                    className="flex flex-wrap gap-4"
                                >
                                    <Link
                                        href={`/producto/${currentProduct.slug}`}
                                        className="group px-8 py-4 bg-saprix-electric-blue text-white font-semibold rounded-none -skew-x-6 hover:bg-saprix-electric-blue-dark transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl"
                                    >
                                        <span className="skew-x-6">Comprar Ahora</span>
                                        <svg
                                            className="w-5 h-5 group-hover:translate-x-1 transition-transform skew-x-6"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </Link>
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            const priceString = currentProduct.price || currentProduct.price_html?.replace(/[^0-9.]/g, '') || "0";
                                            const price = parseFloat(priceString);
                                            addItem({
                                                id: currentProduct.id,
                                                name: currentProduct.name,
                                                price: price,
                                                quantity: 1,
                                                image: ensureHttps(currentProduct.images[0]?.src) || '/placeholder-image.png',
                                                slug: currentProduct.slug
                                            });
                                        }}
                                        className="px-8 py-4 bg-saprix-lime text-black font-semibold rounded-none -skew-x-6 hover:bg-saprix-lime/80 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2"
                                    >
                                        <span className="skew-x-6">Añadir al Carrito</span>
                                        <svg className="w-5 h-5 skew-x-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                        </svg>
                                    </button>
                                </motion.div>

                                {/* Price */}
                                {currentProduct.price_html && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.6, duration: 0.6 }}
                                        className="pt-4"
                                    >
                                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Precio</div>
                                        <div
                                            className="text-4xl font-bold text-saprix-electric-blue dark:text-saprix-lime"
                                            dangerouslySetInnerHTML={{ __html: currentProduct.price_html }}
                                        />
                                    </motion.div>
                                )}
                            </motion.div>
                        </AnimatePresence>

                        {/* Slider Controls */}
                        <div className="flex items-center gap-4 pt-8">
                            <button
                                onClick={() => swiper?.slidePrev()}
                                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-saprix-electric-blue text-white flex items-center justify-center hover:bg-saprix-electric-blue-dark transition-colors"
                                aria-label="Anterior"
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <button
                                onClick={() => swiper?.slideNext()}
                                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-saprix-electric-blue text-white flex items-center justify-center hover:bg-saprix-electric-blue-dark transition-colors"
                                aria-label="Siguiente"
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                            <div className="flex-1 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-gradient-to-r from-saprix-electric-blue to-saprix-lime"
                                    initial={{ width: '0%' }}
                                    animate={{ width: `${((activeIndex + 1) / products.length) * 100}%` }}
                                    transition={{ duration: 0.3 }}
                                />
                            </div>
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                {activeIndex + 1} / {products.length}
                            </span>
                        </div>
                    </div>

                    {/* Right Content - Swiper Slider */}
                    <div className="relative order-1 lg:order-2">
                        <Swiper
                            onSwiper={setSwiper}
                            onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
                            effect="slide"
                            grabCursor={true}
                            loop={true}
                            autoplay={{
                                delay: 5000,
                                disableOnInteraction: false,
                            }}
                            speed={800}
                            spaceBetween={30}
                            modules={[Autoplay, Pagination, Navigation]}
                            className="w-full aspect-square"
                        >
                            {products.map((product) => (
                                <SwiperSlide key={product.id}>
                                    <div className="relative w-full h-full">
                                        {/* Decorative circle background */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-saprix-lime/20 to-saprix-electric-blue/20 rounded-full blur-3xl scale-110" />

                                        {/* Product image */}
                                        <motion.div
                                            initial={{ scale: 0.8, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            transition={{ duration: 0.8 }}
                                            className="relative z-10 w-full h-full flex items-center justify-center"
                                        >
                                            {product.images && product.images[0] ? (
                                                <div className="relative w-full h-full group">
                                                    <Image
                                                        src={ensureHttps(product.images[0].src)}
                                                        alt={product.images[0].alt || product.name}
                                                        fill
                                                        className="object-contain drop-shadow-2xl group-hover:scale-105 transition-transform duration-500"
                                                        priority
                                                    />
                                                </div>
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                                                    <div className="text-center text-gray-400">
                                                        <svg className="w-32 h-32 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={1}
                                                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                            />
                                                        </svg>
                                                        <p className="text-lg">{product.name}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </motion.div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>

                        {/* Thumbnails */}
                        <div className="flex gap-2 mt-6 justify-center">
                            {products.map((product, index) => (
                                <button
                                    key={product.id}
                                    onClick={() => swiper?.slideTo(index)}
                                    className={`w-16 h-16 overflow-hidden border-2 transition-all ${index === activeIndex
                                        ? 'border-saprix-electric-blue scale-110 shadow-lg shadow-saprix-electric-blue/50'
                                        : 'border-gray-200 dark:border-gray-700 opacity-50 hover:opacity-100'
                                        }`}
                                >
                                    {product.images && product.images[0] ? (
                                        <Image
                                            src={ensureHttps(product.images[0].src)}
                                            alt={product.images[0].alt || product.name}
                                            width={64}
                                            height={64}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-100 dark:bg-gray-800" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Scroll indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.6 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2"
            >
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="flex flex-col items-center gap-2 text-gray-400"
                >
                    <span className="text-sm">Desliza</span>
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                </motion.div>
            </motion.div>
        </section>
    );
}
