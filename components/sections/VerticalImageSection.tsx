"use client";

import Image from "next/image";
import Link from "next/link";
import BackgroundPattern from "@/components/ui/BackgroundPattern";

type Align = "left" | "right" | "center";

type Props = {
  src: string;
  alt: string;
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
  align?: Align;
  highlightColor?: string;
  overlayDots?: boolean;
  limeRect?: boolean;
};

export default function VerticalImageSection({
  src,
  alt,
  title,
  subtitle,
  ctaLabel,
  ctaHref,
  align = "center",
  highlightColor = "#C6FF00",
  overlayDots = false,
  limeRect = false,
}: Props) {
  return (
    <section className="relative w-full">
      {overlayDots && <BackgroundPattern variant="dots" position="full" color="#00000012" opacity={1} size={12} />}
      <div className="relative w-full">
        {limeRect && <div className="absolute left-8 top-8 h-24 w-40" style={{ backgroundColor: highlightColor }} />}
        <div className="relative aspect-[16/9] w-full">
          <Image
            src={src}
            alt={alt}
            fill
            loading="lazy"
            sizes="100vw"
            className="object-cover"
          />
        </div>
        {(title || subtitle || ctaLabel) && (
          <div className={`absolute inset-0 flex items-center px-6 md:px-10 ${align === "left" ? "justify-start" : align === "right" ? "justify-end" : "justify-center"}`}>
            <div className="max-w-xl bg-white/90 p-6">
              {title && <h3 className="text-2xl md:text-3xl font-extrabold text-saprix-gray-900">{title}</h3>}
              {subtitle && <p className="mt-2 text-saprix-gray-700">{subtitle}</p>}
              {ctaLabel && ctaHref && (
                <Link href={ctaHref} className="mt-4 inline-flex bg-black px-5 py-2 text-sm font-semibold text-white">
                  {ctaLabel}
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
