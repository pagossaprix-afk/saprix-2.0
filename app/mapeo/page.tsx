import Link from "next/link";
import { productSingleMapping } from "@/config/mappings/product-single";
import { applyMapping } from "@/lib/mapping";
import { getProductBySlug, getLatestProduct, getAllProductCategories, getAllProductTags, getAllProductAttributesWithTerms } from "@/lib/woocommerce";
import type { Product } from "@/types/woocommerce";

export const dynamic = "force-dynamic";

type CategoryKey =
  | "Identidad"
  | "Media"
  | "Precios"
  | "Inventario"
  | "Contenido"
  | "Taxonomías"
  | "Variaciones"
  | "Otros";

const CATEGORY_ORDER: CategoryKey[] = [
  "Identidad",
  "Media",
  "Precios",
  "Inventario",
  "Contenido",
  "Taxonomías",
  "Variaciones",
  "Otros",
];

// Asignación de categorías por id de campo (ampliable sin tocar tipos)
const CATEGORY_BY_ID: Record<string, CategoryKey> = {
  id: "Identidad",
  name: "Identidad",
  slug: "Identidad",
  type: "Identidad",
  image: "Media",
  regular_price: "Precios",
  sale_price: "Precios",
  price: "Precios",
  final_price: "Precios",
  stock_status: "Inventario",
  short_description: "Contenido",
  description: "Contenido",
  tags: "Taxonomías",
};

function FieldCard({
  id,
  title,
  source,
  type,
  defaultValue,
  computed,
  value,
}: {
  id: string;
  title: string;
  source: string | null | undefined;
  type: string;
  defaultValue?: string;
  computed?: string;
  value?: any;
}) {
  const mappingPreview = {
    id,
    source: source ?? null,
    type,
    ...(defaultValue ? { defaultValue } : {}),
    ...(computed ? { computed } : {}),
  };

  return (
    <div className="rounded border border-saprix-indigo/40 bg-dark-performance-900 p-4">
      <h3 className="text-saprix-white text-sm font-semibold">{title}</h3>
      <div className="mt-1 text-xs text-gray-400">
        {source !== null ? (
          <>
            <span className="font-mono">source:</span> <span className="font-mono text-gray-300">{String(source)}</span>
          </>
        ) : (
          <span className="font-mono">source: null</span>
        )}
        <span className="ml-2">•</span>
        <span className="ml-2 font-mono">type:</span> <span className="font-mono text-gray-300">{type}</span>
      </div>
      <pre className="mt-3 text-xs bg-dark-performance-800 rounded p-3 text-gray-300 overflow-auto max-h-56">
        {JSON.stringify(mappingPreview, null, 2)}
      </pre>
      <div className="mt-3">
        <div className="text-xs text-gray-400 mb-1">Referente</div>
        {/* Render específico por tipo/id */}
        {value == null ? (
          <div className="text-sm text-gray-500">—</div>
        ) : id === "image" && typeof value === "string" ? (
          <img src={value} alt={title} className="h-24 w-auto rounded border border-dark-performance-700" />
        ) : id === "short_description" && typeof value === "string" ? (
          <div className="prose prose-invert max-w-none text-gray-300" dangerouslySetInnerHTML={{ __html: value }} />
        ) : id === "description" && typeof value === "string" ? (
          <div className="prose prose-invert max-w-none text-gray-300 max-h-40 overflow-auto" dangerouslySetInnerHTML={{ __html: value }} />
        ) : Array.isArray(value) ? (
          <div className="flex flex-wrap gap-2">
            {value.map((v, i) => (
              <span key={`${id}-${i}`} className="text-xs px-2 py-1 rounded bg-dark-performance-800 border border-saprix-indigo text-saprix-white">
                {typeof v === "string" ? v : JSON.stringify(v)}
              </span>
            ))}
          </div>
        ) : (
          <div className="text-sm text-saprix-white font-mono">{typeof value === "object" ? JSON.stringify(value) : String(value)}</div>
        )}
      </div>
    </div>
  );
}

