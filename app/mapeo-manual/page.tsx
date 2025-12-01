import ManualMapper from "@/components/mapping/ManualMapper";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <main className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-saprix-white mb-4">Mapeo Manual de WooCommerce</h1>
      <p className="text-sm text-gray-400 mb-6">Arrastra campos desde el panel izquierdo y configura tu esquema destino. Guarda tu mapeo como plantilla y valida en tiempo real.</p>
      <ManualMapper />
    </main>
  );
}