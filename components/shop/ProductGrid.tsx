"use client";

import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ProductCard, ProductSummary } from "./ProductCard";

export type SortValue = "relevance" | "price-asc" | "price-desc" | "newest";

function SortBar({ shown, total, sort }: { shown: number; total: number; sort: SortValue }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateParam(name: string, value: string) {
    const params = new URLSearchParams(searchParams?.toString() || "");
    params.set(name, value);
    // Resetear a la primera página al cambiar orden
    params.delete("page");
    router.replace(`?${params.toString()}`);
  }

  return (
    <div className="mb-6 flex items-center justify-between rounded-lg border border-saprix-indigo/30 bg-saprix-negro-azul p-4 shadow">
      <p className="text-sm text-gray-400">
        Mostrando <span className="font-bold text-white">{shown}</span> de <span className="font-bold text-white">{total}</span> productos
      </p>
      <div className="flex items-center gap-2">
        <label htmlFor="sort" className="text-sm font-medium text-gray-300">
          Ordenar por:
        </label>
        <select
          id="sort"
          className="rounded-md border-gray-600 bg-gray-900 px-3 py-2 pr-8 text-sm text-white focus:border-saprix-electrico focus:ring-saprix-electrico"
          value={sort}
          onChange={(e) => updateParam("sort", e.target.value)}
        >
          <option value="relevance">Relevancia</option>
          <option value="price-asc">Precio: Menor a Mayor</option>
          <option value="price-desc">Precio: Mayor a Menor</option>
          <option value="newest">Novedades</option>
        </select>
      </div>
    </div>
  );
}

export function ProductGrid({
  products,
  meta,
  sort,
}: {
  products: ProductSummary[];
  meta: { total: number; per_page: number; page: number };
  sort: SortValue;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil((meta?.total || 0) / (meta?.per_page || 1)));
  }, [meta]);

  function loadMore() {
    const params = new URLSearchParams(searchParams?.toString() || "");
    const current = parseInt(params.get("page") || `${meta.page}`);
    const next = current + 1;
    params.set("page", `${next}`);
    router.replace(`?${params.toString()}`);
  }

  const canLoadMore = meta?.page < totalPages;

  return (
    <section>
      <SortBar shown={products.length} total={meta?.total || 0} sort={sort} />

      <div className="grid grid-cols-2 gap-x-4 gap-y-6 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-8">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      <div className="mt-12 flex justify-center">
        <button
          className="rounded-lg bg-saprix-electrico px-8 py-3 text-base font-bold text-white shadow-lg transition-transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={loadMore}
          disabled={!canLoadMore}
        >
          {canLoadMore ? "Cargar Más Productos" : "No hay más productos"}
        </button>
      </div>
    </section>
  );
}