export default async function MappingReferencePage({ searchParams }: { searchParams?: { slug?: string } }) {
  // Agrupación de items por categoría
  const groups = new Map<CategoryKey, typeof productSingleMapping>();
  for (const item of productSingleMapping) {
    const cat = CATEGORY_BY_ID[item.id] ?? "Otros";
    const arr = groups.get(cat) ?? [];
    arr.push(item);
    groups.set(cat, arr);
  }

  // Producto de referencia (slug opcional, fallback: más reciente)
  const slug = searchParams?.slug;
  const sample: Product | null = slug ? await getProductBySlug(slug) : await getLatestProduct();
  const mapped = sample ? applyMapping(sample, productSingleMapping) : null;

  // Catálogo global (todas las categorías/etiquetas/atributos)
  const [allCategories, allTags, allAttrsWithTerms] = await Promise.all([
    getAllProductCategories(),
    getAllProductTags(),
    getAllProductAttributesWithTerms(),
  ]);

  return (
    <div className="px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-saprix-white">Mapeo de Datos (Referencia)</h1>
        <p className="mt-2 text-gray-300">
          Esta página documenta la estructura y el código de mapeo para los campos de WooCommerce
          actualmente utilizados. Está organizada por categorías y pensada para ampliarse fácilmente.
        </p>
        <div className="mt-2 text-xs text-gray-400">
          Fuente principal: <code className="font-mono">config/mappings/product-single.ts</code>. Uso: <code className="font-mono">applyMapping(sample, productSingleMapping)</code>.
        </div>
        <div className="mt-2 text-xs text-gray-400">
          Muestra opcional: añade <code className="font-mono">?slug=</code> a la URL (p. ej. <code className="font-mono">/mapeo?slug=tokio</code>) para ver los valores reales.
          Si no se indica, se usa el producto más reciente como referencia.
        </div>
        {mapped && (
          <div className="mt-3 text-xs text-gray-400">
            Referencia actual: <span className="font-mono text-gray-300">{mapped.name ?? sample?.name ?? "(sin nombre)"}</span>
          </div>
        )}
      </div>

      {CATEGORY_ORDER.map((cat) => {
        const items = groups.get(cat);
        if (!items || items.length === 0) return null;
        return (
          <section key={cat} className="mb-8">
            <h2 className="text-saprix-white font-semibold mb-3">{cat}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((item) => (
                <FieldCard
                  key={item.id}
                  id={item.id}
                  title={item.label ?? item.id}
                  source={item.source}
                  type={item.type}
                  defaultValue={item.defaultValue}
                  computed={item.computed}
                  value={mapped ? (mapped as any)[item.id] : undefined}
                />
              ))}
            </div>
          </section>
        );
      })}

      <section className="mb-8">
        <h2 className="text-saprix-white font-semibold mb-3">Variaciones</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="rounded border border-saprix-indigo/40 bg-dark-performance-900 p-4">
            <h3 className="text-saprix-white text-sm font-semibold">Colores desde variaciones</h3>
            <p className="mt-1 text-xs text-gray-400">Helper: <code className="font-mono">getColorOptionsFromVariations(productId)</code></p>
            <pre className="mt-3 text-xs bg-dark-performance-800 rounded p-3 text-gray-300 overflow-auto max-h-56">
              {`import { getColorOptionsFromVariations } from "@/lib/woocommerce";

const colors = await getColorOptionsFromVariations(productId);
// Resultado:
// [
//   { option: "Rojo", variations: [123, 124], image: "https://.../media.jpg" },
//   { option: "Azul", variations: [125], image: "https://.../media.jpg" }
// ]`}
            </pre>
          </div>
          <div className="rounded border border-saprix-indigo/40 bg-dark-performance-900 p-4">
            <h3 className="text-saprix-white text-sm font-semibold">Tallas desde variaciones</h3>
            <p className="mt-1 text-xs text-gray-400">Helper: <code className="font-mono">getSizeOptionsFromVariations(productId)</code></p>
            <pre className="mt-3 text-xs bg-dark-performance-800 rounded p-3 text-gray-300 overflow-auto max-h-56">
              {`import { getSizeOptionsFromVariations } from "@/lib/woocommerce";

const sizes = await getSizeOptionsFromVariations(productId);
// Resultado:
// [
//   { option: "S", variations: [123] },
//   { option: "M", variations: [124, 125] },
// ]`}
            </pre>
          </div>
        </div>
        <div className="mt-3 text-xs text-gray-400">
          Detección flexible: atributos cuyo slug o nombre contienen <code className="font-mono">color</code>,
          <code className="font-mono">talla</code> o <code className="font-mono">size</code>. Se puede fijar a slugs específicos (p. ej. <code className="font-mono">pa_color</code>, <code className="font-mono">pa_talla</code>).
        </div>
      </section>

      {/* Taxonomías completas (como vienen de WooCommerce) */}
      <section className="mb-8">
        <h2 className="text-saprix-white font-semibold mb-3">Taxonomías completas (referente crudo)</h2>
        {!sample ? (
          <div className="text-sm text-gray-400">No hay producto de referencia disponible.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Categorías */}
            <div className="rounded border border-saprix-indigo/40 bg-dark-performance-900 p-4">
              <h3 className="text-saprix-white text-sm font-semibold">Categorías</h3>
              {Array.isArray(sample.categories) && sample.categories.length > 0 ? (
                <ul className="mt-2 space-y-1">
                  {sample.categories.map((c: any) => (
                    <li key={`cat-${c?.id ?? c?.slug ?? c?.name}`} className="text-sm text-gray-300">
                      <span className="font-semibold text-saprix-white">{c?.name}</span>
                      {c?.slug && <span className="ml-2 text-xs text-gray-500">({c.slug})</span>}
                      {typeof c?.id !== "undefined" && <span className="ml-2 text-xs text-gray-500">ID: {c.id}</span>}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="mt-2 text-sm text-gray-500">—</div>
              )}
              <pre className="mt-3 text-xs bg-dark-performance-800 rounded p-3 text-gray-300 overflow-auto max-h-56">{JSON.stringify(sample.categories ?? [], null, 2)}</pre>
            </div>

            {/* Etiquetas */}
            <div className="rounded border border-saprix-indigo/40 bg-dark-performance-900 p-4">
              <h3 className="text-saprix-white text-sm font-semibold">Etiquetas</h3>
              {Array.isArray(sample.tags) && sample.tags.length > 0 ? (
                <ul className="mt-2 space-y-1">
                  {sample.tags.map((t: any) => (
                    <li key={`tag-${t?.id ?? t?.slug ?? t?.name}`} className="text-sm text-gray-300">
                      <span className="font-semibold text-saprix-white">{t?.name}</span>
                      {t?.slug && <span className="ml-2 text-xs text-gray-500">({t.slug})</span>}
                      {typeof t?.id !== "undefined" && <span className="ml-2 text-xs text-gray-500">ID: {t.id}</span>}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="mt-2 text-sm text-gray-500">—</div>
              )}
              <pre className="mt-3 text-xs bg-dark-performance-800 rounded p-3 text-gray-300 overflow-auto max-h-56">{JSON.stringify(sample.tags ?? [], null, 2)}</pre>
            </div>

            {/* Atributos del producto */}
            <div className="rounded border border-saprix-indigo/40 bg-dark-performance-900 p-4">
              <h3 className="text-saprix-white text-sm font-semibold">Atributos</h3>
              {Array.isArray(sample.attributes) && sample.attributes.length > 0 ? (
                <ul className="mt-2 space-y-2">
                  {sample.attributes.map((a: any, idx: number) => (
                    <li key={`attr-${a?.id ?? a?.name ?? idx}`} className="text-sm text-gray-300">
                      <div>
                        <span className="font-semibold text-saprix-white">{a?.name ?? "(sin nombre)"}</span>
                        {typeof a?.id !== "undefined" && <span className="ml-2 text-xs text-gray-500">ID: {a.id}</span>}
                        {typeof a?.position !== "undefined" && <span className="ml-2 text-xs text-gray-500">pos: {a.position}</span>}
                        {typeof a?.visible !== "undefined" && <span className="ml-2 text-xs text-gray-500">visible: {String(a.visible)}</span>}
                        {typeof a?.variation !== "undefined" && <span className="ml-2 text-xs text-gray-500">variation: {String(a.variation)}</span>}
                      </div>
                      {Array.isArray(a?.options) && a.options.length > 0 && (
                        <div className="mt-1 flex flex-wrap gap-2">
                          {a.options.map((opt: any, i: number) => (
                            <span key={`opt-${i}`} className="text-xs px-2 py-1 rounded bg-dark-performance-800 border border-saprix-indigo text-saprix-white">
                              {String(opt)}
                            </span>
                          ))}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="mt-2 text-sm text-gray-500">—</div>
              )}
              <pre className="mt-3 text-xs bg-dark-performance-800 rounded p-3 text-gray-300 overflow-auto max-h-56">{JSON.stringify(sample.attributes ?? [], null, 2)}</pre>
            </div>
          </div>
        )}
        <div className="mt-3 text-xs text-gray-400">
          Las etiquetas y categorías se muestran tal como las retorna WooCommerce en el producto. Los atributos aquí son los del producto padre; las combinaciones específicas viven en las variaciones.
        </div>
      </section>

      {/* Catálogo global: todas las categorías, etiquetas y atributos */}
      <section className="mb-8">
        <h2 className="text-saprix-white font-semibold mb-3">Catálogo global (todas las categorías, etiquetas y atributos)</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Categorías globales */}
          <div className="rounded border border-saprix-indigo/40 bg-dark-performance-900 p-4">
            <h3 className="text-saprix-white text-sm font-semibold">Categorías</h3>
            {Array.isArray(allCategories) && allCategories.length > 0 ? (
              <ul className="mt-2 space-y-1">
                {allCategories.map((c: any) => (
                  <li key={`g-cat-${c?.id ?? c?.slug ?? c?.name}`} className="text-sm text-gray-300">
                    <span className="font-semibold text-saprix-white">{c?.name}</span>
                    {c?.slug && <span className="ml-2 text-xs text-gray-500">({c.slug})</span>}
                    {typeof c?.id !== "undefined" && <span className="ml-2 text-xs text-gray-500">ID: {c.id}</span>}
                    {typeof c?.count !== "undefined" && <span className="ml-2 text-xs text-gray-500">{c.count} productos</span>}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="mt-2 text-sm text-gray-500">—</div>
            )}
            <pre className="mt-3 text-xs bg-dark-performance-800 rounded p-3 text-gray-300 overflow-auto max-h-56">{JSON.stringify(allCategories ?? [], null, 2)}</pre>
          </div>

          {/* Etiquetas globales */}
          <div className="rounded border border-saprix-indigo/40 bg-dark-performance-900 p-4">
            <h3 className="text-saprix-white text-sm font-semibold">Etiquetas</h3>
            {Array.isArray(allTags) && allTags.length > 0 ? (
              <ul className="mt-2 space-y-1">
                {allTags.map((t: any) => (
                  <li key={`g-tag-${t?.id ?? t?.slug ?? t?.name}`} className="text-sm text-gray-300">
                    <span className="font-semibold text-saprix-white">{t?.name}</span>
                    {t?.slug && <span className="ml-2 text-xs text-gray-500">({t.slug})</span>}
                    {typeof t?.id !== "undefined" && <span className="ml-2 text-xs text-gray-500">ID: {t.id}</span>}
                    {typeof t?.count !== "undefined" && <span className="ml-2 text-xs text-gray-500">{t.count} productos</span>}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="mt-2 text-sm text-gray-500">—</div>
            )}
            <pre className="mt-3 text-xs bg-dark-performance-800 rounded p-3 text-gray-300 overflow-auto max-h-56">{JSON.stringify(allTags ?? [], null, 2)}</pre>
          </div>

          {/* Atributos globales con términos */}
          <div className="rounded border border-saprix-indigo/40 bg-dark-performance-900 p-4">
            <h3 className="text-saprix-white text-sm font-semibold">Atributos</h3>
            {Array.isArray(allAttrsWithTerms) && allAttrsWithTerms.length > 0 ? (
              <ul className="mt-2 space-y-3">
                {allAttrsWithTerms.map((row: any, idx: number) => (
                  <li key={`g-attr-${String(row?.attribute?.id ?? row?.attribute?.slug ?? row?.attribute?.name)}-${idx}`} className="text-sm text-gray-300">
                    <div>
                      <span className="font-semibold text-saprix-white">{row?.attribute?.name ?? "(sin nombre)"}</span>
                      {typeof row?.attribute?.id !== "undefined" && <span className="ml-2 text-xs text-gray-500">ID: {row.attribute.id}</span>}
                      {row?.attribute?.slug && <span className="ml-2 text-xs text-gray-500">({row.attribute.slug})</span>}
                    </div>
                    {Array.isArray(row?.terms) && row.terms.length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-2">
                        {row.terms.map((term: any, i: number) => (
                          <span key={`g-opt-${String(row?.attribute?.id ?? idx)}-${String(term?.id ?? i)}`} className="text-xs px-2 py-1 rounded bg-dark-performance-800 border border-saprix-indigo text-saprix-white">
                            {String(term?.name ?? term?.slug ?? term?.id)}
                          </span>
                        ))}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="mt-2 text-sm text-gray-500">—</div>
            )}
            <pre className="mt-3 text-xs bg-dark-performance-800 rounded p-3 text-gray-300 overflow-auto max-h-56">{JSON.stringify(allAttrsWithTerms ?? [], null, 2)}</pre>
          </div>
        </div>
        <div className="mt-3 text-xs text-gray-400">
          Esta sección lista todo el catálogo desde WooCommerce: categorías, etiquetas y atributos con sus términos. Útil para definir mapeos y normalizaciones futuras.
        </div>
      </section>

      <div className="mt-10 border-t border-dark-performance-700 pt-6 text-sm text-gray-400">
        <p>
          Para ampliar, añade nuevos campos en <code className="font-mono">productSingleMapping</code> y asigna su id aquí en <code className="font-mono">CATEGORY_BY_ID</code>.
          Si no se asigna, aparecerán automáticamente en la categoría "Otros".
        </p>
        <p className="mt-2">
          Cuando definas la estructura objetivo completa, podré ajustar el mapeo y esta referencia para que
          reflejen tus categorías y nombres finales.
        </p>
        <div className="mt-3">
          <Link href="/producto/tokio" className="text-saprix-indigo hover:underline">Ver ejemplo de uso en página de producto</Link>
        </div>
      </div>
    </div>
  );
}