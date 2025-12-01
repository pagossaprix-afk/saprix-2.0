"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function BrandStory() {
    return (
        <section className="py-20 bg-white dark:bg-gray-900 overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    {/* Left - Images */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative"
                    >
                        <div className="grid grid-cols-2 gap-4">
                            {/* Large image - Banner World */}
                            <div className="col-span-2 relative aspect-[16/10] rounded-none overflow-hidden bg-gray-100 dark:bg-gray-800 group">
                                <Image
                                    src="/banners/proximamente coleccion world.png"
                                    alt="Saprix Colección World"
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                            </div>

                            {/* Two smaller images */}
                            <div className="relative aspect-square rounded-none overflow-hidden bg-gray-100 dark:bg-gray-800 group">
                                <Image
                                    src="/ACCESORIOS/Balon Saprix Futsal Microfutbol.png"
                                    alt="Saprix Equipment"
                                    fill
                                    className="object-contain p-4 transition-transform duration-700 group-hover:scale-110"
                                />
                            </div>
                            <div className="relative aspect-square rounded-none overflow-hidden bg-gray-100 dark:bg-gray-800 group">
                                <Image
                                    src="/LONDRES/Zapatillas Londres Saprix Futsal Microfutbol (5).png"
                                    alt="Saprix Technology"
                                    fill
                                    className="object-contain p-4 transition-transform duration-700 group-hover:scale-110"
                                />
                            </div>
                        </div>

                        {/* Floating badge */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4, duration: 0.6 }}
                            className="absolute -bottom-6 -right-6 bg-saprix-lime dark:bg-saprix-lime/20 dark:backdrop-blur-md dark:border dark:border-saprix-lime/30 dark:text-white text-black px-8 py-6 rounded-2xl shadow-2xl"
                        >
                            <div className="text-4xl font-bold">2025</div>
                            <div className="text-sm font-medium">Nueva Era</div>
                        </motion.div>
                    </motion.div>

                    {/* Right - Content */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="space-y-6"
                    >
                        <div className="inline-block px-4 py-2 bg-saprix-electric-blue/10 text-saprix-electric-blue text-sm font-bold rounded-full">
                            🚀 Próximo Lanzamiento
                        </div>

                        <h2 className="text-5xl sm:text-6xl font-bold leading-tight text-gray-900 dark:text-white">
                            Colección
                            <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-400 to-lime-400">
                                World Series
                            </span>
                        </h2>

                        <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                            Prepárate para una revolución en la cancha. La nueva colección World de Saprix fusiona diseño global con la tecnología que ya conoces y amas.
                        </p>

                        <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                            Inspirada en las capitales del fútbol mundial, cada par cuenta una historia de pasión, gloria y victoria. No es solo calzado, es un legado.
                        </p>

                        {/* Features */}
                        <div className="grid grid-cols-2 gap-6 pt-6">
                            <div className="space-y-2">
                                <div className="w-12 h-12 bg-saprix-electric-blue dark:bg-saprix-electric-blue/20 dark:backdrop-blur-md dark:border dark:border-saprix-electric-blue/30 rounded-xl flex items-center justify-center">
                                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="font-bold text-lg text-gray-900 dark:text-white">Diseño Global</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Estética inspirada en tendencias internacionales
                                </p>
                            </div>

                            <div className="space-y-2">
                                <div className="w-12 h-12 bg-saprix-electric-blue dark:bg-saprix-electric-blue/20 dark:backdrop-blur-md dark:border dark:border-saprix-electric-blue/30 rounded-xl flex items-center justify-center">
                                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <h3 className="font-bold text-lg text-gray-900 dark:text-white">Tecnología Pro</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Suela de agarre extremo y amortiguación reactiva
                                </p>
                            </div>

                            <div className="space-y-2">
                                <div className="w-12 h-12 bg-saprix-electric-blue dark:bg-saprix-electric-blue/20 dark:backdrop-blur-md dark:border dark:border-saprix-electric-blue/30 rounded-xl flex items-center justify-center">
                                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="font-bold text-lg text-gray-900 dark:text-white">Edición Limitada</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Unidades exclusivas para los verdaderos fans
                                </p>
                            </div>

                            <div className="space-y-2">
                                <div className="w-12 h-12 bg-saprix-electric-blue dark:bg-saprix-electric-blue/20 dark:backdrop-blur-md dark:border dark:border-saprix-electric-blue/30 rounded-xl flex items-center justify-center">
                                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                    </svg>
                                </div>
                                <h3 className="font-bold text-lg text-gray-900 dark:text-white">Espéralo Pronto</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Suscríbete para ser el primero en saber
                                </p>
                            </div>
                        </div>

                        {/* CTA */}
                        <div className="pt-6">
                            <Link
                                href="/contacto"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-saprix-electric-blue text-white font-semibold rounded-full hover:bg-saprix-electric-blue-dark transition-colors duration-300 shadow-lg shadow-saprix-electric-blue/30"
                            >
                                Notificarme del Lanzamiento
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
