"use client";
import Image from "next/image";

type SaprixLogoProps = {
  /** Fondo donde se coloca el logo: "light" (blanco/claros) o "dark" (azul/negros) */
  bg?: "light" | "dark";
  /** Usar la versión retina cuando esté disponible */
  retina?: boolean;
  width?: number;
  height?: number;
  className?: string;
  alt?: string;
  priority?: boolean;
  sizes?: string;
};

export default function SaprixLogo({
  bg = "light",
  retina = true,
  width = 120,
  height = 28,
  className = "",
  alt = "Saprix",
  priority = false,
  sizes,
}: SaprixLogoProps) {
  const src = bg === "dark"
    ? retina
      ? "/Logo Saprix Negativo Retina.svg"
      : "/Logo Saprix Negativo.svg"
    : retina
      ? "/Logo Saprix. Retinasvg.svg"
      : "/Logo Saprix.svg";

  return (
    <div className="relative inline-block group overflow-hidden">
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`relative z-10 transition-transform duration-300 group-hover:scale-105 ${className}`}
        priority={priority}
        sizes={sizes ?? `${width}px`}
      />

      {/* Efecto de brillo animado */}
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out">
        <div
          className="h-full w-1/2 skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          style={{
            filter: 'blur(2px)',
          }}
        />
      </div>
    </div>
  );
}