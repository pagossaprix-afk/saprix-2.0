"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { buttonStyles, cardStyles, layout } from "@/lib/design-system";

interface HeroSlide {
  id: number;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  image: string;
  backgroundColor: string;
}

const heroSlides: HeroSlide[] = [
  {
    id: 1,
    title: "Colección Sala 2025",
    subtitle: "La tecnología más avanzada en zapatillas de futsal profesional",
    ctaText: "Descubrir Colección",
    ctaLink: "/tienda?collection=sala-2025",
    image: "https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=zapatillas%20de%20futsal%20profesionales%20azules%20y%20negras%20estilo%20deportivo%20moderno%20iluminaci%C3%B3n%20dram%C3%A1tica%20fondo%20oscuro&image_size=landscape_16_9",
    backgroundColor: "bg-gradient-to-br from-saprix-black-blue via-saprix-indigo to-saprix-electric-blue"
  },
  {
    id: 2,
    title: "Velocidad Extrema",
    subtitle: "Diseñadas para los jugadores más rápidos del campo",
    ctaText: "Ver Velocidad",
    ctaLink: "/tienda?category=velocidad",
    image: "https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=zapatillas%20de%20futsal%20rojas%20y%20negras%20dise%C3%B1o%20aerodin%C3%A1mico%20l%C3%ADneas%20de%20velocidad%20estilo%20futurista%20fondo%20rojo%20oscuro",
    backgroundColor: "bg-gradient-to-br from-saprix-red-orange via-red-600 to-red-900"
  },
  {
    id: 3,
    title: "Control Total",
    subtitle: "El agarre perfecto para dominar cada movimiento",
    ctaText: "Explorar Control",
    ctaLink: "/tienda?category=agarre",
    image: "https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=zapatillas%20de%20futsal%20con%20suela%20de%20goma%20texturizada%20dise%C3%B1o%20de%20control%20colores%20verde%20y%20negro%20iluminaci%C3%B3n%20profesional",
    backgroundColor: "bg-gradient-to-br from-green-900 via-saprix-black-blue to-saprix-indigo"
  }
];

export default function HeroHome() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(timer);
  }, [currentSlide]);

  const nextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const goToSlide = (index: number) => {
    if (isAnimating || index === currentSlide) return;
    setIsAnimating(true);
    setCurrentSlide(index);
    setTimeout(() => setIsAnimating(false), 500);
  };

  return (
    <section className="relative h-[70vh] min-h-[600px] overflow-hidden">
      {/* Slides Container */}
      <div className="relative w-full h-full">
        {heroSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === currentSlide ? "opacity-100 scale-100" : "opacity-0 scale-105"
            } ${slide.backgroundColor}`}
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                className="object-cover opacity-30"
                priority={index === 0}
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
            </div>

            {/* Content */}
            <div className="relative h-full flex items-center justify-start px-4 sm:px-6 lg:px-8">
              <div className="max-w-4xl ml-0 lg:ml-16">
                <div className="animate-slide-up">
                  <h1 className="text-4xl sm:text-5xl lg:text-7xl font-inter font-bold text-white mb-4 leading-tight">
                    {slide.title}
                  </h1>
                  <p className="text-lg sm:text-xl lg:text-2xl text-white/90 mb-8 max-w-2xl font-inter leading-relaxed">
                    {slide.subtitle}
                  </p>
                  <Link
                    href={slide.ctaLink}
                    className={`${buttonStyles.primary} text-lg px-8 py-4 rounded-xl`}
                  >
                    {slide.ctaText}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-3 transition-all duration-200 hover:scale-110"
        aria-label="Slide anterior"
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-3 transition-all duration-200 hover:scale-110"
        aria-label="Slide siguiente"
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? "bg-white scale-125" 
                : "bg-white/40 hover:bg-white/60"
            }`}
            aria-label={`Ir al slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-4 right-8 hidden lg:block">
        <div className="animate-bounce">
          <div className="w-1 h-16 bg-white/30 rounded-full overflow-hidden">
            <div className="w-full h-full bg-white animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
}