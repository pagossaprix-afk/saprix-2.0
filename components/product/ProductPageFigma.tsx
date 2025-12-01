"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Star, Heart, ShoppingCart, Truck, Shield, RotateCcw, Plus, Minus, Ruler, ChevronDown } from "lucide-react";
import SizeGuide from "./SizeGuide";
import GoogleReviews from "./GoogleReviews";
import ImageZoomModal from "./ImageZoomModal";
import { useCart } from "@/context/CartContext";
import { ensureHttps } from "@/lib/utils";
import Link from "next/link";

type Media = { src: string; alt?: string };
type ColorOption = { option: string; variations: number[]; image?: string };
type SizeOption = { option: string; variations: number[] };

type Props = {
  mapped: any;
  images: Media[];
  colorOptions: ColorOption[];
  sizeOptions: SizeOption[];
  variations?: any[];
  slug: string;
};

export default function ProductPageFigma({ mapped, images, colorOptions, sizeOptions, variations = [], slug }: Props) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string>(colorOptions?.[0]?.option ?? "");
  const [selectedSize, setSelectedSize] = useState<string>(sizeOptions?.[0]?.option ?? "");
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  // Accordion states
  const [openSections, setOpenSections] = useState<string[]>(['description', 'details']);

  const toggleSection = (section: string) => {
    setOpenSections(prev =>
      prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section]
    );
  };

  const selectedVariantId = useMemo(() => {
    const c = colorOptions.find((x) => x.option === selectedColor)?.variations ?? [];
    const s = sizeOptions.find((x) => x.option === selectedSize)?.variations ?? [];
    const inter = c.filter((id) => s.includes(id));
    return inter[0];
  }, [selectedColor, selectedSize, colorOptions, sizeOptions]);

  const sizeAvailability = useMemo(() => {
    return sizeOptions.map((s) => {
      const cvars = colorOptions.find((x) => x.option === selectedColor)?.variations ?? [];
      const inter = cvars.filter((id) => s.variations.includes(id));
      return { option: s.option, available: inter.length > 0 };
    });
  }, [selectedColor, colorOptions, sizeOptions]);

  // Selected variation and stock information
  const selectedVariation = useMemo(
    () => variations?.find((v) => v.id === selectedVariantId),
    [selectedVariantId, variations]
  );

  const variationStock =
    selectedVariation?.stock_quantity ??
    (selectedVariation?.stock_status === "outofstock" ? 0 : undefined);

  const isOutOfStock =
    variationStock === 0 || selectedVariation?.stock_status === "outofstock";

  const mainImages: Media[] = useMemo(() => {
    const baseImages = images && images.length > 0
      ? images.map(img => ({ ...img, src: ensureHttps(img.src) }))
      : [{ src: ensureHttps(mapped?.image) ?? "/placeholder-image.png" }];

    // Add variation images if they are not already in baseImages
    if (variations) {
      variations.forEach(v => {
        if (v.image && v.image.src) {
          const src = ensureHttps(v.image.src);
          if (!baseImages.some(img => img.src === src)) {
            baseImages.push({ src, alt: v.image.alt || v.name });
          }
        }
      });
    }
    return baseImages;
  }, [images, mapped, variations]);

  const priceFmt = useMemo(() => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    });
  }, []);

  const currentPrice = useMemo(() => {
    if (selectedVariation) {
      return Number(selectedVariation.price || selectedVariation.sale_price || selectedVariation.regular_price || 0);
    }
    return Number(mapped?.final_price || mapped?.price || 0);
  }, [selectedVariation, mapped]);

  const currentRegularPrice = useMemo(() => {
    if (selectedVariation) {
      return Number(selectedVariation.regular_price || 0);
    }
    return Number(mapped?.regular_price || 0);
  }, [selectedVariation, mapped]);

  const isSale = useMemo(() => {
    if (selectedVariation) {
      return selectedVariation.on_sale;
    }
    return mapped?.on_sale || (mapped?.sale_price && mapped?.sale_price < mapped?.regular_price);
  }, [selectedVariation, mapped]);

  const { addItem } = useCart();

  function addToCart() {
    const imagen = ensureHttps(mainImages?.[0]?.src) || "/placeholder-image.png";
    const nombre = mapped?.name || slug;

    addItem({
      id: mapped?.id || 0,
      name: nombre,
      price: currentPrice,
      quantity: quantity,
      image: imagen,
      slug: slug,
      variationId: selectedVariantId,
      attributes: {
        Color: selectedColor,
        Talla: selectedSize
      }
    });
  }

  function toggleWishlist() {
    setIsWishlisted((v) => !v);
  }

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Breadcrumbs - Minimal */}
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex items-center space-x-2 text-xs uppercase tracking-wide text-gray-600 font-medium">
          <Link href="/" className="hover:underline">Inicio</Link>
          <span>/</span>
          <Link href="/tienda" className="hover:underline">Tienda</Link>
          {mapped?.categories && mapped.categories.length > 0 && (
            <>
              <span>/</span>
              <span className="font-bold text-black">{mapped.categories[0].name}</span>
            </>
          )}
        </nav>
      </div>

      <div className="max-w-[1920px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[65%_35%] gap-0 lg:gap-8">

          {/* Left Column: Image Grid */}
          <div className="order-2 lg:order-1 bg-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
              {mainImages.map((image, index) => (
                <div
                  key={`${image.src}-${index}`}
                  className="relative w-full bg-[#ECEFF1] cursor-zoom-in group aspect-square"
                  onClick={() => {
                    setSelectedImage(index);
                    setIsZoomOpen(true);
                  }}
                >
                  <Image
                    src={image.src}
                    alt={image.alt || mapped?.name || slug}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    priority={index < 2}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Product Info (Sticky) */}
          <div className="order-1 lg:order-2 px-4 sm:px-6 lg:px-8 lg:pr-12 py-6 lg:py-0">
            <div className="sticky top-24 space-y-8 max-w-xl">

              {/* Header Info */}
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <div className="text-sm text-gray-600 uppercase tracking-wide font-medium">
                    {mapped?.categories?.[0]?.name || 'Calzado'} • {mapped?.categories?.[1]?.name || 'Deportivo'}
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3 h-3 ${i < 4 ? "text-black fill-black" : "text-gray-300"}`} />
                    ))}
                    <span className="text-xs font-bold underline ml-1 cursor-pointer">51</span>
                  </div>
                </div>

                <h1 className="text-3xl md:text-4xl font-black uppercase italic leading-none tracking-tight text-black">
                  {mapped?.name ?? slug}
                </h1>

                <div className="flex items-baseline gap-3 pt-2">
                  <span className="text-xl font-bold text-black">{priceFmt.format(currentPrice)}</span>
                  {currentRegularPrice > currentPrice && (
                    <span className="text-sm text-gray-500 line-through">{priceFmt.format(currentRegularPrice)}</span>
                  )}
                </div>
              </div>

              {/* Popular Badge */}
              <div className="bg-gray-100 p-3 flex items-start gap-3 rounded-sm">
                <div className="bg-white p-1 rounded-full shadow-sm">
                  <Star className="w-3 h-3 text-black fill-black" />
                </div>
                <div className="text-xs text-gray-800">
                  <span className="font-bold">¡Popular!</span> Más de 200 personas han visto este producto en las últimas 24 horas.
                </div>
              </div>

              {/* Colors */}
              {colorOptions && colorOptions.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-bold uppercase">Colores</h3>
                  <div className="flex flex-wrap gap-2">
                    {colorOptions.map((color) => (
                      <button
                        key={color.option}
                        onClick={() => setSelectedColor(color.option)}
                        className={`w-16 h-16 border-b-2 transition-all ${selectedColor === color.option ? "border-black opacity-100" : "border-transparent opacity-70 hover:opacity-100 hover:border-gray-300"}`}
                      >
                        <div className="w-full h-full bg-gray-100 relative overflow-hidden">
                          {color.image ? (
                            <Image src={color.image} alt={color.option} fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px]">{color.option}</div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="text-xs text-gray-500 capitalize">{selectedColor}</div>
                </div>
              )}

              {/* Sizes */}
              {sizeOptions && sizeOptions.length > 0 && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-bold uppercase">Tallas</h3>
                    <button onClick={() => setIsSizeGuideOpen(true)} className="text-xs underline flex items-center gap-1">
                      <Ruler className="w-3 h-3" /> Guía de tallas
                    </button>
                  </div>
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                    {sizeAvailability.map((sz) => (
                      <button
                        key={sz.option}
                        onClick={() => setSelectedSize(sz.option)}
                        disabled={!sz.available}
                        className={`h-10 text-sm font-medium transition-all border ${selectedSize === sz.option
                          ? "bg-black text-white border-black"
                          : sz.available
                            ? "bg-white text-black border-gray-300 hover:border-black"
                            : "bg-gray-50 text-gray-300 border-gray-200 cursor-not-allowed"
                          }`}
                      >
                        {sz.option}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <div className="flex gap-4">
                  <button
                    onClick={addToCart}
                    disabled={isOutOfStock}
                    className={`flex-1 bg-black text-white h-12 font-bold uppercase tracking-wider flex items-center justify-center gap-3 hover:bg-gray-800 transition-colors ${isOutOfStock ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <span>{isOutOfStock ? "Agotado" : "Añadir al carrito"}</span>
                    {!isOutOfStock && <ShoppingCart className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={toggleWishlist}
                    className="w-12 h-12 border border-black flex items-center justify-center hover:bg-gray-50 transition-colors"
                  >
                    <Heart className={`w-5 h-5 ${isWishlisted ? "fill-black" : ""}`} />
                  </button>
                </div>

                {/* Benefits */}
                <div className="space-y-3 pt-4">
                  <div className="flex items-center gap-3 text-xs uppercase font-bold tracking-wide cursor-pointer hover:underline">
                    <Truck className="w-4 h-4" />
                    <span>Envío gratis desde $300.000</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs uppercase font-bold tracking-wide cursor-pointer hover:underline">
                    <Shield className="w-4 h-4" />
                    <span>Paga seguro en línea</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs uppercase font-bold tracking-wide cursor-pointer hover:underline">
                    <RotateCcw className="w-4 h-4" />
                    <span>Devoluciones gratis en 30 días</span>
                  </div>
                </div>
              </div>

              {/* Accordions */}
              <div className="pt-8 border-t border-gray-200 space-y-0">
                {/* Description */}
                <div className="border-b border-gray-200">
                  <button
                    onClick={() => toggleSection('description')}
                    className="w-full py-4 flex justify-between items-center text-left group"
                  >
                    <span className="font-bold uppercase text-sm">Descripción</span>
                    <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${openSections.includes('description') ? 'rotate-180' : ''}`} />
                  </button>
                  <div className={`overflow-hidden transition-all duration-500 ease-in-out ${openSections.includes('description') ? 'max-h-[1000px] opacity-100 mb-4' : 'max-h-0 opacity-0'}`}>
                    <div className="text-sm text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: mapped?.description || mapped?.short_description || 'Sin descripción.' }} />
                  </div>
                </div>

                {/* Details / Features */}
                <div className="border-b border-gray-200">
                  <button
                    onClick={() => toggleSection('details')}
                    className="w-full py-4 flex justify-between items-center text-left group"
                  >
                    <span className="font-bold uppercase text-sm">Detalles</span>
                    <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${openSections.includes('details') ? 'rotate-180' : ''}`} />
                  </button>
                  <div className={`overflow-hidden transition-all duration-500 ease-in-out ${openSections.includes('details') ? 'max-h-[1000px] opacity-100 mb-4' : 'max-h-0 opacity-0'}`}>
                    <ul className="space-y-2 text-sm text-gray-700 list-disc pl-5">
                      {mapped?.attributes?.map((attr: any, idx: number) => (
                        <li key={idx}><span className="font-semibold">{attr.name}:</span> {Array.isArray(attr.options) ? attr.options.join(', ') : attr.options}</li>
                      ))}
                      {mapped?.weight && <li><span className="font-semibold">Peso:</span> {mapped.weight}g</li>}
                      <li><span className="font-semibold">SKU:</span> {mapped?.sku || mapped?.id}</li>
                    </ul>
                  </div>
                </div>

                {/* Reviews */}
                <div className="border-b border-gray-200">
                  <button
                    onClick={() => toggleSection('reviews')}
                    className="w-full py-4 flex justify-between items-center text-left group"
                  >
                    <span className="font-bold uppercase text-sm">Valoraciones (51)</span>
                    <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${openSections.includes('reviews') ? 'rotate-180' : ''}`} />
                  </button>
                  <div className={`overflow-hidden transition-all duration-500 ease-in-out ${openSections.includes('reviews') ? 'max-h-[1000px] opacity-100 mb-4' : 'max-h-0 opacity-0'}`}>
                    <GoogleReviews />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      <SizeGuide
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
        productName={mapped?.name || slug}
        categories={mapped?.categories?.map((c: any) => c.name) || []}
      />
      <ImageZoomModal
        images={mainImages}
        initialIndex={selectedImage}
        isOpen={isZoomOpen}
        onClose={() => setIsZoomOpen(false)}
      />
    </div>
  );
}
