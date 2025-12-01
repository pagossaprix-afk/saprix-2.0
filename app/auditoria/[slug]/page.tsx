// app/auditoria/[slug]/page.tsx

// ¡Importamos las llaves de la "bodega"!
import { getProductBySlug, getProductVariations } from "@/lib/woocommerce";

type Props = {
  params: { slug: string };
};

/**
 * ¡LA HIJUEMADRE PRUEBA QUE DEBIMOS HACER EN LA FASE 1!
 * Aquí no hay "Wrapper", no hay "paja" de IA, no hay "swatches".
 * ¡Solo la data CRUDA como viene de la "bodega"!
 */
export default async function AuditoriaProductoPage(props: Props) {
  const params = await props.params;
  const { slug } = params;

  // 1. Pedimos el "Guayo Papá" (¡CUALQUIER GUAYO!)
  const product = await getProductBySlug(slug);

  if (!product) {
    return (
      <div className="text-red-500 p-10">
        ¡ERROR BERRRACO! No se encontró el slug: {slug}
      </div>
    );
  }

  // 2. Pedimos los "Guayos Hijos"
  const variations = await getProductVariations(product.id);

  return (
    <div className="text-white p-10 bg-dark-performance-900 min-h-screen">
      <h1 className="text-2xl font-bold text-electric-blue-500 mb-4">
        AUDITORÍA "PAPÁ": {product.name} (ID: {product.id})
      </h1>

      {/* ¡Escupimos el JSON del "papá"! */}
      <h2 className="text-lg text-gray-400">Data Cruda (Producto Padre):</h2>
      <pre className="text-xs bg-gray-800 p-4 rounded overflow-auto h-96">
        {JSON.stringify(product, null, 2)}
      </pre>

      <h1 className="mt-8 text-2xl font-bold text-electric-blue-500 mb-4">
        AUDITORÍA "HIJOS": ({variations.length} variaciones encontradas)
      </h1>

      {/* ¡Escupimos el JSON de los "hijos"! */}
      <h2 className="text-lg text-gray-400">Data Cruda (Variaciones):</h2>
      <pre className="text-xs bg-gray-800 p-4 rounded overflow-auto h-96">
        {JSON.stringify(variations, null, 2)}
      </pre>
    </div>
  );
}