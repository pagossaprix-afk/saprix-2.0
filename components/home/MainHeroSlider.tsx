"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination, Navigation } from "swiper/modules";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import "swiper/css/navigation";

const banners = [

    {
        id: 0,
        src: "/banners/nuevas-tokio-saprix.webp",
        alt: "Nueva Colección Tokio Saprix",
        title: "Lllegaron las más pedidas",
        subtitle: "Referencia",
        link: "/tienda",
        align: "center",
        buttonText: "Compralas yá!"
    },
    {
        id: 1,
        src: "/banners/Zapatillas Saprix - .ref Tokio Negra.webp",
        alt: "Zapatillas Saprix Tokio Negra",
        title: "Rendimiento Superior Tokio",
        subtitle: "Control y tracción en negro",
        link: "/tienda",
        align: "left" // Alineación del texto
    },
    {
        id: 2,
        src: "/banners/Zapatillas Saprix - ref Tokio Morada_5_11zon.webp",
        alt: "Zapatillas Saprix Tokio Morada",
        title: "Estilo Único Tokio",
        subtitle: "Diseñadas para destacar en morado",
        link: "/tienda",
        align: "left"
    },
    {
        id: 3,
        src: "/banners/Zapatillas Saprix - ref Londres.webp",
        alt: "Zapatillas Saprix Londres",
        title: "Pasión por el Futsal Londres",
        subtitle: "",
        link: "/tienda",
        align: "left"
    },
    {
        id: 4,
        src: "/banners/Zapatillas Saprix - ref Roma.webp",
        alt: "Zapatillas Saprix Roma",
        title: "Roma Edición Limitada",
        subtitle: "Exclusividad total y diseño premium",
        link: "/tienda?featured=true",
        align: "right"
    },
    {
        id: 5,
        src: "/banners/Zapatillas Saprix - Accesorios Deportivos Guantes Mochilas Balones.webp",
        alt: "Accesorios Deportivos Saprix",
        title: "Accesorios Deportivos",
        subtitle: "Guantes, mochilas y balones",
        link: "/ofertas",
        align: "center"
    },
];

export default function MainHeroSlider() {
    const getAlignClasses = (align: string) => {
        switch (align) {
            case 'left':
                return 'justify-start text-left pl-8 sm:pl-16 lg:pl-24';
            case 'right':
                return 'justify-end text-right pr-8 sm:pr-16 lg:pr-24';
            case 'center':
            default:
                return 'justify-center text-center px-4';
        }
    };

    return (
        <section className="relative w-full h-[45vh] md:h-[65vh] lg:h-[75vh] overflow-hidden bg-gray-900">
            <Swiper
                modules={[Autoplay, EffectFade, Pagination, Navigation]}
                effect="fade"
                speed={1000}
                autoplay={{
                    delay: 7000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                }}
                pagination={{
                    clickable: true,
                    dynamicBullets: true,
                }}
                navigation={true}
                loop={true}
                className="w-full h-full"
            >
                {banners.map((banner) => (
                    <SwiperSlide key={banner.id} className="relative w-full h-full">
                        {/* Imagen de fondo */}
                        <div className="absolute inset-0 w-full h-full">
                            <Image
                                src={banner.src}
                                alt={banner.alt}
                                fill
                                priority={banner.id === 0}
                                className="object-cover object-center"
                                sizes="100vw"
                            />
                            {/* Overlay degradado */}
                            {/* Overlay degradado */}
                            <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent ${banner.align === 'left' ? 'bg-gradient-to-r from-black/60 via-transparent to-transparent' : banner.align === 'right' ? 'bg-gradient-to-l from-black/60 via-transparent to-transparent' : ''}`} />
                        </div>

                        {/* Contenido (Texto) */}
                        {banner.title && (
                            <div className={`absolute inset-0 flex items-center ${getAlignClasses(banner.align || 'center')}`}>
                                <div className="max-w-2xl space-y-6">
                                    <motion.h2
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.8, delay: 0.2 }}
                                        className="text-4xl sm:text-6xl md:text-7xl font-black text-white uppercase tracking-tight drop-shadow-lg"
                                    >
                                        {banner.title}
                                    </motion.h2>
                                    {banner.subtitle && (
                                        <motion.p
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.8, delay: 0.4 }}
                                            className="text-lg sm:text-2xl text-gray-200 font-medium drop-shadow-md"
                                        >
                                            {banner.subtitle}
                                        </motion.p>
                                    )}
                                    {banner.link && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.8, delay: 0.6 }}
                                        >
                                            <Link
                                                href={banner.link}
                                                className="inline-flex items-center gap-2 px-8 py-4 bg-saprix-electric-blue hover:bg-blue-700 text-white font-bold rounded-none -skew-x-6 transition-all transform hover:scale-105 shadow-lg hover:shadow-saprix-electric-blue/50"
                                            >
                                                <span className="skew-x-6">{banner.buttonText || "Ver Colección"}</span>
                                                <svg className="w-5 h-5 skew-x-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                                </svg>
                                            </Link>
                                        </motion.div>
                                    )}
                                </div>
                            </div>
                        )}
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Estilos personalizados para Swiper dots y arrows */}
            <style jsx global>{`
        .swiper-pagination-bullet {
          background: white;
          opacity: 0.5;
          width: 10px;
          height: 10px;
        }
        .swiper-pagination-bullet-active {
          background: #2500ff; /* Saprix Electric Blue */
          opacity: 1;
          transform: scale(1.2);
        }
        .swiper-button-next,
        .swiper-button-prev {
          color: white;
          text-shadow: 0 2px 4px rgba(0,0,0,0.5);
        }
        .swiper-button-next:after,
        .swiper-button-prev:after {
          font-size: 24px;
          font-weight: bold;
        }
      `}</style>
        </section>
    );
}
