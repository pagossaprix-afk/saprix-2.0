export default function Page() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">Política de Cookies</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-3xl">Explicamos qué cookies usamos, para qué y cómo puedes gestionarlas.</p>

        <section className="space-y-4 mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Qué son las cookies</h2>
          <p className="text-gray-600 dark:text-gray-400">Las cookies son pequeños archivos que se almacenan en tu dispositivo al navegar y permiten recordar tus preferencias y mejorar tu experiencia.</p>
        </section>

        <section className="space-y-4 mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Tipos de cookies</h2>
          <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2">
            <li>Esenciales: necesarias para el funcionamiento del sitio.</li>
            <li>De rendimiento: nos ayudan a entender el uso del sitio.</li>
            <li>De funcionalidad: guardan preferencias como idioma y región.</li>
            <li>De marketing: personalizan contenido y anuncios.</li>
          </ul>
        </section>

        <section className="space-y-4 mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Gestión de cookies</h2>
          <p className="text-gray-600 dark:text-gray-400">Puedes configurar o desactivar cookies desde la configuración de tu navegador. Algunas funciones pueden verse afectadas si deshabilitas las cookies esenciales.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Contacto</h2>
          <p className="text-gray-600 dark:text-gray-400">Si tienes preguntas sobre nuestra política de cookies, escríbenos a servicioalcliente@pagos.saprix.com.co.</p>
        </section>
      </div>
    </main>
  );
}

