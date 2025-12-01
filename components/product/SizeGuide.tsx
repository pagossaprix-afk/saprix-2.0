"use client";

import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, Ruler } from 'lucide-react';
import Image from 'next/image';

interface SizeGuideProps {
    isOpen: boolean;
    onClose: () => void;
    productName: string;
    categories: string[];
}

const GUIDES = [
    { id: 'kids', name: 'Saprix Kids', keywords: ['kids', 'niño', 'niña', 'infantil'], image: '/size-guide-kids.jpg' },
    { id: 'londres', name: 'Referencia Londres', keywords: ['londres'], image: '/size-guide-londres.jpg' },
    { id: 'roma', name: 'Referencia Roma', keywords: ['roma'], image: '/size-guide-roma.jpg' },
    { id: 'tokio', name: 'Referencia Tokio', keywords: ['tokio'], image: '/size-guide-tokio.jpg' },
];

export default function SizeGuide({ isOpen, onClose, productName, categories }: SizeGuideProps) {
    const [activeGuide, setActiveGuide] = useState(GUIDES[0]);

    useEffect(() => {
        if (isOpen) {
            const searchString = `${productName} ${categories.join(' ')}`.toLowerCase();
            const found = GUIDES.find(g => g.keywords.some(k => searchString.includes(k)));
            if (found) {
                setActiveGuide(found);
            }
        }
    }, [isOpen, productName, categories]);

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/60" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 sm:p-6 md:p-8">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-5xl transform overflow-hidden bg-white text-left align-middle shadow-2xl transition-all">

                                {/* Header */}
                                <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 sm:px-8 py-4 flex items-center justify-between">
                                    <Dialog.Title as="h2" className="text-xl sm:text-2xl font-black uppercase tracking-tight text-black">
                                        TALLAS DE CALZADO ADIDAS PARA HOMBRE Y MUJER
                                    </Dialog.Title>
                                    <button
                                        onClick={onClose}
                                        className="p-2 hover:bg-gray-100 transition-colors rounded-full"
                                        aria-label="Cerrar"
                                    >
                                        <X className="w-5 h-5 text-gray-600" />
                                    </button>
                                </div>

                                {/* Content */}
                                <div className="px-6 sm:px-8 py-6">

                                    {/* Description */}
                                    <p className="text-sm text-gray-700 mb-6 leading-relaxed">
                                        El calzado Unisex se ha diseñado y etiquetado según las tallas para hombre, pero están pensadas para que las use cualquier persona, independientemente de su género. Si normalmente no usás tallas para hombre, tal vez tengas que pedir una talla más pequeña a la que usás habitualmente. Verificá las medidas que aparecen a continuación y la relación en CM, para encontrar tu talla correcta.
                                    </p>

                                    {/* Tabs */}
                                    <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200 pb-1">
                                        {GUIDES.map((guide) => (
                                            <button
                                                key={guide.id}
                                                onClick={() => setActiveGuide(guide)}
                                                className={`px-4 py-2 text-xs sm:text-sm font-bold uppercase tracking-wide transition-all border-b-2 ${activeGuide.id === guide.id
                                                        ? 'border-black text-black'
                                                        : 'border-transparent text-gray-500 hover:text-black hover:border-gray-300'
                                                    }`}
                                            >
                                                {guide.name}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Size Chart Image */}
                                    <div className="relative w-full bg-gray-50 overflow-x-auto">
                                        <div className="min-w-[600px]">
                                            <Image
                                                src={activeGuide.image}
                                                alt={`Guía de tallas ${activeGuide.name}`}
                                                width={1200}
                                                height={600}
                                                className="w-full h-auto"
                                            />
                                        </div>
                                    </div>

                                    {/* Instructions */}
                                    <div className="mt-8 bg-gray-50 p-6 border-l-4 border-black">
                                        <h3 className="font-black text-black uppercase text-sm mb-3">¿Cómo medir tu pie?</h3>
                                        <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                                            <li>Colocá una hoja de papel en el suelo pegada a la pared.</li>
                                            <li>Poné tu pie sobre la hoja con el talón pegado a la pared.</li>
                                            <li>Marcá con un lápiz hasta donde llega tu dedo más largo.</li>
                                            <li>Medí la distancia desde el borde de la hoja hasta la marca.</li>
                                            <li>Buscá la medida en la tabla para encontrar tu talla correcta.</li>
                                        </ol>
                                    </div>

                                </div>

                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
