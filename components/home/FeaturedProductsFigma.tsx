"use client";

import { useState } from "react";
import Image from "next/image";
import { Section, Container, Grid } from "@/lib/ui/layouts";
import { MotionDiv } from "@/lib/ui/motion";
import Link from "next/link";
import { Star, Heart, ShoppingCart, Eye } from "lucide-react";
import { cardStyles, buttonStyles, layout } from "@/lib/design-system";

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  category: string;
  isNew?: boolean;
  isSale?: boolean;
  badge?: string;
  outOfStock?: boolean;
}

const featuredProducts: Product[] = [
  {
    id: 1,
    name: "Zapatilla Sala Pro 2025",
    price: 299900,
    originalPrice: 399900,
    rating: 4.8,
    reviews: 127,
    image: "https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=zapatilla%20de%20futsal%20profesional%20azul%20y%20negro%20dise%C3%B1o%20moderno%20suela%20de%20goma%20iluminaci%C3%B3n%20de%20producto%20fondo%20blanco",
    category: "Sala Profesional",
    isNew: true,
    isSale: true,
    badge: "NUEVO"
  },
  {
    id: 2,
    name: "Velocidad Elite X1",
    price: 349900,
    rating: 4.9,
    reviews: 89,
    image: "https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=zapatilla%20de%20futsal%20roja%20y%20negra%20dise%C3%B1o%20aerodin%C3%A1mico%20l%C3%ADneas%20de%20velocidad%20suela%20ligera%20fondo%20blanco",
    category: "Velocidad",
    isNew: true,
    badge: "TOP"
  },
  {
    id: 3,
    name: "Control Master Pro",
    price: 279900,
    originalPrice: 329900,
    rating: 4.7,
    reviews: 156,
    image: "https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=zapatilla%20de%20futsal%20verde%20y%20negra%20dise%C3%B1o%20de%20control%20suela%20texturizada%20para%20agarre%20fondo%20blanco",
    category: "Control",
    isSale: true,
    badge: "OFERTA"
  },
  {
    id: 4,
    name: "Kids Fun Starter",
    price: 149900,
    rating: 4.6,
    reviews: 73,
    image: "https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=zapatilla%20de%20futsal%20para%20ni%C3%B1os%20colores%20brillantes%20azul%20y%20verde%20dise%C3%B1o%20divertido%20segura%20fondo%20blanco",
    category: "Niños",
    isNew: true,
    badge: "KIDS"
  }
];

function ProductCard({ product }: { product: Product }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  function handleAddToCart() {
    try {
      const raw = localStorage.getItem("cartItems") || "[]";
      const items = JSON.parse(raw);
      const next = Array.isArray(items) ? items.slice() : [];
      next.push({ id: product.id, nombre: product.name, imagen: product.image, precio: product.price, quantity: 1 });
      localStorage.setItem("cartItems", JSON.stringify(next));
      const totalQty = next.reduce((acc: number, it: any) => acc + (Number(it.quantity) || 1), 0);
      localStorage.setItem("cartCount", String(totalQty));
    } catch { }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="group relative bg-[#f6f6f6] h-full flex flex-col" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      {product.outOfStock && (
        <span className="absolute right-3 top-3 z-10 rounded-sm bg-black px-3 py-1 text-xs font-bold text-white">OUT OF STOCK</span>
      )}
      {(product.isSale || product.badge) && (
        <span className="pointer-events-none absolute left-1/2 top-3 z-10 -translate-x-1/2 rounded-sm bg-black px-3 py-1 text-xs font-bold text-white">
          {product.badge ?? "OFERTA"}
        </span>
      )}
      <div className="relative aspect-[4/3] w-full">
        <Image src={product.image} alt={product.name} fill className="object-contain" />
        <div className={`absolute left-0 right-0 bottom-0 flex items-center ${isHovered ? 'opacity-100' : 'opacity-0'} transition-opacity`}>
          <button aria-label="Añadir al carrito" onClick={handleAddToCart} className="btn-primary h-10 flex-1 text-xs">
            <ShoppingCart className="mr-2 h-4 w-4" />
            AÑADIR AL CARRITO
          </button>
          <Link aria-label="Vista rápida" href={`/producto/${product.id}?quick=1`} className="btn-secondary h-10 flex-1 text-xs">
            <Eye className="mr-2 h-4 w-4" />
            VISTA RÁPIDA
          </Link>
        </div>
      </div>
      <div className="px-4 pb-4 flex-1">
        <div className="flex items-center justify-between border-b border-black/10 pb-2">
          <Link href={`/producto/${product.id}`} className="text-sm font-inter font-extrabold tracking-wide text-black uppercase not-italic">
            {product.name}
          </Link>
          <span className="text-sm font-extrabold text-black">{formatPrice(product.price)}</span>
        </div>
        <div className="mt-2 text-xs text-black/70">{product.category}</div>
        <div className="mt-2 flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`h-3 w-3 ${i < Math.round(product.rating) ? 'text-black' : 'text-black/30'}`} />
          ))}
        </div>
        {product.isSale && product.originalPrice && (
          <div className="mt-1 text-xs text-black/50 line-through">{formatPrice(product.originalPrice)}</div>
        )}
      </div>
    </div>
  );
}

export default function FeaturedProductsFigma() {
  return (
    <Section bg="bg-white" spacing="lg">
      <Container>
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-saprix-lime/10 text-saprix-lime rounded-none font-inter font-semibold text-sm mb-4">
            <Star className="w-4 h-4 mr-2" />
            Productos Destacados
          </div>
          <h2 className="saprix-h2 saprix-title-underline mb-4">Lo Mejor de Saprix</h2>
          <p className="saprix-body max-w-2xl mx-auto">Descubre nuestros productos más populares, seleccionados por expertos en futsal</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
          {featuredProducts.map((product) => (
            <MotionDiv key={product.id}>
              <ProductCard product={product} />
            </MotionDiv>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <Link
            href="/tienda"
            className="btn-primary px-8 py-4 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Ver Todos los Productos
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </Container>
    </Section>
  );
}
