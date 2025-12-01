// ¡MACHETAZO: /app/mapeo-secreto/page.tsx! 

import { getWooApi } from "@/lib/woocommerce"; 

// Función pa' jalar productos con filtros y paginación 
async function getMapeoDeProductos(params: any) { 
  try { 
    const response = await getWooApi().get("products", params); 
    return { 
      data: response.data, 
      total: parseInt(response.headers?.["x-wp-total"] ?? "0"), 
      totalPages: parseInt(response.headers?.["x-wp-totalpages"] ?? "0"), 
    }; 
  } catch (e: any) { 
    console.error("¡ERROR BERRRACO EN EL MAPEO!", e.response?.data || e.message); 
    return { data: [], total: 0, totalPages: 0 }; 
  } 
} 

// La Página de Auditoría (¡Nivel Dios!) 
export default async function MapeoSecretoPage({ 
  searchParams, 
}: { 
  searchParams: { 
    page?: string; 
    per_page?: string; 
    type?: string; 
    slug?: string; 
    search?: string; 
  }; 
}) { 
  // Leer filtros desde query params 
  const page = Math.max(1, parseInt(searchParams?.page ?? "1")); 
  const perPageRaw = parseInt(searchParams?.per_page ?? "20"); 
  const per_page = Math.min(Math.max(perPageRaw || 20, 1), 100); 
  const type = (searchParams?.type ?? "all").toString(); 
  const slug = (searchParams?.slug ?? "").toString(); 
  const search = (searchParams?.search ?? "").toString(); 

  const queryParams: any = { 
    per_page, 
    page, 
    orderby: "date", 
    order: "desc", 
  }; 
  if (type && type !== "all") queryParams.type = type; 
  if (slug) queryParams.slug = slug; 
  if (search) queryParams.search = search; 

  const { data: products, total, totalPages } = await getMapeoDeProductos(queryParams); 

  const buildQuery = (nextPage: number) => { 
    const sp = new URLSearchParams(); 
    sp.set("page", String(nextPage)); 
    sp.set("per_page", String(per_page)); 
    if (type && type !== "all") sp.set("type", type); 
    if (slug) sp.set("slug", slug); 
    if (search) sp.set("search", search); 
    return sp.toString(); 
  }; 

  return ( 
    <div className="container mx-auto px-4 py-16"> 
      <h1 className="text-4xl font-semibold text-saprix-electric-blue mb-8"> 
        MAPEO DE BODEGA (¡LA VERDAD "ATERRIZADA"!) 
      </h1> 
      <p className="mb-8 text-saprix-indigo"> 
        El Conector (Proyectos Krezco) tenía razón. Dejemos de "adivinar" y "mapeemos" esta hijuemadre mondá. 
      </p> 

      {/* Filtros */} 
      <form method="get" className="mb-8 grid grid-cols-1 md:grid-cols-5 gap-4 items-end"> 
        <div>
          <label className="block text-xs text-saprix-white mb-1">Tipo</label>
          <select name="type" defaultValue={type} className="w-full h-10 rounded bg-saprix-black-blue border border-saprix-indigo text-saprix-white px-2">
            <option value="all">Todos</option>
            <option value="variable">Variable</option>
            <option value="simple">Simple</option>
          </select>
        </div>
        <div>
          <label className="block text-xs text-saprix-white mb-1">Buscar (nombre)</label>
          <input name="search" defaultValue={search} placeholder="Nombre" className="w-full h-10 rounded bg-saprix-black-blue border border-saprix-indigo text-saprix-white px-2" />
        </div>
        <div>
          <label className="block text-xs text-saprix-white mb-1">Slug exacto</label>
          <input name="slug" defaultValue={slug} placeholder="slug" className="w-full h-10 rounded bg-saprix-black-blue border border-saprix-indigo text-saprix-white px-2" />
        </div>
        <div>
          <label className="block text-xs text-saprix-white mb-1">Por página</label>
          <select name="per_page" defaultValue={String(per_page)} className="w-full h-10 rounded bg-saprix-black-blue border border-saprix-indigo text-saprix-white px-2">
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>
        <div className="flex gap-3">
          <input type="hidden" name="page" value="1" />
          <button type="submit" className="h-10 px-4 rounded bg-saprix-electric-blue text-saprix-white hover:bg-saprix-indigo">Filtrar</button>
          <a href="/mapeo-secreto" className="h-10 px-3 rounded border border-saprix-indigo text-saprix-white flex items-center">Limpiar</a>
          <a href={`/mapeo-secreto/export?${buildQuery(1)}`} className="h-10 px-3 rounded border border-saprix-indigo text-saprix-white flex items-center" title="Descargar JSON completo (todas las páginas)">Descargar JSON</a>
        </div>
      </form>

      {/* Estado/Paginación */}
      <div className="mb-4 text-sm text-saprix-indigo">
        <span>Resultados: {products.length} {total ? `(de ${total})` : ''}</span>
        {totalPages ? <span className="ml-4">Página {page} de {totalPages}</span> : null}
      </div>

      {/* ¡LA TABLA DE LA VERDAD! */} 
      <div className="overflow-x-auto"> 
        <table className="min-w-full divide-y divide-saprix-indigo"> 
          <thead className="bg-saprix-indigo"> 
            <tr> 
              <th className="px-4 py-3 text-left text-xs font-semibold text-saprix-white uppercase tracking-wider">ID</th> 
              <th className="px-4 py-3 text-left text-xs font-semibold text-saprix-white uppercase tracking-wider">Nombre</th> 
              <th className="px-4 py-3 text-left text-xs font-semibold text-saprix-white uppercase tracking-wider">Slug</th> 
              <th className="px-4 py-3 text-left text-xs font-semibold text-saprix-white uppercase tracking-wider">Tipo (Variable/Simple)</th> 
              <th className="px-4 py-3 text-left text-xs font-semibold text-saprix-white uppercase tracking-wider">Atributos (¡El Dato Rey!)</th> 
            </tr> 
          </thead> 
          <tbody className="bg-saprix-black-blue divide-y divide-saprix-indigo"> 
            {products.map((product: any) => ( 
              <tr key={product.id}> 
                <td className="px-4 py-4 whitespace-nowrap text-sm text-saprix-white">{product.id}</td> 
                <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-saprix-white">{product.name}</td> 
                <td className="px-4 py-4 whitespace-nowrap text-sm text-saprix-indigo">{product.slug}</td> 
                <td className={`px-4 py-4 whitespace-nowrap text-sm font-bold ${product.type === 'variable' ? 'text-saprix-electric-blue' : 'text-saprix-white'}`}> 
                  {product.type} 
                </td> 
                <td className="px-4 py-4 text-xs text-gray-400"> 
                  {/* ¡Aquí pintamos el JSON de los atributos! */} 
                  <pre>{JSON.stringify(product.attributes.map((a: any) => ({ name: a.name, options: a.options })), null, 2)}</pre> 
                </td> 
              </tr> 
            ))} 
          </tbody> 
        </table> 
      </div> 

      {/* Controles de paginación básica */}
      <div className="mt-6 flex items-center gap-3">
        <a
          className={`px-3 h-10 rounded border border-saprix-indigo text-saprix-white flex items-center ${page <= 1 ? 'pointer-events-none opacity-50' : ''}`}
          href={`/mapeo-secreto?${buildQuery(Math.max(1, page - 1))}`}
        >
          ← Anterior
        </a>
        <a
          className={`px-3 h-10 rounded border border-saprix-indigo text-saprix-white flex items-center ${totalPages && page >= totalPages ? 'pointer-events-none opacity-50' : ''}`}
          href={`/mapeo-secreto?${buildQuery(page + 1)}`}
        >
          Siguiente →
        </a>
      </div>
    </div> 
  ); 
}
