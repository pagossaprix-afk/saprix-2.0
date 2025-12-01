"use client";

import Image from "next/image";
import Link from "next/link";
import SaprixLogo from "@/components/ui/SaprixLogo";
import BackgroundPattern from "@/components/ui/BackgroundPattern";

export default function LandingShoesHero() {
  return (
    <section className="relative overflow-hidden bg-white">
      <BackgroundPattern variant="dots" position="left" color="#00000010" opacity={0.6} size={12} />
      <BackgroundPattern variant="confetti" position="right" color="#FFB020" opacity={1} size={6} />
      <div className="mx-auto max-w-7xl px-6 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="order-2 lg:order-1 text-center lg:text-left">
            <div className="flex justify-center lg:justify-start">
              <SaprixLogo bg="light" retina width={180} height={42} />
            </div>
            <p className="mt-6 text-lg lg:text-xl italic text-saprix-gray-700">Saprix Sportwear</p>
            <h2 className="mt-2 text-4xl lg:text-5xl font-black leading-tight text-saprix-gray-900">DOMINA<br />LA CANCHA</h2>
            <div className="mt-8">
              <Link href="/tienda/categorias" className="btn-primary px-6 py-3 shadow w-full sm:w-auto inline-block">Explorar categorías</Link>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <div className="relative mx-auto aspect-[4/3] lg:aspect-[8/3] w-full max-w-2xl">
              <div className="absolute left-[18%] top-[22%] h-40 w-56 bg-saprix-lime" />
              <Image
                src="https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=deportista%20runner%20masculino%20camiseta%20verde%20lime%20poses%20din%C3%A1micas%20estudio%20fondo%20blanco%20estilo%20publicidad&image_size=landscape_16_9"
                alt="Saprix"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
