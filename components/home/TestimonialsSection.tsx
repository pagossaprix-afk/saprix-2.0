"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import Image from "next/image";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const testimonials = [
    {
        id: 1,
        name: "Juan Pablo M.",
        role: "Jugador Amateur",
        location: "Medellín",
        content: "Las zapatillas llegaron al día siguiente y la calidad es impresionante. El agarre en cancha sintética es otro nivel. ¡Recomendadísimos!",
        rating: 5,
        avatar: "/avatars/user1.png", // Placeholder, usaremos div con iniciales si no hay imagen
    },
    {
        id: 2,
        name: "Carlos R.",
        role: "Entrenador",
        location: "Bogotá",
        content: "Llevo años comprando material deportivo y Saprix es de lo mejor que he encontrado. Seriedad en el envío y productos 100% originales.",
        rating: 5,
        avatar: "/avatars/user2.png",
    },
    {
        id: 3,
        name: "Andrés V.",
        role: "Portero",
        location: "Cali",
        content: "Compré unas rodilleras y unos guantes. La asesoría por WhatsApp fue excelente, me ayudaron a elegir la talla perfecta. Volveré a comprar.",
        rating: 5,
        avatar: "/avatars/user3.png",
    },
    {
        id: 4,
        name: "David S.",
        role: "Cliente Frecuente",
        location: "Barranquilla",
        content: "Me encanta que tengan variedad de marcas que no se consiguen fácil en otras tiendas. El envío gratis es un plus gigante.",
        rating: 4,
        avatar: "/avatars/user4.png",
    },
];

export default function TestimonialsSection() {
    return (
        <section className="py-24 bg-white dark:bg-gray-950 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none">
                <div className="absolute top-10 left-10 text-gray-100 dark:text-gray-900 opacity-50">
                    <Quote size={120} />
                </div>
                <div className="absolute bottom-10 right-10 text-gray-100 dark:text-gray-900 opacity-50 rotate-180">
                    <Quote size={120} />
                </div>
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 text-sm font-medium text-gray-600 dark:text-gray-300 mb-6"
                    >
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span>Confianza Saprix</span>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6"
                    >
                        Lo que dicen nuestros cracks
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        viewport={{ once: true }}
                        className="text-xl text-gray-600 dark:text-gray-400"
                    >
                        Más de 15.000 jugadores confían en nosotros para equiparse.
                    </motion.p>
                </div>

                <Swiper
                    modules={[Autoplay, Pagination, Navigation]}
                    spaceBetween={30}
                    slidesPerView={1}
                    breakpoints={{
                        640: { slidesPerView: 1 },
                        768: { slidesPerView: 2 },
                        1024: { slidesPerView: 3 },
                    }}
                    autoplay={{
                        delay: 4000,
                        disableOnInteraction: false,
                    }}
                    pagination={{
                        clickable: true,
                        dynamicBullets: true,
                    }}
                    loop={true}
                    className="pb-16"
                >
                    {testimonials.map((testimonial) => (
                        <SwiperSlide key={testimonial.id}>
                            <div className="h-full bg-gray-50 dark:bg-gray-900 p-8 rounded-3xl border border-gray-100 dark:border-gray-800 hover:border-saprix-electric-blue/30 transition-colors duration-300 flex flex-col">
                                {/* Stars */}
                                <div className="flex gap-1 mb-6">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-5 h-5 ${i < testimonial.rating
                                                    ? "text-yellow-400 fill-yellow-400"
                                                    : "text-gray-300 dark:text-gray-700"
                                                }`}
                                        />
                                    ))}
                                </div>

                                {/* Content */}
                                <blockquote className="flex-grow text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
                                    "{testimonial.content}"
                                </blockquote>

                                {/* Author */}
                                <div className="flex items-center gap-4 mt-auto pt-6 border-t border-gray-200 dark:border-gray-800">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-saprix-electric-blue to-saprix-lime flex items-center justify-center text-white font-bold text-lg">
                                        {testimonial.name.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="font-bold text-gray-900 dark:text-white">
                                            {testimonial.name}
                                        </div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                            {testimonial.role} • {testimonial.location}
                                            <span className="text-green-500 ml-1" title="Comprador Verificado">
                                                ✓
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
}
