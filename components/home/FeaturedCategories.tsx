'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Jost } from 'next/font/google';

const jost = Jost({ subsets: ['latin'], weight: ['400', '700', '900'], style: ['normal'] });

interface Category {
    id: number;
    name: string;
    slug: string;
    image?: { src: string; alt?: string } | null;
    count?: number;
}

interface FeaturedCategoriesProps {
    categories: Category[];
}

export default function FeaturedCategories({ categories }: FeaturedCategoriesProps) {
    // Configuración de medios por nombre de categoría (slug o nombre parcial)
    const mediaByName: Record<string, { src: string; kind: "image" | "video"; alt?: string }> = {
        "accesorios": {
            src: "/ACCESORIOS/Guantes Saprix Futsal Microfutbol.mp4",
            kind: "video",
            alt: "Accesorios Saprix",
        },
        "accesorios deportivos futsal": {
            src: "/ACCESORIOS/Guantes Saprix Futsal Microfutbol.mp4",
            kind: "video",
            alt: "Guantes Saprix Futsal",
        },
        "londres": {
            src: "/Publicidad/LONDRESNEGRA1.jpg",
            kind: "image",
            alt: "Zapatillas Londres",
        },
        "roma": {
            src: "/Publicidad/ROMANEON1.jpg",
            kind: "image",
            alt: "Zapatillas Roma",
        },
        "zapatillas": {
            src: "/ROMA/Zapatillas Roma Saprix Futsal Microfutbol (2).mp4",
            kind: "video",
            alt: "Zapatillas Saprix General",
        },
    };

    // Lógica para ordenar y seleccionar las categorías prioritarias
    const priorityOrder = ['accesorios', 'londres', 'roma', 'zapatillas'];

    const displayCategories = (() => {
        const selected: Category[] = [];
        const usedIds = new Set<number>();

        // 1. Buscar categorías prioritarias
        priorityOrder.forEach(term => {
            const found = categories.find(c =>
                !usedIds.has(c.id) && c.name.toLowerCase().includes(term)
            );
            if (found) {
                selected.push(found);
                usedIds.add(found.id);
            }
        });

        // 2. Rellenar con otras categorías si no llegamos a 4
        if (selected.length < 4) {
            categories.forEach(c => {
                if (selected.length < 4 && !usedIds.has(c.id)) {
                    selected.push(c);
                    usedIds.add(c.id);
                }
            });
        }

        return selected;
    })();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
            },
        },
    };

    return (
        <section className="py-20 bg-white dark:bg-gray-900">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className={`${jost.className} text-5xl sm:text-6xl font-bold mb-4 text-gray-900 dark:text-white`}>
                        Explora por Categoría
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        Encuentra exactamente lo que necesitas para tu mejor rendimiento
                    </p>
                </motion.div>

                {/* Categories Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    {displayCategories.map((category) => (
                        <motion.div key={category.id} variants={itemVariants}>
                            <Link
                                href={`/tienda?categoria=${category.slug}`}
                                className="group block relative overflow-hidden rounded-3xl bg-gray-50 dark:bg-gray-800/40 dark:backdrop-blur-md dark:border dark:border-white/10 hover:shadow-2xl dark:hover:shadow-saprix-electric-blue/20 transition-all duration-500"
                            >
                                {/* Image Container */}
                                <div className="relative aspect-[3/4] overflow-hidden">
                                    {(() => {
                                        const categoryNameLower = category.name.toLowerCase();
                                        // Buscar si alguna key de mediaByName está contenida en el nombre de la categoría
                                        const matchedKey = Object.keys(mediaByName).find(key => categoryNameLower.includes(key));
                                        const custom = matchedKey ? mediaByName[matchedKey] : undefined;

                                        const media = custom || (category.image?.src ? { src: category.image.src, kind: "image", alt: category.image.alt || category.name } : undefined);
                                        if (media?.kind === "video") {
                                            return (
                                                <video
                                                    src={media.src}
                                                    className="w-full h-full object-cover"
                                                    autoPlay
                                                    muted
                                                    loop
                                                    playsInline
                                                />
                                            );
                                        }
                                        if (media?.kind === "image") {
                                            return (
                                                <Image
                                                    src={media.src}
                                                    alt={media.alt || category.name}
                                                    fill
                                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                                />
                                            );
                                        }
                                        return (
                                            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
                                                <svg
                                                    className="w-24 h-24 text-gray-300 dark:text-gray-600"
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
                                        );
                                    })()}

                                    {/* Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                </div>

                                {/* Content */}
                                <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                                    <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                                    {category.count !== undefined && (
                                        <p className="text-sm text-white/80 mb-3">
                                            {category.count} {category.count === 1 ? 'producto' : 'productos'}
                                        </p>
                                    )}
                                    <div className="flex items-center gap-2 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                                        Ver todo
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </div>
                                </div>

                                {/* Hover Border Effect */}
                                <div className="absolute inset-0 border-2 border-transparent group-hover:border-saprix-electric-blue dark:group-hover:border-saprix-lime rounded-3xl transition-colors duration-500" />
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>

                {/* View All Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="text-center mt-12"
                >
                    <Link
                        href="/tienda"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-saprix-electric-blue text-white font-semibold rounded-full hover:bg-saprix-electric-blue-dark transition-colors duration-300"
                    >
                        Ver Todas las Categorías
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
