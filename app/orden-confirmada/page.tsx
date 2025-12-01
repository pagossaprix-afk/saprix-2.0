import { Suspense } from 'react';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export default function OrdenConfirmadaPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <Suspense fallback={<div>Cargando...</div>}>
                    <OrdenConfirmadaContent />
                </Suspense>
            </div>
        </div>
    );
}

function OrdenConfirmadaContent() {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12 text-center">
            <div className="mb-8">
                <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-4" />
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                    ¡Orden Confirmada!
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                    Tu pago ha sido procesado exitosamente
                </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 mb-8">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    ¿Qué sigue?
                </h2>
                <ul className="text-left space-y-3 text-gray-600 dark:text-gray-300">
                    <li className="flex items-start">
                        <span className="text-saprix-electric-blue mr-2">✓</span>
                        Recibirás un correo de confirmación con los detalles de tu pedido
                    </li>
                    <li className="flex items-start">
                        <span className="text-saprix-electric-blue mr-2">✓</span>
                        Procesaremos tu orden en las próximas 24 horas
                    </li>
                    <li className="flex items-start">
                        <span className="text-saprix-electric-blue mr-2">✓</span>
                        Te notificaremos cuando tu pedido sea enviado
                    </li>
                </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                    href="/productos"
                    className="px-8 py-3 bg-saprix-electric-blue text-white font-semibold rounded-xl hover:bg-saprix-electric-blue-dark transition-colors"
                >
                    Seguir Comprando
                </Link>
                <Link
                    href="/"
                    className="px-8 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-semibold rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                    Volver al Inicio
                </Link>
            </div>

            <div className="mt-8 text-sm text-gray-500 dark:text-gray-400">
                ¿Necesitas ayuda? Contáctanos en{' '}
                <a href="mailto:soporte@saprix.com.co" className="text-saprix-electric-blue hover:underline">
                    soporte@saprix.com.co
                </a>
            </div>
        </div>
    );
}
