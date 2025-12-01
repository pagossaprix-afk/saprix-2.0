"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Search, User, ShoppingCart, Heart, ChevronDown, ChevronRight } from "lucide-react";
import { IoMenuOutline } from "react-icons/io5";
import { IoLogoWhatsapp } from "react-icons/io5";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import SaprixLogo from "@/components/ui/SaprixLogo";

export default function HeaderMobile() {
  return (
    <header className="block lg:hidden sticky top-0 z-50 shadow-md">
      {/* Nivel 1: Barra Azul Eléctrico */}
      <div className="bg-[#2500ff] flex justify-between items-center px-4 py-3 relative">
        {/* Izquierda: Hamburger como SheetTrigger (side="left") */}
        <Sheet>
          <SheetTrigger asChild>
            <button aria-label="Abrir menú" className="rounded-md p-2 text-white">
              <IoMenuOutline size={32} className="text-white" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 sm:w-96">
            <SheetHeader>
              <Link href="/" aria-label="Inicio Saprix" className="inline-flex items-center">
                {/* Fondo claro (Sheet blanco) => logo normal en azul */}
                <SaprixLogo bg="light" retina width={150} height={35} />
              </Link>
              {/* Título requerido por Radix para accesibilidad, oculto visualmente */}
              <SheetTitle className="sr-only">Menú principal</SheetTitle>
            </SheetHeader>
            {/* Navegación principal con sub-menús (Collapsible) */}
            <nav className="mt-4 space-y-1">
              <Link href="/" className="block rounded-md px-3 py-3 text-lg font-semibold hover:bg-neutral-100">Inicio</Link>

              <Link href="/tienda" className="block rounded-md px-3 py-3 text-lg font-semibold hover:bg-neutral-100">Tienda</Link>

              <Collapsible>
                <CollapsibleTrigger className="rounded-md hover:bg-neutral-100">
                  <span>Blog</span>
                  <ChevronDown className="h-5 w-5 text-gray-700" />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="space-y-1 px-3 py-2">
                    <Link href="/blog/noticias" className="block rounded-md px-3 py-2 text-sm hover:bg-neutral-100">Noticias</Link>
                    <Link href="/blog/guias" className="block rounded-md px-3 py-2 text-sm hover:bg-neutral-100">Guías</Link>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              <Link href="/contacto" className="block rounded-md px-3 py-3 text-lg font-semibold hover:bg-neutral-100">Contacto</Link>
            </nav>
          </SheetContent>
        </Sheet>

        {/* Centro: Fondo azul => logo negativo (blanco) */}
        <Link href="/" aria-label="Inicio Saprix" className="inline-flex items-center">
          <SaprixLogo bg="dark" retina width={120} height={30} />
        </Link>

        {/* Derecha: WhatsApp con dropdown */}
        <div className="relative">
          <WhatsAppDropdown />
        </div>
      </div>

      {/* Nivel 2: Barra Blanca */}
      <div className="bg-white flex justify-between items-center px-4 py-3 border-t border-gray-200">
        {/* Izquierda: Texto "Productos" como SheetTrigger (side="left") */}
        {/* Izquierda: Enlace directo a Tienda */}
        <Link href="/tienda" className="font-semibold text-gray-800">
          Productos
        </Link>

        {/* Derecha: Grid de 4 iconos */}
        <div className="grid grid-cols-4 gap-4">
          {/* Búsqueda */}
          <button aria-label="Buscar" className="flex items-center justify-center">
            <Search className="h-6 w-6 text-gray-800" />
          </button>
          {/* Cuenta */}
          <button aria-label="Cuenta" className="flex items-center justify-center">
            <User className="h-6 w-6 text-gray-800" />
          </button>
          {/* Wishlist con badge */}
          <Link href="/wishlist" aria-label="Favoritos" className="relative flex items-center justify-center">
            <Heart className="h-6 w-6 text-gray-800" />
            <span className="absolute -top-1 -right-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#FF4500] text-xs font-semibold text-white">00</span>
          </Link>
          {/* Carrito con badge y Sheet (side="right") */}
          <Sheet>
            <SheetTrigger asChild>
              <button aria-label="Abrir carrito" className="relative flex items-center justify-center">
                <ShoppingCart className="h-6 w-6 text-gray-800" />
                <span className="absolute -top-1 -right-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#FF4500] text-xs font-semibold text-white">00</span>
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 sm:w-96">
              <SheetHeader>
                <SheetTitle>Carrito</SheetTitle>
              </SheetHeader>
              <div className="mt-4 space-y-4">
                <p className="text-sm text-gray-600">Tu carrito está vacío</p>
                <Link href="/tienda" className="inline-block rounded-md bg-[#2500ff] px-4 py-2 text-sm font-semibold text-white">Explorar productos</Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

function WhatsAppDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const whatsappBase = "https://wa.me/573001234567";

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="WhatsApp"
        className="rounded-md p-2 text-white"
        onClick={() => setOpen((v) => !v)}
      >
        <IoLogoWhatsapp className="h-7 w-7" />
      </button>
      {open && (
        <div
          role="menu"
          aria-label="Opciones de WhatsApp"
          className="absolute right-0 mt-2 w-56 rounded-md border border-gray-200 bg-white shadow-lg z-50"
        >
          <Link
            role="menuitem"
            href={`${whatsappBase}?text=${encodeURIComponent("Hola Saprix - Atención al Cliente")}`}
            target="_blank"
            className="block px-4 py-3 text-sm hover:bg-gray-50"
          >
            Atención al cliente
          </Link>
          <Link
            role="menuitem"
            href={`${whatsappBase}?text=${encodeURIComponent("Hola Saprix - Ventas")}`}
            target="_blank"
            className="block px-4 py-3 text-sm hover:bg-gray-50"
          >
            Ventas
          </Link>
          <Link
            role="menuitem"
            href={`${whatsappBase}?text=${encodeURIComponent("Hola Saprix - Ayuda")}`}
            target="_blank"
            className="block px-4 py-3 text-sm hover:bg-gray-50"
          >
            Ayuda
          </Link>
        </div>
      )}
    </div>
  );
}