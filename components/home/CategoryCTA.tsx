"use client";

import Image from "next/image";
import Link from "next/link";

export default function CategoryCTA() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-saprix-lime to-saprix-electric-blue opacity-10" />
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <h3 className="text-3xl md:text-4xl font-black text-saprix-gray-900">Colecciones destacadas</h3>
            <p className="mt-3 text-saprix-gray-600">Encuentra tu estilo para Sala, Running y Training</p>
            <div className="mt-8 flex items-center gap-4">
              <Link href="/tienda?category=sala" className="btn-primary px-5 py-3">Sala</Link>
              <Link href="/tienda?category=running" className="btn-secondary px-5 py-3">Running</Link>
              <Link href="/tienda?category=training" className="btn-primary px-5 py-3">Training</Link>
            </div>
          </div>
          <div className="relative h-[260px]">
            <div className="absolute left-6 top-6 h-28 w-40 bg-saprix-lime" />
            <Image
              src="https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=zapatilla%20saprix%20azul%20electrico%20y%20negro%20producto%20studio%20sombra%20realista&image_size=landscape_16_9"
              alt="Saprix"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
