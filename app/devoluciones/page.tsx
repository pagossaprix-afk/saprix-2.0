export default function Page() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">Devoluciones</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-3xl">Conoce el proceso y las condiciones para solicitar una devolución o cambio.</p>

        <section className="space-y-4 mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Condiciones</h2>
          <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2">
            <li>Producto sin uso y en su empaque original.</li>
            <li>Solicitudes dentro de los 30 días calendario posteriores a la compra.</li>
            <li>Presentar número de orden y comprobante de pago.</li>
          </ul>
        </section>

        <section className="space-y-4 mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Cómo solicitar</h2>
          <ol className="list-decimal pl-6 text-gray-600 dark:text-gray-400 space-y-2">
            <li>Escríbenos a servicioalcliente@pagos.saprix.com.co con tu número de orden.</li>
            <li>Indica el motivo de la devolución o cambio y adjunta fotos si aplica.</li>
            <li>Recibirás instrucciones para el envío del producto a nuestra bodega.</li>
          </ol>
        </section>

        <section className="space-y-4 mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Tiempos</h2>
          <p className="text-gray-600 dark:text-gray-400">Una vez recibido y verificado el producto, el reembolso se procesa entre 5–10 días hábiles al método de pago original.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Garantías</h2>
          <p className="text-gray-600 dark:text-gray-400">Los productos con defecto de fabricación aplican a garantía del fabricante según política vigente.</p>
        </section>
      </div>
    </main>
  );
}

