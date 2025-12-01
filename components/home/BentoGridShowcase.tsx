"use client";

import Image from "next/image";
import Link from "next/link";
import Spotlight from "@/components/ui/Spotlight";

const cards = [
  {
    title: "Sala Pro",
    image: "https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=cancha%20de%20futsal%20interior%20con%20jugador%20movimiento%20realista&image_size=landscape_16_9",
    href: "/tienda?category=sala",
  },
  {
    title: "Urban Run",
    image: "https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=running%20urbano%20ciudad%20moderna%20con%20luces%20estilo%20publicidad&image_size=landscape_16_9",
    href: "/tienda?category=running",
  },
  {
    title: "Training",
    image: "https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=entrenamiento%20de%20box%20en%20gimnasio%20moderno%20estilo%20publicidad&image_size=landscape_16_9",
    href: "/tienda?category=training",
  },
];

export default function BentoGridShowcase() {
  return (
    <section className="relative bg-white">
      <Spotlight className="absolute inset-0" color="#C6FF00" size={340} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
        {cards.map((c, i) => (
          <Link key={c.title} href={c.href} className="group relative block h-[46vh] md:h-[60vh] overflow-hidden">
            <Image src={c.image} alt={c.title} fill className="object-cover transition-transform duration-500 group-hover:scale-[1.06]" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute left-6 top-6 rounded-md bg-white/90 px-4 py-2 text-sm font-bold text-saprix-gray-900">{c.title}</div>
          </Link>
        ))}
      </div>
    </section>
  );
}
