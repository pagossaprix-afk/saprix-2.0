import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function HeroHome() {
  return (
    <section className="bg-[#060321]">
      <div className="container mx-auto max-w-7xl px-6 lg:px-8">
        <div className="relative isolate overflow-hidden">
          {/* Fondo degradado (el "Look & Feel" Tech) */}
          <svg
            viewBox="0 0 1024 1024"
            className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-x-1/2 [mask-image:radial-gradient(closest-side,white,transparent)]"
            aria-hidden="true"
          >
            <circle cx={512} cy={512} r={512} fill="url(#gradient-hero)" fillOpacity="0.7" />
            <defs>
              <radialGradient id="gradient-hero">
                <stop stopColor="#2500ff" />
                <stop offset={1} stopColor="#233775" />
              </radialGradient>
            </defs>
          </svg>

          <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
            <div className="text-center">
              <h1 className="font-inter text-4xl font-bold tracking-tight text-white sm:text-6xl">
                Todo para Futsal: Zapatillas, Balones y Más
              </h1>
              <p className="font-inter mt-6 text-lg leading-8 text-gray-300">
                DOMINA LA CANCHA. Equípate con la tecnología y el estilo "Dark Performance" que solo Saprix te da.
              </p>

              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Link
                  href="/tienda"
                  className="rounded-md bg-[#2500ff] px-5 py-3 text-base font-semibold text-white shadow-sm transition-transform hover:scale-105 hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400"
                >
                  Ver la Tienda
                </Link>
                <Link
                  href="/tienda?category=zapatillas"
                  className="flex items-center gap-x-2 text-base font-semibold leading-6 text-white transition-colors hover:text-gray-300"
                >
                  Ver Zapatillas <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}