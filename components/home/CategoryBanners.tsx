"use client";

import Image from "next/image";

export default function CategoryBanners() {
  const banners = [
    { title: "Colección Hombre", img: "/placeholder-image.png", href: "/tienda?hombre" },
    { title: "Colección Mujer", img: "/placeholder-image.png", href: "/tienda?mujer" },
    { title: "Colección Niños", img: "/placeholder-image.png", href: "/tienda?ninos" },
  ];

  return (
    <section aria-label="Category Banners" className="w-full">
      <div className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
          {banners.map((b, idx) => (
            <a
              key={`cat-${idx}`}
              href={b.href}
              className={
                `group relative block overflow-hidden border-solid ` +
                (idx === 0
                  ? 'border-t-[5px] border-r-[5px] border-white'
                  : idx === 1
                  ? 'border-t-[5px] border-white'
                  : 'border-t-[5px] border-l-[5px] border-white')
              }
            >
              <div className="relative w-full h-48 md:h-64">
                <Image src={b.img} alt={b.title} fill className="object-cover" />
                {/* Filtro de color para calcar el estilo */}
                <div className="absolute inset-0">
                  <div className="absolute inset-0 bg-black/40" />
                  <div className="absolute inset-0 bg-[#2500ff]/10" />
                </div>
              </div>
              {/* Título permanente centrado y botón en hover/focus (sin radio, azul Saprix) */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                  <span className="text-white text-sm md:text-base font-bold uppercase tracking-wide">
                    {b.title}
                  </span>
                  <span
                    className="inline-flex bg-[#2500ff] px-5 py-2 text-sm font-semibold text-white opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-200 ease-out"
                  >
                    Comprar ahora
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}