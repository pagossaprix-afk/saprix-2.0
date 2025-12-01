export default function Page() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">Términos y Condiciones</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-3xl">Lee las condiciones de uso del sitio, compras, envíos y responsabilidades.</p>

        <section className="space-y-4 mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Uso del sitio</h2>
          <p className="text-gray-600 dark:text-gray-400">Al navegar y comprar en Saprix aceptas estos términos. Nos reservamos el derecho de actualizar esta página.</p>
        </section>

        <section className="space-y-4 mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Compras y pagos</h2>
          <p className="text-gray-600 dark:text-gray-400">Los precios pueden variar sin previo aviso. Las compras se procesan de forma segura y los comprobantes se envían por correo.</p>
        </section>

        <section className="space-y-4 mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Envíos y devoluciones</h2>
          <p className="text-gray-600 dark:text-gray-400">Consulta nuestra sección de envíos y devoluciones para conocer tiempos, costos y condiciones.</p>
        </section>

        <section className="space-y-4 mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Propiedad intelectual</h2>
          <p className="text-gray-600 dark:text-gray-400">Las marcas, textos e imágenes de este sitio están protegidos por derechos de autor y uso permitido.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Contacto</h2>
          <p className="text-gray-600 dark:text-gray-400">Para consultas sobre estos términos, contáctanos en servicioalcliente@pagos.saprix.com.co.</p>
        </section>
      </div>
    </main>
  );
}

