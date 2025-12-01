"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Ruler, ArrowLeft } from 'lucide-react';

const GUIDES = [
    { id: 'kids', name: 'Saprix Kids', keywords: ['kids', 'niño', 'niña', 'infantil'], image: '/size-guide-kids.jpg' },
    { id: 'londres', name: 'Referencia Londres', keywords: ['londres'], image: '/size-guide-londres.jpg' },
    { id: 'roma', name: 'Referencia Roma', keywords: ['roma'], image: '/size-guide-roma.jpg' },
    { id: 'tokio', name: 'Referencia Tokio', keywords: ['tokio'], image: '/size-guide-tokio.jpg' },
];

export default function SizeGuidePage() {
    const [activeGuide, setActiveGuide] = useState(GUIDES[0]);

    return (
        <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <Link href="/tienda" className="inline-flex items-center gap-2 text-sm font-bold uppercase underline hover:text-gray-600 transition-colors mb-6">
                        <ArrowLeft className="w-4 h-4" />
                        Volver a la tienda
                    </Link>
                    <h1 className="text-3xl md:text-5xl font-black uppercase italic text-black mb-4">
                        GUÍA DE TALLAS
                    </h1>
                    <p className="text-gray-600 max-w-2xl text-lg">
                        Encuentra tu ajuste perfecto. Nuestras tallas están diseñadas para ofrecer el máximo rendimiento y comodidad en la cancha.
                    </p>
                </div>

                <div className="bg-white border border-gray-200 shadow-sm">
                    {/* Tabs */}
                    <div className="flex flex-wrap border-b border-gray-200">
                        {GUIDES.map((guide) => (
                            <button
                                key={guide.id}
                                onClick={() => setActiveGuide(guide)}
                                className={`px-6 py-4 text-sm font-bold uppercase tracking-wide transition-all border-b-2 hover:bg-gray-50 ${activeGuide.id === guide.id
                                    ? 'border-black text-black bg-gray-50'
                                    : 'border-transparent text-gray-500 hover:text-black hover:border-gray-300'
                                    }`}
                            >
                                {guide.name}
                            </button>
                        ))}
                    </div>

                    <div className="p-6 md:p-10">
                        {/* Description */}
                        <div className="flex items-start gap-4 mb-8 bg-blue-50 p-4 border-l-4 border-blue-600">
                            <Ruler className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                            <p className="text-sm text-blue-900 leading-relaxed">
                                <strong>Consejo de experto:</strong> El calzado de Futsal debe quedar ajustado pero cómodo. Si estás entre dos tallas, te recomendamos elegir la más grande para mayor comodidad, o la más pequeña para un ajuste más preciso y mayor control del balón.
                            </p>
                        </div>

                        {/* Size Chart Image */}
                        <div className="relative w-full bg-gray-50 overflow-hidden border border-gray-100 mb-10">
                            <div className="aspect-[16/9] relative">
                                {/* Placeholder for actual image if not found, or the image itself */}
                                <div className="absolute inset-0 flex items-center justify-center text-gray-400 bg-gray-100">
                                    <span className="text-sm uppercase font-bold">Imagen de guía de tallas: {activeGuide.name}</span>
                                </div>
                                <Image
                                    src={activeGuide.image}
                                    alt={`Guía de tallas ${activeGuide.name}`}
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        </div>

                        {/* Instructions */}
                        <div className="grid md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="font-black text-black uppercase text-lg mb-4">¿Cómo medir tu pie?</h3>
                                <ol className="list-decimal list-inside space-y-3 text-gray-700">
                                    <li className="pl-2"><span className="font-bold">Preparación:</span> Coloca una hoja de papel en el suelo, pegada a una pared.</li>
                                    <li className="pl-2"><span className="font-bold">Posición:</span> Pisa la hoja con el talón tocando la pared. Asegúrate de estar de pie con el peso distribuido uniformemente.</li>
                                    <li className="pl-2"><span className="font-bold">Medición:</span> Marca con un lápiz el punto donde termina tu dedo más largo.</li>
                                    <li className="pl-2"><span className="font-bold">Resultado:</span> Mide la distancia desde el borde de la hoja hasta la marca en centímetros.</li>
                                </ol>
                            </div>
                            <div className="bg-gray-50 p-6 border border-gray-200">
                                <h3 className="font-black text-black uppercase text-lg mb-4">Recomendaciones</h3>
                                <ul className="space-y-3 text-gray-700">
                                    <li className="flex items-start gap-2">
                                        <span className="text-black font-bold">•</span>
                                        Mide tus pies al final del día, ya que suelen hincharse ligeramente.
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-black font-bold">•</span>
                                        Si tienes un pie más largo que el otro, usa la medida del más largo.
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-black font-bold">•</span>
                                        Usa las medias que normalmente usarías para jugar.
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
