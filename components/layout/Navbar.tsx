"use client";

// components/layout/Navbar.tsx

import { useState } from "react";
import Link from "next/link";
import SaprixLogo from "@/components/ui/SaprixLogo";
import {
  Menu,
  Search,
  ChevronDown,
  Phone,
  User,
  Heart,
  ShoppingCart,
  Zap, // <-- Pa'l "Deal"
  X,
} from "lucide-react";
import { Popover, Listbox } from "@headlessui/react";
import { AnimatePresence, motion } from "framer-motion";
import { IoLaptopOutline, IoHeadsetOutline, IoPrintOutline, IoBriefcaseOutline, IoGameControllerOutline, IoWifiOutline } from "react-icons/io5";

// --- NUEVA BIBLIA (Light Mode) ---
const colors = {
  accent: "bg-blue-600", // Azul Saprix
  accentHover: "hover:text-blue-600",
  secondary: "bg-saprix-red-orange", // Rojo-Naranja (OrangeRed #FF4500)
  secondaryHover: "hover:text-saprix-red-orange",
  text: "text-gray-800",
  textLight: "text-gray-500",
};

// --- EL LAYOUT DE LA FOTO: NIVEL 1 (Arriba) ---
function HeaderTop() {
  return (
    <div className="bg-white">
      <div className="container mx-auto max-w-7xl px-6 py-4">
        <div className="grid grid-cols-12 items-center gap-4">
          {/* 1. Logo (Izquierda) */}
          <div className="col-span-3">
            <Link href="/" className="inline-flex items-center" aria-label="Inicio Saprix">
              {/* Fondo blanco => logo normal azul (aumentado 25%) */}
              <SaprixLogo bg="light" retina width={175} height={43} />
            </Link>
          </div>

          {/* 2. Buscador (Centro - ¡La Joya!) */}
          <div className="col-span-6">
            {/* Buscador integrado con Listbox de categorías */}
            <SearchBar />
          </div>

          {/* 3. Soporte (Derecha) */}
          <div className="col-span-3">
            <div className="flex items-center justify-end gap-3">
              <Phone size={32} className={colors.textLight} />
              <div>
                <span className={`block text-xs font-semibold ${colors.textLight}`}>
                  Support 24/7
                </span>
                <p className={`font-bold ${colors.text}`}>
                  +57 300 123 4567
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- EL LAYOUT DE LA FOTO: NIVEL 2 (Abajo) ---
function HeaderBottom() {
  return (
    // Nivel 2: Fondo 100% Azul Saprix
    <div className="bg-[#2500ff]">
      <div className="container mx-auto max-w-7xl px-6">
        <div className="flex h-14 items-center justify-between">
          {/* 1. Mega-Menú (Izquierda) */}
          <MegaMenuCategories />

          {/* 2. Navegación (Centro) */}
          <div className="hidden items-center gap-4 lg:flex">
            <MainNav />
            {/* Separadores grises entre bloques */}
            <span className="hidden lg:block h-5 w-px bg-gray-400/60" />
          </div>

          {/* 3. Iconos de Merca (Derecha) */}
          <div className="flex items-center gap-6">
            {/* Deal */}
            <Link
              href="/deals"
              className={`
                flex items-center gap-2 font-bold text-white hover:text-white/90
              `}
            >
              <Zap size={20} className="text-saprix-red-orange" />
              <span>Deals</span>
            </Link>

            {/* Cuenta */}
            <Link href="/cuenta" className="text-white hover:text-white/90" aria-label="Cuenta">
              <User size={22} />
            </Link>

            {/* Wishlist */}
            <Link href="/wishlist" className="relative flex items-center" aria-label="Favoritos">
              <Heart size={22} />
              <span
                className={`
                  absolute -top-2 -right-3
                  flex h-5 w-5 items-center
                  justify-center rounded-full
                  bg-[#f42121] text-xs text-white
                `}
              >
                1
              </span>
            </Link>

            {/* Carrito */}
            <Link href="/carrito" className={`relative text-white hover:text-white/90`} aria-label="Carrito">
              <ShoppingCart size={22} />
              <span
                className={`
                  absolute -top-2 -right-3
                  flex h-5 w-5 items-center
                  justify-center rounded-full
                  bg-saprix-red-orange text-xs text-white
                `}
              >
                1
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- SearchBar integrado ---
function SearchBar() {
  const categories = [
    { id: 0, name: "All Categories" },
    { id: 1, name: "Computadores" },
    { id: 2, name: "Accesorios" },
    { id: 3, name: "Impresión" },
    { id: 4, name: "Oficina" },
  ];
  const [selected, setSelected] = useState(categories[0]);

  return (
    <form action="/tienda" role="search" aria-label="Buscar">
      <div className="flex w-full items-center rounded-full border border-gray-300 bg-white px-2 py-1">
        {/* Dropdown integrado de categorías */}
        <Listbox value={selected} onChange={setSelected}>
          {({ open }) => (
            <div className="relative">
              <Listbox.Button className="flex items-center gap-2 rounded-full px-3 py-2 text-sm text-gray-900 hover:bg-gray-50">
                <span className="font-semibold">
                  {selected?.name ?? "All Categories"}
                </span>
                <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronDown size={16} />
                </motion.span>
              </Listbox.Button>
              <AnimatePresence>
                {open && (
                  <Listbox.Options static as="div" className="absolute z-50 mt-2 w-48 overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg">
                    <motion.ul initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} transition={{ duration: 0.15 }}>
                      {categories.map((cat) => (
                        <Listbox.Option
                          key={cat.id}
                          value={cat}
                          className={({ active }) => `cursor-pointer px-3 py-2 text-sm ${active ? 'bg-gray-50 text-blue-600' : 'text-gray-700'}`}
                        >
                          {cat.name}
                        </Listbox.Option>
                      ))}
                      <li className="px-3 py-2 text-xs text-gray-500">Show more...</li>
                    </motion.ul>
                  </Listbox.Options>
                )}
              </AnimatePresence>
            </div>
          )}
        </Listbox>

        {/* Input de texto */}
        <input
          type="text"
          name="search"
          placeholder="Enter Search Products"
          className="h-12 flex-1 border-none bg-transparent px-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none"
        />

        {/* Botón de buscar dentro del mismo cascarón */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          type="submit"
          aria-label="Buscar"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-saprix-red-orange text-white"
        >
          <Search size={18} />
        </motion.button>
      </div>
    </form>
  );
}

// --- Mega-Menú de Categorías con Popover ---
function MegaMenuCategories() {
  return (
    <Popover className="relative">
      {({ open }) => (
        <>
          <Popover.Button as={motion.button}
            whileHover={{ scale: 1.02 }}
            className="flex h-full items-center gap-2 px-6 font-bold text-white"
          >
            <Menu size={20} className="text-gray-800" />
            <span className="text-gray-800">Categorías</span>
            <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown size={18} className="text-gray-800" />
            </motion.span>
          </Popover.Button>
          <AnimatePresence>
            {open && (
              <Popover.Panel static className="absolute left-0 z-50 mt-3 w-[680px] overflow-hidden rounded-lg border border-white/10 bg-white text-gray-800 shadow-xl">
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} transition={{ duration: 0.15 }} className="p-6">
                <div className="flex justify-center">
                  <Popover.Button className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50">
                    <X size={16} />
                    <span>Cerrar</span>
                  </Popover.Button>
                </div>
                <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { name: "Computadores", href: "/tienda/computadores", Icon: IoLaptopOutline, color: "text-blue-600" },
                    { name: "Accesorios", href: "/tienda/accesorios", Icon: IoHeadsetOutline, color: "text-pink-500" },
                    { name: "Impresión", href: "/tienda/impresion", Icon: IoPrintOutline, color: "text-green-600" },
                    { name: "Oficina", href: "/tienda/oficina", Icon: IoBriefcaseOutline, color: "text-amber-600" },
                    { name: "Gaming", href: "/tienda/gaming", Icon: IoGameControllerOutline, color: "text-red-500" },
                    { name: "Redes", href: "/tienda/redes", Icon: IoWifiOutline, color: "text-indigo-600" },
                  ].map(({ name, href, Icon, color }) => (
                    <Link key={name} href={href} className="block">
                      <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-3 rounded-lg bg-white p-4 shadow-md hover:shadow-lg">
                        <Icon className={`h-7 w-7 ${color}`} />
                        <span className="text-sm font-semibold text-gray-900">{name}</span>
                      </motion.div>
                    </Link>
                  ))}
                </div>
                <div className="mt-4 flex justify-end">
                  <Link href="/tienda/categorias" className="text-sm font-semibold text-blue-600 hover:text-blue-700">
                    Show more...
                  </Link>
                </div>
                </motion.div>
              </Popover.Panel>
            )}
          </AnimatePresence>
        </>
      )}
    </Popover>
  );
}

// --- Navegación con Popovers para sub-menús ---
function MainNav() {
  const items = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/tienda", submenu: [
      { name: "Computadores", href: "/tienda/computadores" },
      { name: "Accesorios", href: "/tienda/accesorios" },
      { name: "Impresión", href: "/tienda/impresion" },
    ]},
    { name: "Blog", href: "/blog" },
    { name: "Contacto", href: "/contacto" },
  ];

  return (
    <nav className="hidden items-center font-semibold lg:flex">
      {items.map((item, idx) => (
        <div key={`nav-wrap-${item.name}`} className="flex items-center">
          {item.submenu ? (
            <Popover className="relative">
              {({ open }) => (
                <>
                  <Popover.Button className="flex items-center gap-1 text-gray-900 hover:text-gray-800">
                    <span>{item.name}</span>
                    <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
                      <ChevronDown size={14} />
                    </motion.span>
                  </Popover.Button>
                  <AnimatePresence>
                    {open && (
                      <Popover.Panel static className="absolute left-0 z-50 mt-3 min-w-[240px] overflow-hidden rounded-md border border-white/10 bg-white text-gray-800 shadow-xl">
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} transition={{ duration: 0.15 }} className="p-3">
                        <ul className="space-y-1">
                          {item.submenu.map((sub) => (
                            <li key={sub.name}>
                              <Link href={sub.href} className="block rounded-md px-3 py-2 text-sm text-gray-800 hover:bg-gray-50 hover:text-blue-700">
                                {sub.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                        </motion.div>
                      </Popover.Panel>
                    )}
                  </AnimatePresence>
                </>
              )}
            </Popover>
          ) : (
            <Link href={item.href} className="text-gray-900 hover:text-gray-800">
              {item.name}
            </Link>
          )}
          {idx < items.length - 1 && (
            <span className="mx-3 text-gray-400">|</span>
          )}
        </div>
      ))}
    </nav>
  );
}

// --- EL COMPONENTE "FRANKENSTEIN" FINAL ---
function Navbar() {
  return (
    <header className="hidden lg:block">
      <HeaderTop />
      <HeaderBottom />

      {/* ¡OJO TRAE!
        Aquí falta el Mega-Menú (el que se abre con 'Categorías')
        y el Menú Mobile (pa' celulares).
        ¡Ese es el siguiente camello!
      */}
    </header>
  );
}

export default Navbar;
