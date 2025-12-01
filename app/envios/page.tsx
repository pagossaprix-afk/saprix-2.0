export default function Page() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">Envíos</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-3xl">Información clara sobre cobertura, tiempos y costos de envío para tus compras en Saprix.</p>

        <section className="space-y-4 mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Cobertura</h2>
          <p className="text-gray-600 dark:text-gray-400">Realizamos envíos a todo el territorio nacional a través de operadores certificados.</p>
        </section>

        <section className="space-y-4 mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Tiempos de entrega</h2>
          <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2">
            <li>Ciudades principales: 1–3 días hábiles</li>
            <li>Resto del país: 3–7 días hábiles</li>
          </ul>
        </section>

        <section className="space-y-4 mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Costos</h2>
          <p className="text-gray-600 dark:text-gray-400">El valor del envío se calcula al finalizar la compra según destino y peso/volumen del paquete. Promociones de envío gratis se informan en el carrito y checkout.</p>
        </section>

        <section className="space-y-4 mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Seguimiento</h2>
          <p className="text-gray-600 dark:text-gray-400">Recibirás un correo con el número de guía y enlaces de rastreo cuando tu pedido sea despachado.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Contacto</h2>
          <p className="text-gray-600 dark:text-gray-400">Si tienes dudas sobre tu envío, escríbenos a servicioalcliente@pagos.saprix.com.co indicando tu número de orden.</p>
        </section>
      </div>
    </main>
  );
}

