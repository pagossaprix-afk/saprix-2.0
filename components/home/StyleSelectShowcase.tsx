"use client";

import Image from "next/image";

const tiles = [
  "https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=pista%20de%20tenis%20verde%20moderna%20detalle%20de%20zapatilla%20en%20movimiento%20fondo%20profesional&image_size=landscape_16_9",
  "https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=runner%20urbano%20entrenando%20en%20ciudad%20estilo%20deportivo%20moderno%20fondo%20realista&image_size=landscape_16_9",
  "https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=entrenamiento%20outdoor%20de%20piernas%20en%20parque%20estilo%20lifestyle%20deportivo&image_size=landscape_16_9",
];

export default function StyleSelectShowcase() {
  return (
    <section className="relative bg-white">
      <div className="py-12">
        <div className="relative mb-8 flex items-center justify-center">
          <h3 className="text-center text-2xl md:text-3xl font-extrabold tracking-wide text-saprix-gray-900">
            SELECCIONA TU ESTILO <span className="bg-saprix-lime px-2 py-1 text-black">AHORA</span>
          </h3>
        </div>
        <div className="grid grid-cols-3 gap-0">
          {tiles.map((src, i) => (
            <div key={`tile-${i}`} className="relative h-[42vh] md:h-[52vh] w-full overflow-hidden">
              <Image src={src} alt="Saprix" fill className="object-cover" priority={i === 1} />
            </div>
          ))}
        </div>
        <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 -bottom-10 flex items-center justify-center">
          <div className="absolute -bottom-2 h-8 w-[46vw] rounded-full" style={{ background: "radial-gradient(ellipse at center, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.0) 70%)" }} />
          <div className="relative h-[220px] w-[520px]">
            <Image
              src="https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=zapatilla%20negra%20saprix%20producto%20studio%20vista%20lateral%20suela%20gris%20sombra%20realista&image_size=landscape_16_9"
              alt="Zapatilla Saprix"
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
