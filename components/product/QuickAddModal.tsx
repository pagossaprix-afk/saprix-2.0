"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { X, ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { ensureHttps } from "@/lib/utils";
import Link from "next/link";

type ColorOption = { option: string; variations: number[]; image?: string };
type SizeOption = { option: string; variations: number[] };

interface QuickAddModalProps {
    product: any;
    colorOptions: ColorOption[];
    sizeOptions: SizeOption[];
    variations: any[];
    isOpen: boolean;
    onClose: () => void;
}

export default function QuickAddModal({
    product,
    colorOptions,
    sizeOptions,
    variations,
    isOpen,
    onClose,
}: QuickAddModalProps) {
    const [selectedColor, setSelectedColor] = useState<string>(colorOptions?.[0]?.option ?? "");
    const [selectedSize, setSelectedSize] = useState<string>(sizeOptions?.[0]?.option ?? "");
    const [quantity, setQuantity] = useState(1);
    const { addItem } = useCart();

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

    const selectedVariation = useMemo(
        () => variations?.find((v) => v.id === selectedVariantId),
        [selectedVariantId, variations]
    );

    const variationStock =
        selectedVariation?.stock_quantity ??
        (selectedVariation?.stock_status === "outofstock" ? 0 : undefined);

    const isOutOfStock =
        variationStock === 0 || selectedVariation?.stock_status === "outofstock";

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
        return Number(product?.price || 0);
    }, [selectedVariation, product]);

    const mainImage = useMemo(() => {
        const imageUrl = product?.images?.[0]?.src || product?.image || "/placeholder-image.png";
        return ensureHttps(imageUrl);
    }, [product]);

    function handleAddToCart() {
        addItem({
            id: product?.id || 0,
            name: product?.name || "",
            price: currentPrice,
            quantity: quantity,
            image: mainImage,
            slug: product?.slug || "",
            variationId: selectedVariantId,
            attributes: {
                Color: selectedColor,
                Talla: selectedSize
            }
        });
        onClose();
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="relative w-full max-w-5xl bg-white shadow-2xl max-h-[90vh] flex flex-col">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    id="btn-close-quick-add"
                    className="absolute top-4 right-4 z-10 p-2 bg-blue-600 hover:bg-blue-700 rounded-full transition-colors shadow-lg"
                >
                    <X className="w-5 h-5 text-white" />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-0 overflow-y-auto">
                    {/* Left Side - Image Gallery */}
                    <div className="bg-gray-50 p-4 md:p-8">
                        {/* Main Image */}
                        <div className="relative aspect-square bg-white mb-4 overflow-hidden">
                            <Image
                                src={mainImage}
                                alt={product?.name || ""}
                                fill
                                className="object-contain p-4"
                                priority
                            />
                        </div>

                        {/* Thumbnail Gallery */}
                        {product?.images && product.images.length > 1 && (
                            <div className="flex gap-2 overflow-x-auto pb-2">
                                {product.images.slice(0, 5).map((img: any, idx: number) => {
                                    const imgSrc = ensureHttps(img.src || img);
                                    return (
                                        <button
                                            key={idx}
                                            className={`relative flex-shrink-0 w-16 h-16 bg-white border-2 transition-all ${mainImage === imgSrc ? 'border-black' : 'border-gray-200 hover:border-gray-400'
                                                }`}
                                        >
                                            <Image
                                                src={imgSrc}
                                                alt={`Vista ${idx + 1}`}
                                                fill
                                                className="object-contain p-1"
                                            />
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Right Side - Product Details */}
                    <div className="p-4 md:p-8 flex flex-col justify-between">
                        <div>
                            {/* Product Info */}
                            <div className="mb-4">
                                <h2 className="text-2xl font-bold text-black mb-2 leading-tight">
                                    {product?.name}
                                </h2>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl font-black text-black">
                                        {priceFmt.format(currentPrice)}
                                    </span>
                                </div>
                            </div>

                            {/* Color Selection */}
                            {colorOptions && colorOptions.length > 0 && (
                                <div className="mb-4">
                                    <label className="block text-xs font-bold uppercase text-gray-700 mb-3">
                                        Color: <span className="font-normal text-black capitalize">{selectedColor}</span>
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {colorOptions.map((color) => (
                                            <button
                                                key={color.option}
                                                onClick={() => setSelectedColor(color.option)}
                                                id={`btn-color-${color.option}`}
                                                className={`group relative flex items-center gap-2 px-3 py-2 border-2 transition-all ${selectedColor === color.option
                                                    ? 'border-black bg-gray-50'
                                                    : 'border-gray-200 hover:border-gray-400'
                                                    }`}
                                            >
                                                {color.image && (
                                                    <div className="relative w-6 h-6 flex-shrink-0">
                                                        <Image
                                                            src={color.image}
                                                            alt={color.option}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                )}
                                                <span className="text-xs font-medium capitalize">{color.option}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Size Selection */}
                            {sizeOptions && sizeOptions.length > 0 && (
                                <div className="mb-4">
                                    <label className="block text-xs font-bold uppercase text-gray-700 mb-2">
                                        Talla: <span className="font-normal text-black">{selectedSize}</span>
                                    </label>
                                    <div className="grid grid-cols-6 gap-2">
                                        {sizeAvailability.map((sz) => (
                                            <button
                                                key={sz.option}
                                                onClick={() => setSelectedSize(sz.option)}
                                                id={`btn-size-${sz.option}`}
                                                disabled={!sz.available}
                                                className={`h-9 w-full flex items-center justify-center text-xs font-bold border-2 transition-all ${selectedSize === sz.option
                                                    ? 'border-black bg-black text-white'
                                                    : sz.available
                                                        ? 'border-gray-300 hover:border-black'
                                                        : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed line-through'
                                                    }`}
                                            >
                                                {sz.option}
                                            </button>
                                        ))}
                                    </div>
                                    {!isOutOfStock && typeof variationStock === 'number' && (
                                        <p className="text-xs text-green-600 font-medium mt-2">
                                            {variationStock} disponibles
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Quantity Selector */}
                            <div className="mb-4">
                                <label className="block text-xs font-bold uppercase text-gray-700 mb-3">
                                    Cantidad
                                </label>
                                <div className="flex items-center border border-gray-300 w-fit">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        disabled={quantity <= 1}
                                        id="btn-decrease-qty-modal"
                                        className={`w-9 h-9 flex items-center justify-center transition-colors text-lg ${quantity <= 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'
                                            }`}
                                    >
                                        −
                                    </button>
                                    <span className="w-10 text-center font-bold text-sm">{quantity}</span>
                                    <button
                                        onClick={() => {
                                            const maxStock = variationStock || 999;
                                            setQuantity(Math.min(maxStock, quantity + 1));
                                        }}
                                        id="btn-increase-qty-modal"
                                        disabled={variationStock !== undefined && quantity >= variationStock}
                                        className={`w-9 h-9 flex items-center justify-center transition-colors text-lg ${(variationStock !== undefined && quantity >= variationStock)
                                            ? 'opacity-50 cursor-not-allowed'
                                            : 'hover:bg-gray-100'
                                            }`}
                                    >
                                        +
                                    </button>
                                </div>
                                {variationStock !== undefined && quantity >= variationStock && (
                                    <p className="text-xs text-orange-600 font-medium mt-2">
                                        Stock máximo alcanzado
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3">
                            <button
                                onClick={handleAddToCart}
                                disabled={isOutOfStock}
                                id="btn-add-to-cart-modal"
                                className={`w-full py-3 bg-black text-white text-sm font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 ${isOutOfStock ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                            >
                                <ShoppingCart className="w-5 h-5" />
                                <span>{isOutOfStock ? 'Agotado' : 'Agregar al carrito'}</span>
                            </button>

                            <Link
                                href={`/${product?.slug}`}
                                id="link-view-details-modal"
                                className="block w-full py-2 text-center border border-black text-black text-sm font-bold uppercase tracking-wider hover:bg-gray-50 transition-colors"
                                onClick={onClose}
                            >
                                Ver detalles completos
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
