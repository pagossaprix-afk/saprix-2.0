"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function HeroSlider() {
  const slides = [
    {
      img: "/placeholder-image.png",
      title: "Colección Sala 2025",
      cta: "Comprar ahora",
      href: "/tienda",
    },
    {
      img: "/placeholder-image.png",
      title: "Velocidad y Agarre en la cancha",
      cta: "Comprar ahora",
      href: "/tienda",
    },
    {
      img: "/placeholder-image.png",
      title: "Especial Niños Sala",
      cta: "Comprar ahora",
      href: "/tienda?ninos",
    },
  ];

  return (
    <section aria-label="Hero Slider" className="w-full">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 3500, disableOnInteraction: false }}
        loop
        className="w-full"
      >
        {slides.map((s, idx) => (
          <SwiperSlide key={`hero-${idx}`}>
            <div className="relative w-full h-[46vh] md:h-[70vh]">
              <Image
                src={s.img}
                alt={s.title}
                fill
                priority={idx === 0}
                className="object-cover"
              />
              {/* Filtro de color encima de la imagen (azul eléctrico + negro translúcido) */}
              <div className="absolute inset-0">
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute inset-0 bg-[#2500ff]/20" />
              </div>
              {/* Contenido alineado a la derecha para calcar el screenshot */}
              <div className="absolute inset-0 flex items-center justify-end">
                <div className="container mx-auto max-w-7xl px-6">
                  <div className="ml-auto w-full max-w-xl text-right">
                    <div className="inline-flex flex-col gap-4 p-6">
                      <h2 className="text-white text-3xl md:text-5xl font-extrabold tracking-tight uppercase">
                        {s.title}
                      </h2>
                      <p className="text-white/80 text-sm md:text-base">Ediciones limitadas disponibles a precio especial.</p>
                      <a
                        href={s.href}
                        className="inline-flex items-center justify-center self-end bg-[#2500ff] px-5 py-2 text-sm font-semibold text-white shadow-md hover:opacity-90 rounded-none -skew-x-6"
                      >
                        <span className="skew-x-6">{s.cta}</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
