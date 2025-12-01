"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { ShoppingCart } from 'lucide-react';
import { MouseEvent, useState } from 'react';
import { ensureHttps } from '@/lib/utils';

interface ProductCardProps {
  id: number;
  name: string;
  price: string;
  imageUrl: string;
  slug: string;
  category?: string;
  subcategory?: string;
  images?: string[];
}

export default function ProductCard({ id, name, price, imageUrl, slug, category, subcategory, images = [] }: ProductCardProps) {
  const { addItem } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [activeImage, setActiveImage] = useState<string | null>(null);

  // Ensure we have at least the main image
  const mainImage = ensureHttps(imageUrl) || '/placeholder-image.png';
  // Use provided images array or fallback to mainImage
  const productImages = images.length > 0 ? images.map(ensureHttps) : [mainImage];

  // Second image for hover effect (default hover behavior)
  const defaultHoverImage = productImages.length > 1 ? productImages[1] : null;

  // Determine which image to show:
  // 1. Active image from thumbnail hover
  // 2. Default hover image (if card is hovered but no thumbnail selected yet) - OPTIONAL: Adidas usually just shows 2nd image on card hover
  // 3. Main image

  // Let's mimic Adidas: 
  // - Card Hover: Show 2nd image (if available) AND show thumbnails.
  // - Thumbnail Hover: Override main image with thumbnail image.

  const currentImage = activeImage || (isHovered && defaultHoverImage ? defaultHoverImage : mainImage);

  // Parse price string to number (remove non-numeric chars except dot)
  const numericPrice = parseFloat(price.replace(/[^0-9.]/g, '')) || 0;

  const handleAddToCart = (e: MouseEvent) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation();

    addItem({
      id,
      name,
      price: numericPrice,
      quantity: 1,
      image: mainImage,
      slug
    });
  };

  // Construct simplified URL like Adidas (root relative)
  const productUrl = `/${slug}`;

  return (
    <Link
      href={productUrl}
      className="group block relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setActiveImage(null); // Reset on leave
      }}
    >
      <div className="overflow-hidden bg-white border border-transparent transition-all duration-300 hover:border-gray-200">
        {/* Contenedor de la Imagen */}
        <div className="relative w-full aspect-square bg-gray-100 mb-2">
          <Image
            src={currentImage}
            alt={name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="object-cover transition-all duration-300"
          />
        </div>

        {/* Contenido de la Tarjeta */}
        <div className="px-1 pb-4 bg-white relative">
          {/* Thumbnails (Miniaturas) - Absolute positioned or just visible on hover */}
          {/* Adidas moves content up or overlays thumbnails. Let's make them appear smoothly. */}
          <div className={`transition-all duration-300 overflow-hidden ${isHovered ? 'max-h-12 opacity-100 mb-2' : 'max-h-0 opacity-0 mb-0'}`}>
            {productImages.length > 0 && (
              <div className="flex gap-1 h-10">
                {productImages.slice(0, 4).map((img, idx) => (
                  <div
                    key={idx}
                    className={`relative w-10 h-10 border transition-colors cursor-pointer ${activeImage === img || (!activeImage && isHovered && img === defaultHoverImage) ? 'border-black' : 'border-gray-200 hover:border-gray-400'}`}
                    onMouseEnter={() => setActiveImage(img)}
                  >
                    <Image
                      src={img}
                      alt={`Variación ${idx + 1}`}
                      fill
                      className="object-cover"
                      sizes="40px"
                    />
                    {/* Línea indicadora debajo de la imagen activa */}
                    {(activeImage === img || (!activeImage && isHovered && img === defaultHoverImage)) && (
                      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-black"></div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-between items-start mb-1">
            <span className="text-sm font-medium text-black">
              {new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(numericPrice)}
            </span>
          </div>

          <h3 className="text-sm font-normal text-gray-700 mb-1 leading-tight group-hover:underline decoration-1 underline-offset-4 line-clamp-2 min-h-[2.5em]">
            {name}
          </h3>

          <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">
            {subcategory || category || 'Fútbol Sala'}
          </p>
        </div>
      </div>
    </Link>
  );
}