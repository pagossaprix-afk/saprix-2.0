"use client";

import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Droplets, Sun } from 'lucide-react';

export default function ProductCarePage() {
    return (
        <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <Link href="/tienda" className="inline-flex items-center gap-2 text-sm font-bold uppercase underline hover:text-gray-600 transition-colors mb-6">
                        <ArrowLeft className="w-4 h-4" />
                        Volver a la tienda
                    </Link>
                    <h1 className="text-3xl md:text-5xl font-black uppercase italic text-black mb-4">
                        CUIDADO DEL PRODUCTO
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Maximiza la vida útil de tu equipación Saprix con estos consejos de cuidado y mantenimiento.
                    </p>
                </div>

                <div className="grid gap-8 md:grid-cols-2">
                    <div className="bg-gray-50 p-8 border border-gray-100 hover:border-black transition-colors group">
                        <div className="w-12 h-12 bg-white border border-gray-200 flex items-center justify-center mb-6 group-hover:bg-black group-hover:text-white transition-colors">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-black uppercase text-black mb-4">Calzado de Futsal</h3>
                        <ul className="space-y-3 text-gray-700">
                            <li>• Limpia la suela después de cada uso con un trapo húmedo.</li>
                            <li>• No laves tus zapatillas en lavadora.</li>
                            <li>• Seca a la sombra, nunca expongas directamente al sol o fuentes de calor.</li>
                            <li>• Usa hormas o papel periódico en el interior para mantener la forma.</li>
                        </ul>
                    </div>

                    <div className="bg-gray-50 p-8 border border-gray-100 hover:border-black transition-colors group">
                        <div className="w-12 h-12 bg-white border border-gray-200 flex items-center justify-center mb-6 group-hover:bg-black group-hover:text-white transition-colors">
                            <Droplets className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-black uppercase text-black mb-4">Ropa Deportiva</h3>
                        <ul className="space-y-3 text-gray-700">
                            <li>• Lava con agua fría y colores similares.</li>
                            <li>• No uses blanqueador ni suavizante.</li>
                            <li>• No planchar sobre estampados o logos.</li>
                            <li>• Secar al aire libre preferiblemente.</li>
                        </ul>
                    </div>

                    <div className="bg-gray-50 p-8 border border-gray-100 hover:border-black transition-colors group md:col-span-2">
                        <div className="w-12 h-12 bg-white border border-gray-200 flex items-center justify-center mb-6 group-hover:bg-black group-hover:text-white transition-colors">
                            <Sun className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-black uppercase text-black mb-4">Balones</h3>
                        <ul className="space-y-3 text-gray-700 grid md:grid-cols-2 gap-4">
                            <li>• Limpia la superficie con un paño húmedo.</li>
                            <li>• No desinfles completamente el balón para guardarlo.</li>
                            <li>• Evita jugar en superficies abrasivas no aptas (como asfalto rugoso) si el balón es para sala.</li>
                            <li>• Lubrica la aguja antes de inflar para proteger la válvula.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
