"use client";

import Link from "next/link";
import Image from "next/image";
import SaprixLogo from "@/components/ui/SaprixLogo";
import ThemeToggle from "@/components/ThemeToggle";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Popover } from "@headlessui/react";
import { motion, AnimatePresence } from "framer-motion";
import { IoHeartOutline, IoPersonCircleOutline, IoMenuOutline, IoShirt, IoFootball } from "react-icons/io5";
import { GiTravelDress, GiRunningShoe, GiSocks, GiBackpack, GiWhistle } from "react-icons/gi";
import { FaMinusCircle } from "react-icons/fa";
import { ChevronDown, List, Search, Flame, ShoppingCart, User, UserCircle, Truck, Package, HelpCircle, Trash2, X, Plus, Minus } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { useTheme } from "next-themes"; // Importar useTheme
import { useCart } from "@/context/CartContext";


// Paleta Saprix: fondo azul de marca, texto blanco en azules y hover rojo‑naranja
const brand = {
  topBg: "bg-white",
  topText: "text-gray-900",
  accent: "text-saprix-red-orange",
  bottomBg: "bg-saprix-electric-blue", // Azul eléctrico Saprix (#2500ff)
  navText: "text-white",
};

export default function FutsalHeader() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { items, cartTotal, removeItem, updateQuantity, cartCount: contextCartCount } = useCart();
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Live Search Effect
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim().length > 2) {
        setIsSearching(true);
        try {
          const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&per_page=5`);
          if (res.ok) {
            const data = await res.json();
            setSearchResults(data.productos || []);
            setShowResults(true);
          }
        } catch (error) {
          console.error("Search error:", error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // Dynamic Categories State
  const [dynamicCategories, setDynamicCategories] = useState<any[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch('/api/categories');
        if (res.ok) {
          const data = await res.json();
          // Filter top level categories (parent === 0)
          const topLevel = data.filter((c: any) => c.parent === 0 && c.count > 0);
          setDynamicCategories(topLevel);
        }
      } catch (error) {
        console.error("Failed to fetch categories", error);
      } finally {
        setLoadingCategories(false);
      }
    }
    fetchCategories();
  }, []);
  // Map dynamic categories to the format expected by the UI
  const categories = useMemo(() => {
    return dynamicCategories.map(cat => {
      let Icon = GiRunningShoe;
      let color = "#3B00FF";

      const lowerName = cat.name.toLowerCase();

      if (lowerName.includes('balon')) {
        Icon = IoFootball;
        color = "#FF0000";
      } else if (lowerName.includes('ropa') || lowerName.includes('camisa') || lowerName.includes('pantalon')) {
        Icon = IoShirt;
        color = "#00AA00";
      } else if (lowerName.includes('accesorio')) {
        Icon = GiWhistle;
        color = "#FFA500";
      } else if (lowerName.includes('maleta') || lowerName.includes('guayera')) {
        Icon = GiBackpack;
        color = "#800080";
      }

      return {
        name: cat.name,
        Icon: Icon,
        href: `/tienda?category=${cat.slug}`,
        color: color,
        description: cat.description || "Explora nuestra colección",
        slug: cat.slug
      };
    });
  }, [dynamicCategories]);

  // Close search on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const [showCatMenu, setShowCatMenu] = useState(false);
  const [selectedCat, setSelectedCat] = useState<{ name: string; slug: string } | null>(null);
  const [wishlistCount, setWishlistCount] = useState(0);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const accountBtnRef = useRef<HTMLButtonElement | null>(null);
  const [hoverNav, setHoverNav] = useState<string | null>(null);

  useEffect(() => {
    try {
      const wc = parseInt(localStorage.getItem("wishlistCount") || "0");
      setWishlistCount(isNaN(wc) ? 0 : wc);
    } catch { }
    const handler = (e: StorageEvent) => {
      if (e.key === "wishlistCount") setWishlistCount(parseInt(e.newValue || "0") || 0);
    };
    window.addEventListener("storage", handler);
    setMounted(true); // Marcar como montado
    return () => window.removeEventListener("storage", handler);
  }, []);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      const el = wrapRef.current;
      if (!el) return;
      if (!el.contains(e.target as Node)) {
        setShowCatMenu(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);



  // Cerrar panel al hacer clic fuera
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const t = e.target as Node;
      if (wrapRef.current && !wrapRef.current.contains(t)) {
        // setShowSug(false); // Eliminado
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Formateo de moneda según configuración
  const moneyFmt = useMemo(() => {
    const locale = process.env.NEXT_PUBLIC_LOCALE || "es-CO";
    const currency = process.env.NEXT_PUBLIC_CURRENCY || "COP";
    try {
      return new Intl.NumberFormat(locale, { style: "currency", currency, maximumFractionDigits: 0 });
    } catch {
      return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });
    }
  }, []);

  return (

    <header className="sticky top-0 z-50">
      {/* Topbar Mobile - Marquee */}
      {/* Topbar Mobile - Marquee (Visible en Desktop también por solicitud) */}
      <div className="bg-gray-900 text-white overflow-hidden py-2.5 relative z-50 border-b border-gray-800 shadow-sm">
        <style jsx>{`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee {
            display: flex;
            width: max-content;
            animation: marquee 25s linear infinite;
          }
          .animate-marquee:hover {
            animation-play-state: paused;
          }
        `}</style>
        <div className="animate-marquee whitespace-nowrap flex items-center gap-12 text-[11px] font-bold tracking-widest uppercase">
          {/* Contenido duplicado para loop infinito */}
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-12">
              <span className="flex items-center gap-2">
                <span className="text-saprix-electric-blue text-base">🏪</span>
                <span>Tiendas: Bogotá</span>
              </span>
              <span className="flex items-center gap-2">
                <span className="text-yellow-400 text-base">🛡️</span>
                <span>Garantía de 30 días</span>
              </span>
              <span className="flex items-center gap-2">
                <span className="text-green-400 text-base">🚚</span>
                <span>Envíos Gratis {'>'} $150.000</span>
              </span>
              <span className="flex items-center gap-2">
                <span className="text-blue-400 text-base">💳</span>
                <span>Pagos: Nequi • Bancolombia • Addi</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="hidden lg:block">
        {/* Barra superior: blanca + buscador + soporte (Saprix) */}
        <div className={`${brand.topBg} ${brand.topText}`}>
          <div className="container mx-auto max-w-7xl px-6 py-4">
            <div className="grid grid-cols-12 items-center gap-4">
              {/* Logo Saprix (retina) */}
              <div className="col-span-3">
                <Link href="/" className="inline-flex items-center gap-3" aria-label="Inicio Saprix">
                  {/* Fondo blanco => logo normal azul (aumentado 25%) */}
                  <SaprixLogo bg="light" retina width={200} height={50} />
                </Link>
              </div>

              {/* Búsqueda tipo 'Todas las categorías' */}
              <div className="col-span-6 relative" ref={wrapRef}>
                <div ref={searchRef} className="relative w-full">
                  <form
                    role="search"
                    aria-label="Buscar"
                    onSubmit={(e) => {
                      e.preventDefault();
                      const q = searchQuery.trim();
                      const base = new URL(q ? `/productos?q=${encodeURIComponent(q)}` : "/productos", window.location.origin);
                      router.push(base.pathname + base.search);
                      setShowResults(false);
                    }}
                  >
                    <div className="group flex w-full items-center border border-gray-200 bg-gray-50 dark:bg-gray-800/50 dark:border-gray-700 px-4 py-2 transition-all duration-300 focus-within:bg-white dark:focus-within:bg-gray-900 focus-within:border-saprix-electric-blue focus-within:ring-4 focus-within:ring-saprix-electric-blue/10 shadow-sm hover:shadow-md -skew-x-6">
                      <Search size={18} className="text-gray-400 group-focus-within:text-saprix-electric-blue transition-colors skew-x-6" />
                      <input
                        type="text"
                        name="q"
                        placeholder="Buscar productos..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => {
                          if (searchResults.length > 0) setShowResults(true);
                        }}
                        className="h-9 flex-1 border-none bg-transparent px-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none font-medium skew-x-6"
                        autoComplete="off"
                        suppressHydrationWarning={true}
                      />
                      {isSearching ? (
                        <div className="animate-spin h-4 w-4 border-b-2 border-saprix-electric-blue skew-x-6"></div>
                      ) : searchQuery && (
                        <button type="button" onClick={() => { setSearchQuery(""); setSearchResults([]); }} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 skew-x-6">
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  </form>

                  {/* Resultados de búsqueda en vivo */}
                  <AnimatePresence>
                    {showResults && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden z-[60]"
                      >
                        <div className="p-2">
                          {searchResults.length > 0 ? (
                            <>
                              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-3 py-2">Resultados</h3>
                              {searchResults.map((product) => (
                                <Link
                                  key={product.id}
                                  href={`/${product.slug}`}
                                  onClick={() => setShowResults(false)}
                                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
                                >
                                  <div className="w-12 h-12 rounded-md bg-gray-100 dark:bg-gray-800 overflow-hidden shrink-0 border border-gray-200 dark:border-gray-700">
                                    <img src={product.imagen || "/placeholder-image.png"} alt={product.nombre} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-bold text-gray-900 dark:text-white truncate group-hover:text-saprix-electric-blue transition-colors">
                                      {product.nombre}
                                    </h4>
                                    <div className="flex items-center gap-2 mt-0.5">
                                      <span className="text-xs font-bold text-gray-900 dark:text-white">
                                        {moneyFmt.format(Number(product.precio || 0))}
                                      </span>
                                    </div>
                                  </div>
                                  <ChevronDown className="w-4 h-4 text-gray-300 -rotate-90 opacity-0 group-hover:opacity-100 transition-all" />
                                </Link>
                              ))}
                              <Link
                                href={`/productos?q=${encodeURIComponent(searchQuery)}`}
                                onClick={() => setShowResults(false)}
                                className="block mt-2 text-center text-xs font-bold text-saprix-electric-blue hover:underline py-2 border-t border-gray-100 dark:border-gray-800"
                              >
                                Ver todos los resultados ({searchResults.length}+)
                              </Link>
                            </>
                          ) : (
                            !isSearching && (
                              <div className="p-6 text-center">
                                <div className="text-gray-400 dark:text-gray-500 mb-2">
                                  <Search size={32} className="mx-auto opacity-50" />
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  No se encontraron productos para{' '}
                                  <span className="font-bold text-gray-900 dark:text-white">"{searchQuery}"</span>
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                  Intenta con otros términos de búsqueda
                                </p>
                              </div>
                            )
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Eliminado menú de categorías del search para diseño más limpio */}


              </div>

              {/* Soporte 24/7 + Theme Toggle + Cuenta */}
              <div className="col-span-3">
                <div className="flex items-center justify-end gap-4">
                  {/* Theme Toggle Pro */}
                  {mounted && (
                    <button
                      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                    >
                      <div className="relative w-8 h-4 bg-gray-300 dark:bg-gray-600 rounded-full p-0.5">
                        <motion.div
                          className="w-3 h-3 bg-white rounded-full shadow-sm"
                          animate={{ x: theme === 'dark' ? 16 : 0 }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                        {theme === 'dark' ? 'Oscuro' : 'Blanco'}
                      </span>
                    </button>
                  )}

                  {/* Cuenta Pro */}
                  <Popover className="relative">
                    {({ open }) => (
                      <div
                        onMouseEnter={() => { if (!open) accountBtnRef.current?.click(); }}
                        onMouseLeave={() => { if (open) accountBtnRef.current?.click(); }}
                      >
                        <Popover.Button
                          ref={accountBtnRef}
                          as={motion.button}
                          whileHover={{ scale: 1.05 }}
                          aria-label="Cuenta"
                          className={`flex items-center gap-2 rounded-none border p-1.5 pr-3 transition-all ${open
                            ? 'border-saprix-electric-blue bg-saprix-electric-blue/5 text-saprix-electric-blue'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                            }`}
                        >
                          <div className="w-7 h-7 rounded-none bg-gray-100 flex items-center justify-center">
                            <User size={16} className="text-gray-600" />
                          </div>
                          <span className="text-xs font-bold">Mi Cuenta</span>
                          <ChevronDown size={12} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
                        </Popover.Button>

                        <AnimatePresence>
                          {open && (
                            <Popover.Panel static className="absolute right-0 z-50 mt-2 w-64 overflow-hidden rounded-none bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-2xl ring-1 ring-black/5">
                              <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.15 }}
                                className="p-1"
                              >
                                <div className="p-3 border-b border-gray-100 dark:border-gray-800 mb-1">
                                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Bienvenido</p>
                                  <a href="https://pagos.saprix.com.co/wp-admin" target="_blank" rel="noopener noreferrer" className="block w-full text-center rounded-lg bg-saprix-electric-blue text-white px-4 py-2 text-xs font-bold uppercase tracking-wider shadow-md hover:bg-blue-700 transition-colors">
                                    Iniciar Sesión
                                  </a>
                                </div>
                                <div className="p-1">
                                  <div className="flex items-center gap-3 px-3 py-2 rounded-lg opacity-50 cursor-not-allowed group">
                                    <div className="w-8 h-8 rounded-md bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 transition-colors">
                                      <Truck size={16} />
                                    </div>
                                    <div>
                                      <span className="block text-sm font-bold text-gray-900 dark:text-white">Rastrear</span>
                                      <span className="block text-[10px] text-gray-500">Tu pedido en tiempo real</span>
                                    </div>
                                  </div>
                                  <a href="https://pagos.saprix.com.co/mi-cuenta/pedidos/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group">
                                    <div className="w-8 h-8 rounded-md bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:bg-purple-100 dark:group-hover:bg-purple-900/30 transition-colors">
                                      <Package size={16} />
                                    </div>
                                    <div>
                                      <span className="block text-sm font-bold text-gray-900 dark:text-white">Mis Pedidos</span>
                                      <span className="block text-[10px] text-gray-500">Historial de compras</span>
                                    </div>
                                  </a>
                                  <Link href="/preguntas-frecuentes" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group">
                                    <div className="w-8 h-8 rounded-md bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-600 dark:text-green-400 group-hover:bg-green-100 dark:group-hover:bg-green-900/30 transition-colors">
                                      <HelpCircle size={16} />
                                    </div>
                                    <div>
                                      <span className="block text-sm font-bold text-gray-900 dark:text-white">Ayuda</span>
                                      <span className="block text-[10px] text-gray-500">Centro de soporte</span>
                                    </div>
                                  </Link>
                                </div>
                              </motion.div>
                            </Popover.Panel>
                          )}
                        </AnimatePresence>
                      </div>
                    )}
                  </Popover>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* Barra inferior: azul de marca + navegación en blanco y botón de categorías blanco */}
      <div className={`${brand.bottomBg} shadow-lg relative z-40`}>
        <div className="container mx-auto max-w-7xl px-6">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Logo Mobile */}
            <div className="lg:hidden shrink-0">
              <Link href="/">
                <SaprixLogo bg="dark" width={120} height={30} />
              </Link>
            </div>

            {/* Botón Products Category - Desktop Only */}
            <div className="hidden lg:block">
              <Popover className="relative">
                {({ open, close }) => (
                  <>
                    <Popover.Button as={motion.button}
                      whileHover={{ scale: 1.05 }}
                      className="flex shrink-0 items-center gap-2 rounded-none bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-md hover:shadow-lg md:px-4 md:text-base"
                    >
                      <List size={18} className="text-saprix-red-orange" />
                      <span>Categorías de productos</span>
                      <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
                        <ChevronDown size={16} className="text-saprix-red-orange" />
                      </motion.span>
                    </Popover.Button>
                    <AnimatePresence>
                      {open && (
                        <Popover.Panel
                          static
                          className="fixed left-0 right-0 z-50 mt-1 overflow-hidden bg-white dark:bg-gray-900/98 dark:backdrop-blur-xl border-t border-gray-100 dark:border-white/10 shadow-2xl"
                        >
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="container mx-auto px-6 py-6"
                          >
                            {/* Header del megamenu - Compacto pero con identidad */}
                            <div className="mb-5 pb-3 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between relative">
                              <Popover.Button className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 inline-flex items-center gap-2 px-4 py-2 rounded-none border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50">
                                <X size={16} />
                                <span>Cerrar</span>
                              </Popover.Button>
                              <div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-tight flex items-center gap-2">
                                  Zapatillas Saprix
                                  <span className="px-2 py-0.5 bg-saprix-electric-blue/10 text-saprix-electric-blue dark:text-saprix-lime text-[10px] font-bold rounded uppercase tracking-wider">
                                    Originales
                                  </span>
                                </h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                  Marca colombiana especializada en Fútbol Sala - Microfútbol
                                </p>
                              </div>
                              <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-gray-900 to-gray-800 dark:from-white dark:to-gray-200 text-white dark:text-gray-900 text-[10px] font-bold tracking-wider rounded shadow-sm uppercase">
                                <span>🇨🇴</span> Hecho en Colombia
                              </span>
                            </div>

                            {/* Grid de 3 columnas - Compacto */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                              {/* Columna 1: Categorías - Iconos con fondo (Estilo anterior) pero compactos */}
                              <div className="space-y-3">
                                <h4 className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">
                                  Categorías
                                </h4>
                                <div className="grid grid-cols-1 gap-2">
                                  {categories.map(({ name, Icon, href, color, description }, idx) => (
                                    <Link key={name} href={href} onClick={() => close()}>
                                      <div className="group flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 border border-transparent hover:border-gray-100 dark:hover:border-gray-700">
                                        {/* Icono con fondo de color suave */}
                                        <div
                                          className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-transform duration-200 group-hover:scale-105"
                                          style={{ backgroundColor: `${color}15` }}
                                        >
                                          <Icon className="w-4.5 h-4.5" style={{ color }} />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                          <div className="flex items-center gap-2">
                                            <span className="text-sm font-bold text-gray-800 dark:text-gray-200 group-hover:text-saprix-electric-blue dark:group-hover:text-saprix-lime transition-colors">
                                              {name}
                                            </span>
                                            {idx < 2 && (
                                              <span className="px-1.5 py-0.5 bg-saprix-electric-blue text-white text-[9px] font-bold rounded-[3px] uppercase shadow-sm">
                                                Nuevo
                                              </span>
                                            )}
                                          </div>
                                          <p className="text-[10px] text-gray-500 dark:text-gray-400 line-clamp-1 font-medium">
                                            {description}
                                          </p>
                                        </div>
                                        <ChevronDown className="w-3 h-3 text-gray-300 group-hover:text-saprix-electric-blue dark:group-hover:text-saprix-lime -rotate-90 opacity-0 group-hover:opacity-100 transition-all" />
                                      </div>
                                    </Link>
                                  ))}
                                </div>
                              </div>

                              {/* Columna 2: Destacados - Banner vibrante pero compacto */}
                              <div className="space-y-3">
                                <h4 className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">
                                  Destacados
                                </h4>

                                {/* Banner principal - Gradiente Saprix */}
                                <Link href="/tienda?featured=true" className="group block mb-3" onClick={() => close()}>
                                  <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-saprix-electric-blue to-blue-700 p-5 text-white shadow-lg shadow-saprix-electric-blue/20 group-hover:shadow-saprix-electric-blue/30 transition-all">
                                    <div className="relative z-10">
                                      <div className="flex items-center gap-2 mb-2">
                                        <span className="px-2 py-0.5 bg-white/20 text-white text-[9px] font-bold rounded uppercase backdrop-blur-sm border border-white/10">
                                          ⚡ Más Vendido
                                        </span>
                                      </div>
                                      <h5 className="text-lg font-bold mb-1">Colección 2025</h5>
                                      <p className="text-xs text-blue-100 mb-3 line-clamp-1 font-medium">
                                        Tecnología de punta para campeones
                                      </p>
                                      <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider bg-white/10 px-3 py-1.5 rounded-full group-hover:bg-white/20 transition-colors">
                                        Ver colección
                                        <ChevronDown className="w-3 h-3 -rotate-90" />
                                      </div>
                                    </div>
                                    {/* Patrones decorativos sutiles */}
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-12 -mt-12 blur-2xl"></div>
                                    <div className="absolute bottom-0 left-0 w-20 h-20 bg-saprix-lime/20 rounded-full -ml-8 -mb-8 blur-xl"></div>
                                  </div>
                                </Link>

                                {/* Mini links - Cards con borde sutil */}
                                <div className="grid grid-cols-2 gap-3">
                                  <Link href="/tienda?sale=true" className="group" onClick={() => close()}>
                                    <div className="p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-red-200 dark:hover:border-red-900/50 hover:bg-red-50/50 dark:hover:bg-red-900/10 transition-all">
                                      <div className="flex items-center gap-2 mb-1">
                                        <Flame className="w-4 h-4 text-red-500" />
                                        <span className="text-xs font-bold text-gray-900 dark:text-white">Ofertas</span>
                                      </div>
                                      <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">Hasta 40% off</p>
                                    </div>
                                  </Link>
                                  <Link href="/tienda?new=true" className="group" onClick={() => close()}>
                                    <div className="p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-saprix-lime/50 hover:bg-saprix-lime/5 transition-all">
                                      <div className="flex items-center gap-2 mb-1">
                                        <Package className="w-4 h-4 text-saprix-electric-blue dark:text-saprix-lime" />
                                        <span className="text-xs font-bold text-gray-900 dark:text-white">Novedades</span>
                                      </div>
                                      <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">Lo último</p>
                                    </div>
                                  </Link>
                                </div>
                              </div>

                              {/* Columna 3: Recursos - Iconos destacados */}
                              <div className="space-y-3">
                                <h4 className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">
                                  Ayuda
                                </h4>
                                <div className="space-y-1">
                                  <Link href="/guia-tallas" className="group flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all" onClick={() => close()}>
                                    <div className="w-8 h-8 rounded-md bg-gray-100 dark:bg-gray-800 flex items-center justify-center group-hover:bg-white dark:group-hover:bg-gray-700 shadow-sm transition-colors">
                                      <span className="text-sm">📏</span>
                                    </div>
                                    <span className="text-sm text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white font-medium">Guía de tallas</span>
                                  </Link>
                                  <Link href="/cuidado" className="group flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all" onClick={() => close()}>
                                    <div className="w-8 h-8 rounded-md bg-gray-100 dark:bg-gray-800 flex items-center justify-center group-hover:bg-white dark:group-hover:bg-gray-700 shadow-sm transition-colors">
                                      <HelpCircle className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                    </div>
                                    <span className="text-sm text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white font-medium">Cuidado del producto</span>
                                  </Link>
                                  <a href="https://wa.me/573043136608" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 p-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-all" onClick={() => close()}>
                                    <div className="w-8 h-8 rounded-md bg-green-100 dark:bg-green-900/30 flex items-center justify-center group-hover:bg-green-200 dark:group-hover:bg-green-900/50 shadow-sm transition-colors">
                                      <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                      </svg>
                                    </div>
                                    <span className="text-sm text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white font-medium">Chat WhatsApp</span>
                                  </a>
                                </div>

                                {/* Envío gratis - Badge elegante */}
                                <div className="mt-2 p-3 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-800/50 border border-gray-200 dark:border-gray-700 flex items-center gap-3">
                                  <div className="p-1.5 bg-white dark:bg-gray-700 rounded-full shadow-sm">
                                    <Truck className="w-3.5 h-3.5 text-gray-700 dark:text-gray-300" />
                                  </div>
                                  <div>
                                    <h5 className="text-xs font-bold text-gray-900 dark:text-white">Envío Gratis</h5>
                                    <p className="text-[10px] text-gray-500 dark:text-gray-400">
                                      Por compras &gt; $150.000
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Footer con CTA - Elegante */}
                            <div className="mt-5 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                              <div className="flex items-center gap-4 text-[10px] uppercase tracking-wider font-bold text-gray-400 dark:text-gray-500">
                                <span className="flex items-center gap-1.5">
                                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                                  100% Original
                                </span>
                                <span className="flex items-center gap-1.5">
                                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                                  Garantía
                                </span>
                              </div>
                              <Link
                                href="/tienda"
                                className="group inline-flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-bold rounded-full hover:bg-saprix-electric-blue dark:hover:bg-saprix-lime hover:text-white dark:hover:text-black transition-all duration-300 shadow-md hover:shadow-lg"
                                onClick={() => close()}
                              >
                                Ver catálogo completo
                                <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                              </Link>
                            </div>
                          </motion.div>
                        </Popover.Panel>
                      )}
                    </AnimatePresence>
                  </>
                )}
              </Popover>
            </div>

            {/* Separador vertical sobre azul */}
            <span className="hidden lg:block h-6 w-px bg-white/40" />

            {/* Navegación simple en barra azul (sin megamenús) */}
            <nav className="hidden items-center gap-4 font-semibold lg:flex">
              {[
                { name: "Inicio", href: "/" },
                { name: "Productos", href: "/tienda" },
                { name: "Blog", href: "/blog" },
                { name: "Contacto", href: "/contacto" },
              ].map((item, idx, arr) => (
                <div key={item.name} className="flex items-center">
                  <Link href={item.href} className="text-white font-semibold hover:text-saprix-red-orange">
                    {item.name}
                  </Link>
                  {idx < arr.length - 1 && (<span className="mx-3 text-white/60">|</span>)}
                </div>
              ))}
            </nav>

            {/* Iconos derecha: ofertas, favoritos y carrito sobre fondo azul + Hamburger mobile */}
            <div className="flex items-center gap-6">
              <motion.div whileHover={{ scale: 1.05 }}>
                <Link href="/productos?sale=true" className="flex items-center gap-2 font-bold text-white hover:text-saprix-red-orange active:text-saprix-red-orange">
                  <Flame size={18} className="text-saprix-red-orange" />
                  <span>Ofertas</span>
                </Link>
              </motion.div>
              {/* Se elimina el icono de Usuario del nivel azul */}
              <motion.div whileHover={{ scale: 1.05 }}>
                <Link href="/wishlist" className="relative text-white hover:text-saprix-red-orange" aria-label="Favoritos">
                  <IoHeartOutline className="h-6 w-6" />
                  <span className="absolute -top-2 -right-4 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#f42121] text-xs text-white">{String(wishlistCount).padStart(2, "0")}</span>
                </Link>
              </motion.div>
              {/* Carrito: Sheet al click */}
              <Sheet>
                <SheetTrigger asChild>
                  <motion.button className="relative text-white hover:text-saprix-red-orange" aria-label="Carrito" whileHover={{ scale: 1.05 }}>
                    <ShoppingCart size={18} />
                    <span className="absolute -top-2 -right-4 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#f42121] text-xs text-white">{String(contextCartCount).padStart(2, "0")}</span>
                  </motion.button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full sm:w-[480px] p-0 flex flex-col">
                  <SheetHeader className="flex flex-row items-center justify-between border-b border-gray-200 dark:border-gray-800 px-6 py-4 bg-white dark:bg-gray-900 space-y-0">
                    <div className="flex items-center gap-2">
                      <ShoppingCart size={20} className="text-saprix-electric-blue" />
                      <SheetTitle className="text-lg font-bold text-gray-900 dark:text-white">Carrito de Compras</SheetTitle>
                    </div>
                    <SheetClose className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                      <X size={20} className="text-gray-500" />
                      <span className="sr-only">Cerrar</span>
                    </SheetClose>
                  </SheetHeader>

                  <div className="flex-1 overflow-y-auto px-6 py-4 bg-gray-50 dark:bg-gray-900">
                    {items.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-center py-12">
                        <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                          <ShoppingCart size={40} className="text-gray-400" />
                        </div>
                        <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Tu carrito está vacío</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Agrega productos para comenzar tu compra</p>
                        <SheetClose asChild>
                          <Link href="/tienda" className="px-6 py-3 bg-saprix-electric-blue text-white font-bold hover:bg-blue-700 transition-colors">
                            Ver Productos
                          </Link>
                        </SheetClose>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {items.map((item) => (
                          <div key={`cart-${item.id}-${item.variationId || 'base'}`} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-3 hover:shadow-md transition-shadow">
                            <div className="flex gap-3">
                              <div className="flex-shrink-0">
                                <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 overflow-hidden border border-gray-200 dark:border-gray-600">
                                  <img src={item.image || "/placeholder-image.png"} alt={item.name} className="w-full h-full object-cover" />
                                </div>
                              </div>
                              <div className="flex-1 min-w-0 flex flex-col justify-between">
                                <div>
                                  <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-1 line-clamp-2 leading-tight">{item.name}</h4>
                                  {item.attributes && Object.keys(item.attributes).length > 0 && (
                                    <div className="flex flex-wrap gap-1 mb-2">
                                      {Object.entries(item.attributes).map(([key, value]) => (
                                        <span key={key} className="text-[10px] text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 border border-gray-200 dark:border-gray-700">{key}: <span className="font-semibold">{value}</span></span>
                                      ))}
                                    </div>
                                  )}
                                </div>
                                <div className="flex items-end justify-between gap-2">
                                  <span className="text-base font-bold text-saprix-electric-blue">{moneyFmt.format(Number(item.price))}</span>

                                  <div className="flex items-center gap-2">
                                    <div className="flex items-center border border-gray-300 dark:border-gray-600 overflow-hidden h-7">
                                      <button onClick={() => item.quantity > 1 && updateQuantity(item.id, item.quantity - 1, item.variationId)} disabled={item.quantity <= 1} className="px-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300 disabled:opacity-50 h-full flex items-center justify-center"><Minus size={12} /></button>
                                      <span className="px-1.5 text-xs font-bold text-gray-900 dark:text-white border-x border-gray-300 dark:border-gray-600 min-w-[1.5rem] text-center flex items-center justify-center h-full">{item.quantity}</span>
                                      <button onClick={() => updateQuantity(item.id, item.quantity + 1, item.variationId)} className="px-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300 h-full flex items-center justify-center"><Plus size={12} /></button>
                                    </div>
                                    <button onClick={() => removeItem(item.id, item.variationId)} className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors" aria-label="Eliminar"><Trash2 size={16} /></button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 space-y-4">
                    <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                      <span className="text-lg font-bold text-gray-900 dark:text-white">Total</span>
                      <span className="text-2xl font-bold text-saprix-electric-blue">{moneyFmt.format(cartTotal)}</span>
                    </div>
                    <SheetClose asChild>
                      <Link href="/checkout" className="block w-full py-4 bg-saprix-electric-blue hover:bg-blue-700 text-white text-center font-bold transition-colors shadow-lg hover:shadow-xl">Continuar al Pago</Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <button className="w-full py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-center font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Seguir Comprando</button>
                    </SheetClose>
                  </div>
                </SheetContent>
              </Sheet>
              {/* Trigger del menú mobile: Sheet (shadcn/ui) */}
              <div className="lg:hidden">
                <Sheet>
                  <SheetTrigger asChild>
                    <button aria-label="Abrir menú" className="rounded-md p-2 text-white hover:bg-white/10">
                      <IoMenuOutline className="h-6 w-6" />
                    </button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-80 sm:w-96">
                    <SheetHeader>
                      <SheetTitle>Menú</SheetTitle>
                    </SheetHeader>
                    <div className="mt-4 space-y-6">
                      {/* CTA principal del Sheet */}
                      <button className="w-full rounded-md bg-[#f42121] px-4 py-3 text-sm font-semibold text-white">Ingresar o Registrarse</button>
                      {/* Lista de links de cuenta con íconos */}
                      <nav className="space-y-2">
                        <Link href="/cuenta/seguimiento" className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-neutral-100">
                          <Truck size={18} className="text-gray-600" />
                          <span className="text-sm">Rastrear tu pedido</span>
                        </Link>
                        <Link href="/cuenta/pedidos" className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-neutral-100">
                          <Package size={18} className="text-gray-600" />
                          <span className="text-sm">Mis pedidos</span>
                        </Link>
                        <Link href="/cuenta/perfil" className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-neutral-100">
                          <User size={18} className="text-gray-600" />
                          <span className="text-sm">Mi perfil</span>
                        </Link>
                        <Link href="/ayuda" className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-neutral-100">
                          <HelpCircle size={18} className="text-gray-600" />
                          <span className="text-sm">Ayuda y Preguntas frecuentes</span>
                        </Link>
                      </nav>
                      {/* Categorías (vertical) */}
                      <div>
                        <h4 className="mb-2 text-sm font-bold">Categorías</h4>
                        <div className="space-y-2">
                          {categories.slice(0, 4).map(({ name, Icon, href, color }) => (
                            <Link key={`mc-${name}`} href={href} className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-neutral-100">
                              <Icon className="h-5 w-5" color={color} />
                              <span className="text-sm font-semibold">{name}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                      {/* User icons */}
                      <div className="flex items-center gap-6">
                        <Link href="/wishlist" className="relative" aria-label="Favoritos">
                          <IoHeartOutline className="h-6 w-6" />
                          <span className="absolute -top-2 -right-4 inline-flex h-5 w-5 items-center justify-center rounded-full bg-saprix-red-orange text-xs text-white">{String(wishlistCount).padStart(2, "0")}</span>
                        </Link>
                        <Link href="/carrito" className="relative" aria-label="Carrito">
                          <ShoppingCart size={18} />
                          <span className="absolute -top-2 -right-4 inline-flex h-5 w-5 items-center justify-center rounded-full bg-saprix-red-orange text-xs text-white">{String(contextCartCount).padStart(2, "0")}</span>
                        </Link>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Menú Mobile: ahora gestionado por Sheet (shadcn/ui) con side="right" */}
    </header >
  );
}
