"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { ShoppingCart } from 'lucide-react';
import { MouseEvent, useState, useEffect } from 'react';
import { ensureHttps } from '@/lib/utils';
import QuickAddModal from './QuickAddModal';

interface ProductCardProps {
  id: number;
  name: string;
  price: string;
  imageUrl: string;
  slug: string;
  category?: string;
  subcategory?: string;
  images?: string[];
  type?: string; // 'simple' | 'variable'
}

export default function ProductCard({ id, name, price, imageUrl, slug, category, subcategory, images = [], type = 'simple' }: ProductCardProps) {
  const { addItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [isHovered, setIsHovered] = useState(false);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [isLoadingVariations, setIsLoadingVariations] = useState(false);
  const [variationsData, setVariationsData] = useState<{
    colorOptions: any[];
    sizeOptions: any[];
    variations: any[];
  } | null>(null);

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

  const handleAddToCart = async (e: MouseEvent) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation();

    // If it's a variable product, open modal
    if (type === 'variable') {
      setIsLoadingVariations(true);
      setIsQuickAddOpen(true);

      // Fetch variations data
      try {
        const [colorOptions, sizeOptions, variations] = await Promise.all([
          getColorOptionsFromVariations(id),
          getSizeOptionsFromVariations(id),
          getProductVariations(id)
        ]);

        setVariationsData({ colorOptions, sizeOptions, variations });
      } catch (error) {
        console.error('Error loading variations:', error);
      } finally {
        setIsLoadingVariations(false);
      }
      return;
    }

    // Simple product - add directly
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
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist({ id, name, price: numericPrice, image: mainImage, slug, category });
            }}
            className="absolute top-2 right-2 p-1.5 bg-white hover:bg-gray-100 rounded-full shadow-sm z-10 transition-transform hover:scale-110"
            title={isInWishlist(id) ? "Eliminar de favoritos" : "Agregar a favoritos"}
          >
            {isInWishlist(id) ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-red-500">
                <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-900">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
              </svg>
            )}
          </button>
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

          {/* Add to Cart Button - Appears on hover */}
          <div className={`transition-all duration-300 overflow-hidden ${isHovered ? 'max-h-12 opacity-100 mt-3' : 'max-h-0 opacity-0 mt-0'}`}>
            <button
              onClick={handleAddToCart}
              className="w-full bg-black text-white py-2 px-4 text-xs font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Agregar al carrito</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Add Modal */}
      {isQuickAddOpen && variationsData && (
        <QuickAddModal
          product={{ id, name, price, slug, image: mainImage, images }}
          colorOptions={variationsData.colorOptions}
          sizeOptions={variationsData.sizeOptions}
          variations={variationsData.variations}
          isOpen={isQuickAddOpen}
          onClose={() => setIsQuickAddOpen(false)}
        />
      )}
    </Link>
  );
}