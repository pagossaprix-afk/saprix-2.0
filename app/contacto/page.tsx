export const metadata = {
  title: "Contacto | Saprix",
  description: "Ponte en contacto con Saprix para soporte y ventas.",
};

export default function ContactoPage() {
  return (
    <main className="min-h-screen bg-gray-950 px-4 py-8 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tight text-white">Contacto</h1>
        <p className="mt-3 text-gray-300">
          ¿Tienes preguntas sobre productos, pedidos o soporte? Escríbenos y te ayudamos.
        </p>
        <div className="mt-8 rounded-lg border border-saprix-indigo/30 bg-saprix-negro-azul p-6 shadow">
          <div className="space-y-4 text-gray-200">
            <p>
              Email: <a href="mailto:hola@saprix.com.co" className="text-saprix-electric-blue hover:underline">hola@saprix.com.co</a>
            </p>
            <p>
              WhatsApp: <a href="https://wa.me/573001234567" className="text-saprix-electric-blue hover:underline">+57 300 123 4567</a>
            </p>
            <p>
              Instagram: <a href="https://instagram.com/saprix" className="text-saprix-electric-blue hover:underline">@saprix</a>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}