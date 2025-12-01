"use client";

import Image from "next/image";
import Link from "next/link";
import { Instagram } from "lucide-react";

// Selección de imágenes para simular el feed
const feedImages = [
    {
        id: 1,
        src: "/LONDRES/Zapatillas Londres Saprix Futsal Microfutbol  (2).png",
        alt: "Saprix Londres Edición Especial",
        caption: "Domina la cancha con los nuevos Saprix Londres. Diseño y confort para los más exigentes."
    },
    {
        id: 2,
        src: "/ACCESORIOS/Balon Saprix Futsal Microfutbol.png",
        alt: "Balón Oficial Saprix",
        caption: "El balón oficial para tus mejores partidos. Precisión garantizada en cada pase y remate."
    },
    {
        id: 3,
        src: "/LONDRES/Zapatillas Londres Saprix Futsal Microfutbol  (3).png",
        alt: "Saprix Azul Cielo",
        caption: "Color Azul Cielo para destacar en cada jugada. Edición limitada disponible ahora."
    },
    {
        id: 4,
        src: "/LONDRES/Zapatillas Londres Saprix Futsal Microfutbol  (4).png",
        alt: "Saprix Clásicos Negros",
        caption: "Clásicos que nunca fallan. Saprix Negro, elegancia y poder en tus pies."
    },
    {
        id: 5,
        src: "/ACCESORIOS/Guantes Saprix Futsal Microfutbol.png",
        alt: "Equipamiento Pro",
        caption: "Equipamiento profesional para llevar tu juego al siguiente nivel. Calidad superior."
    },
    {
        id: 6,
        src: "/LONDRES/Zapatillas Londres Saprix Futsal Microfutbol  (5).png",
        alt: "Saprix Blancos Premium",
        caption: "Blancos Premium. Limpieza y estilo en tus pies para brillar en la cancha."
    },
    {
        id: 7,
        src: "/ACCESORIOS/Maletin Saprix Futsal Microfutbol (1).png",
        alt: "Accesorios de Entrenamiento",
        caption: "Entrena como un pro con nuestros accesorios de alta resistencia y durabilidad."
    },
    {
        id: 8,
        src: "/LONDRES/Zapatillas Londres Saprix Futsal Microfutbol  (6).png",
        alt: "Colección Urbana",
        caption: "Colección Urbana. Llévalos dentro y fuera de la cancha con el mejor estilo."
    },
    {
        id: 9,
        src: "/ACCESORIOS/Medias Saprix Futsal Microfutbol (1).png",
        alt: "Rodilleras Profesionales",
        caption: "Protección total con nuestras rodilleras profesionales. Juega seguro y sin miedo."
    },
    {
        id: 10,
        src: "/LONDRES/Zapatillas Londres Saprix Futsal Microfutbol  (7).png",
        alt: "Detalles Saprix",
        caption: "Cada detalle cuenta. Descubre la calidad Saprix en cada costura y material."
    },
];

export default function InstagramFeed() {
    return (
        <section className="py-10 bg-white dark:bg-gray-950">
            <div className="container mx-auto px-4 mb-8 text-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 p-[2px]">
                        <div className="w-full h-full rounded-full bg-white dark:bg-black p-1">
                            <div className="w-full h-full rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden relative">
                                {/* Logo placeholder si no hay avatar específico */}
                                <Image src="/Logo Saprix.svg" alt="Saprix Logo" fill className="object-cover" />
                            </div>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-2">
                            @saprixoficial
                            <span className="text-blue-500" title="Verificado">
                                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                                </svg>
                            </span>
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                            Síguenos para ver lo último en tendencias de futsal
                        </p>
                        <Link
                            href="https://www.instagram.com/saprixoficial/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-6 py-2 bg-saprix-electric-blue text-white text-sm font-semibold rounded-lg hover:bg-saprix-electric-blue-dark transition-colors"
                        >
                            <Instagram className="w-4 h-4" />
                            Seguir en Instagram
                        </Link>
                    </div>
                </div>
            </div>

            {/* Grid 5 columnas x 2 filas con gap para padding entre tarjetas */}
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {feedImages.map((image) => (
                        <Link
                            key={image.id}
                            href="https://www.instagram.com/saprixoficial/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-900 block rounded-xl shadow-sm hover:shadow-md transition-all"
                        >
                            <Image
                                src={image.src}
                                alt={image.alt}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />

                            {/* Overlay con Caption e Icono */}
                            <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4 text-center">
                                <Instagram className="w-8 h-8 text-white mb-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300" />
                                <p className="text-white text-sm font-medium line-clamp-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                                    {image.caption.split(' ').slice(0, 15).join(' ')}
                                    {image.caption.split(' ').length > 15 ? '...' : ''}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
