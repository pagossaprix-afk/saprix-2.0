"use client";

import { motion } from "framer-motion";
import { Truck, ShieldCheck, Medal, CheckCircle2 } from "lucide-react";

const stats = [
    {
        id: 1,
        icon: <Truck className="w-8 h-8" />,
        title: "Envíos Flash a todo el país",
        description: "De nuestra bodega a tu cancha en tiempo récord. Cubrimos toda Colombia.",
    },
    {
        id: 2,
        icon: <ShieldCheck className="w-8 h-8" />,
        title: "Compra 100% Segura",
        description: "Tu dinero y tus datos están protegidos. Garantía de satisfacción total.",
    },
    {
        id: 3,
        icon: <Medal className="w-8 h-8" />,
        title: "Calidad Profesional",
        description: "Solo distribuimos marcas originales y productos testeados por expertos.",
    },
];

export default function StatsSection() {
    return (
        <section className="py-20 bg-gray-50 dark:bg-gray-900 overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

                    {/* Columna Izquierda: Lista de Méritos */}
                    <div className="space-y-6">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={stat.id}
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="group flex items-start gap-6 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 dark:border-gray-700"
                            >
                                <div className="flex-shrink-0 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl text-saprix-electric-blue group-hover:bg-saprix-electric-blue group-hover:text-white transition-colors duration-300">
                                    {stat.icon}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-saprix-electric-blue transition-colors">
                                        {stat.title}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                        {stat.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Columna Derecha: Gran Estadística */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="relative p-8 sm:p-12 bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 lg:ml-auto max-w-lg w-full"
                    >
                        {/* Decorative Blob */}
                        <div className="absolute -top-20 -right-20 w-64 h-64 bg-saprix-lime/20 rounded-full blur-3xl pointer-events-none" />
                        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-saprix-electric-blue/20 rounded-full blur-3xl pointer-events-none" />

                        {/* Floating Shoe Image */}
                        <motion.div
                            animate={{ y: [-10, 10, -10], rotate: [0, 5, 0] }}
                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -top-24 -right-12 w-48 h-48 md:w-64 md:h-64 pointer-events-none z-20 hidden sm:block"
                        >
                            <img
                                src="/LONDRES/Zapatillas Londres Negra Saprix Futsal Microfutbol (1).png"
                                alt=""
                                aria-hidden="true"
                                className="w-full h-full object-contain drop-shadow-2xl"
                            />
                        </motion.div>

                        <div className="relative z-10">
                            <div className="flex items-start gap-2 mb-2">
                                <span className="text-8xl sm:text-9xl font-black text-gray-900 dark:text-white tracking-tighter leading-none">
                                    15
                                </span>
                                <span className="text-4xl sm:text-5xl font-bold text-saprix-electric-blue mt-4">+</span>
                            </div>
                            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                                Mil Cracks Equipados
                            </h2>
                            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                                Nos hemos convertido en la tienda favorita de los salonistas en Colombia. Calidad, rapidez y pasión por el futsal.
                            </p>

                            <div className="space-y-4">
                                {[
                                    "Distribuidores Oficiales",
                                    "Asesoría Personalizada",
                                    "Comunidad Activa",
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className="p-1 bg-saprix-lime rounded-full">
                                            <CheckCircle2 className="w-4 h-4 text-black" />
                                        </div>
                                        <span className="font-medium text-gray-700 dark:text-gray-200">
                                            {item}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
