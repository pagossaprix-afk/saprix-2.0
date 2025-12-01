"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronUp, Search, Check } from "lucide-react";

export type Category = { id: number; name: string; slug: string; count?: number; parent?: number };
export type Tag = { id: number; name: string; slug: string; count?: number };
export type AttributeTerm = { id: number; name: string; slug: string; count?: number };
export type AttributeWithTerms = { attribute: { id: number; name: string; slug: string }; terms: AttributeTerm[] };

interface FiltersSidebarProps {
  categories: Category[];
  tags: Tag[];
  attributes: AttributeWithTerms[];
  selected: {
    category?: string[];
    tag?: string[];
    attr_linea?: string[];
    attr_audiencia?: string[];
    attr_color?: string[];
    attr_talla?: string[];
    price_min?: number;
    price_max?: number;
    search?: string;
  };
  currentParams: Record<string, string>;
}

export function FiltersSidebar({
  categories,
  tags,
  attributes,
  selected,
  currentParams,
}: FiltersSidebarProps) {
  const router = useRouter();
  const [openSections, setOpenSections] = useState({
    categories: true,
    price: true,
    color: true,
    size: true,
    tags: false,
    linea: false,
    audiencia: false,
  });

  const [searchQuery, setSearchQuery] = useState(selected.search || "");
  const [priceMin, setPriceMin] = useState(selected.price_min?.toString() || "");
  const [priceMax, setPriceMax] = useState(selected.price_max?.toString() || "");

  function toggleSection(section: keyof typeof openSections) {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  }

  function makeHref(next: Record<string, string | undefined>) {
    const stringParams: Record<string, string> = {};
    Object.entries(currentParams).forEach(([key, value]) => {
      if (typeof value === 'string') {
        stringParams[key] = value;
      }
    });

    const params = new URLSearchParams(stringParams);
    Object.entries(next).forEach(([k, v]) => {
      if (!v) params.delete(k);
      else params.set(k, v);
    });
    params.delete("page");

    // Always navigate to /productos with the query params
    const queryString = params.toString();
    return queryString ? `/productos?${queryString}` : '/productos';
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const href = makeHref({ q: searchQuery });
    router.push(href);
  };

  const handlePriceApply = () => {
    const href = makeHref({
      min_price: priceMin,
      max_price: priceMax
    });
    router.push(href);
  };

  // Build Category Tree
  const categoryTree = categories.filter(c => c.parent === 0).map(parent => ({
    ...parent,
    children: categories.filter(c => c.parent === parent.id)
  }));

  // Find Attributes
  const colorAttr = attributes.find(a => a.attribute.slug.includes("color") || a.attribute.name.toLowerCase().includes("color"));
  const sizeAttr = attributes.find(a => a.attribute.slug.includes("talla") || a.attribute.slug.includes("size") || a.attribute.name.toLowerCase().includes("talla"));
  const lineaAttr = attributes.find(a => a.attribute.slug.includes("linea") || a.attribute.name.toLowerCase().includes("linea"));
  const audienciaAttr = attributes.find(a => a.attribute.slug.includes("audiencia") || a.attribute.name.toLowerCase().includes("audiencia"));

  return (
    <aside className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Filtros</h2>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            placeholder="Buscar producto..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-saprix-electric-blue"
          />
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
        </form>
      </div>

      <div className="divide-y divide-gray-200 dark:divide-gray-700">

        {/* Price Filter */}
        <div className="p-4">
          <button
            onClick={() => toggleSection("price")}
            className="w-full flex items-center justify-between mb-2"
          >
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Precio</h3>
            {openSections.price ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {openSections.price && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceMin}
                  onChange={(e) => setPriceMin(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-sm"
                />
                <span className="text-gray-400">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={priceMax}
                  onChange={(e) => setPriceMax(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-sm"
                />
              </div>
              <button
                onClick={handlePriceApply}
                className="w-full py-2 bg-gray-900 dark:bg-white text-white dark:text-black text-xs font-bold uppercase tracking-wider rounded-md hover:opacity-90 transition-opacity"
              >
                Filtrar
              </button>
            </div>
          )}
        </div>

        {/* Categories (Hierarchical) */}
        <div className="p-4">
          <button
            onClick={() => toggleSection("categories")}
            className="w-full flex items-center justify-between mb-2"
          >
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Categorías</h3>
            {openSections.categories ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {openSections.categories && (
            <div className="space-y-1">
              {categoryTree.map((parent) => {
                const isActiveParent = selected.category?.includes(parent.slug);
                return (
                  <div key={parent.id} className="space-y-1">
                    <button
                      onClick={() => {
                        const href = makeHref({ category: isActiveParent ? undefined : parent.slug });
                        router.push(href);
                      }}
                      className={`w-full flex items-center justify-between py-1.5 px-2 rounded-md text-sm font-medium transition-colors ${isActiveParent
                        ? "text-white bg-saprix-electric-blue"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                        }`}
                    >
                      <span>{parent.name}</span>
                      {parent.count !== undefined && <span className="text-xs opacity-60">({parent.count})</span>}
                    </button>

                    {/* Children */}
                    {parent.children && parent.children.length > 0 && (
                      <div className="ml-3 pl-3 border-l border-gray-200 dark:border-gray-700 space-y-1">
                        {parent.children.map((child: any) => {
                          const isActiveChild = selected.category?.includes(child.slug);
                          return (
                            <button
                              key={child.id}
                              onClick={() => {
                                const href = makeHref({ category: isActiveChild ? undefined : child.slug });
                                router.push(href);
                              }}
                              className={`w-full flex items-center justify-between py-1 px-2 rounded-md text-sm transition-colors ${isActiveChild
                                ? "text-white bg-saprix-electric-blue font-medium"
                                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
                                }`}
                            >
                              <span>{child.name}</span>
                              {child.count !== undefined && <span className="text-xs opacity-60">({child.count})</span>}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Colors */}
        {colorAttr && (
          <div className="p-4">
            <button
              onClick={() => toggleSection("color")}
              className="w-full flex items-center justify-between mb-2"
            >
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Color</h3>
              {openSections.color ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {openSections.color && (
              <div className="flex flex-wrap gap-2">
                {colorAttr.terms.map(term => {
                  // Simple color mapping logic (can be improved)
                  const colorMap: Record<string, string> = {
                    'negro': '#000000', 'blanco': '#ffffff', 'rojo': '#ef4444', 'azul': '#3b82f6',
                    'verde': '#22c55e', 'amarillo': '#eab308', 'naranja': '#f97316', 'gris': '#6b7280',
                    'morado': '#a855f7', 'rosa': '#ec4899', 'dorado': '#fbbf24', 'plateado': '#9ca3af',
                    'neon': '#ccff00'
                  };
                  const bg = colorMap[term.slug.split('-')[0]] || '#cccccc';
                  const isActive = selected.attr_color?.includes(term.slug);

                  return (
                    <Link
                      key={term.id}
                      href={makeHref({ attr_color: isActive ? undefined : term.slug })}
                      className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${isActive ? 'ring-2 ring-offset-2 ring-saprix-electric-blue scale-110' : 'border-gray-200 hover:scale-105'
                        }`}
                      style={{ backgroundColor: bg }}
                      title={term.name}
                    >
                      {isActive && <Check className={`w-4 h-4 ${bg === '#ffffff' ? 'text-black' : 'text-white'}`} />}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Sizes */}
        {sizeAttr && (
          <div className="p-4">
            <button
              onClick={() => toggleSection("size")}
              className="w-full flex items-center justify-between mb-2"
            >
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Talla</h3>
              {openSections.size ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {openSections.size && (
              <div className="grid grid-cols-4 gap-2">
                {sizeAttr.terms.map(term => {
                  const isActive = selected.attr_talla?.includes(term.slug);
                  return (
                    <Link
                      key={term.id}
                      href={makeHref({ attr_talla: isActive ? undefined : term.slug })}
                      className={`flex items-center justify-center py-2 rounded-md text-xs font-bold border transition-all ${isActive
                        ? 'bg-saprix-electric-blue text-white border-saprix-electric-blue'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-gray-400'
                        }`}
                    >
                      {term.name}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Other Attributes (Linea, Audiencia, Tags) */}
        {lineaAttr && (
          <div className="p-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Línea</h3>
            <div className="flex flex-wrap gap-2">
              {lineaAttr.terms.map(term => (
                <Link key={term.id} href={makeHref({ attr_linea: term.slug })} className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded hover:bg-gray-200">{term.name}</Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}