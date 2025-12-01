"use client";

import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { motion } from 'framer-motion';
import { IoRefresh } from 'react-icons/io5';
import { toast } from 'sonner';
import { X, Plus, Minus, ShieldCheck, ShoppingBag, ArrowRight, Truck, CreditCard } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function CheckoutForm() {
    const { items, cartTotal, removeItem, updateQuantity } = useCart();
    const [isLoading, setIsLoading] = useState(false);
    const [showCustomerForm, setShowCustomerForm] = useState(false);
    const [recommendedProducts, setRecommendedProducts] = useState<any[]>([]);
    const [customerData, setCustomerData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        documentId: '',
        address: '',
        city: '',
        state: '',
        postcode: ''
    });

    // Shipping State
    const [shippingCost, setShippingCost] = useState(0);
    const [shippingMessage, setShippingMessage] = useState('');
    const [shippingZone, setShippingZone] = useState('nacional'); // Default: nacional

    const totalQuantity = items.reduce((acc, item) => acc + item.quantity, 0);

    // Calculate total weight (each item weighs 0.5 kg)
    const totalWeight = totalQuantity * 0.5;

    // Calculate Shipping - Works in both cart and checkout views
    useEffect(() => {
        if (cartTotal > 300000) {
            setShippingCost(0);
            setShippingMessage("Envío Gratis");
        } else {
            setShippingMessage("");

            // Base rates (up to 3 kg)
            const baseRates = {
                bogota: 5000,
                cercanos: 15000,
                nacional: 25000
            };

            // Additional cost per kg after 3 kg
            const additionalRates = {
                bogota: 3000,
                cercanos: 3000,
                nacional: 8000
            };

            let cost = baseRates[shippingZone as keyof typeof baseRates] || baseRates.nacional;

            // If weight exceeds 3 kg, add incremental cost
            if (totalWeight > 3) {
                const extraWeight = totalWeight - 3;
                const extraCost = Math.ceil(extraWeight) * (additionalRates[shippingZone as keyof typeof additionalRates] || additionalRates.nacional);
                cost += extraCost;
                setShippingMessage(`Peso estimado: ${totalWeight.toFixed(1)} kg. Costo puede variar según peso volumétrico.`);
            }

            setShippingCost(cost);
        }
    }, [cartTotal, totalQuantity, shippingZone, totalWeight]);

    const finalTotal = cartTotal + shippingCost;

    useEffect(() => {
        const fetchRecommended = async () => {
            try {
                const res = await fetch('/api/products/recommended');
                if (res.ok) {
                    const data = await res.json();
                    // Filtrar productos que ya están en el carrito
                    const currentIds = new Set(items.map(i => i.id));
                    const filtered = data.products.filter((p: any) => !currentIds.has(p.id)).slice(0, 4);
                    setRecommendedProducts(filtered);
                }
            } catch (error) {
                console.error("Error loading recommended products", error);
            }
        };
        fetchRecommended();
    }, [items]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCustomerData({
            ...customerData,
            [e.target.name]: e.target.value
        });
    };

    const handleQuantityIncrease = (item: any) => {
        updateQuantity(item.id, item.quantity + 1, item.variationId);
    };

    const handleQuantityDecrease = (item: any) => {
        if (item.quantity > 1) {
            updateQuantity(item.id, item.quantity - 1, item.variationId);
        }
    };

    const handleRemoveItem = (item: any) => {
        removeItem(item.id, item.variationId);
        toast.success('Producto eliminado del carrito');
    };

    const [acceptedPolicies, setAcceptedPolicies] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (!customerData.firstName || !customerData.lastName || !customerData.email || !customerData.phone) {
                toast.error('Por favor completa todos los campos obligatorios');
                setIsLoading(false);
                return;
            }

            if (!acceptedPolicies) {
                toast.error('Debes aceptar los términos y condiciones para continuar');
                setIsLoading(false);
                return;
            }

            const response = await fetch('/api/checkout/process-payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    cartItems: items,
                    customer: { ...customerData, shippingZone },
                    cartTotal: finalTotal,
                    shippingCost: shippingCost,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al procesar el pago');
            }

            const data = await response.json();
            toast.success('Orden creada. Redirigiendo a la pasarela de pago...');
            await new Promise(resolve => setTimeout(resolve, 1000));
            window.location.href = data.permalink;

        } catch (error: any) {
            console.error('Error:', error);
            toast.error(error.message || 'Error al procesar el pago. Intenta de nuevo.');
            setIsLoading(false);
        }
    };

    if (items.length === 0) {
        return (
            <div className="text-center py-20 bg-white">
                <ShoppingBag className="w-16 h-16 mx-auto mb-6 text-gray-300" />
                <h2 className="text-3xl font-black uppercase italic text-black mb-4">TU CARRITO ESTÁ VACÍO</h2>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">Parece que aún no has añadido nada. Explora nuestra colección y encuentra tu equipación ideal.</p>
                <Link href="/tienda" className="inline-flex items-center gap-2 bg-black text-white px-8 py-4 font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors group">
                    <span>Ir a la Tienda</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
        );
    }

    if (!showCustomerForm) {
        return (
            <div className="min-h-screen bg-white">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid lg:grid-cols-12 gap-8 lg:gap-16">
                        {/* Products List - Left Side */}
                        <div className="lg:col-span-8">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <div className="flex items-baseline justify-between mb-8 border-b border-black pb-4">
                                    <h2 className="text-3xl font-black uppercase italic text-black">TU CARRITO</h2>
                                    <span className="text-sm font-bold text-gray-500 uppercase">{items.length} ARTÍCULOS</span>
                                </div>

                                <div className="space-y-0 divide-y divide-gray-100">
                                    {items.map((item) => (
                                        <div key={`${item.id}-${item.variationId || 'base'}`} className="py-6 group">
                                            <div className="flex gap-6">
                                                {/* Product Image */}
                                                <div className="flex-shrink-0 relative w-32 h-32 bg-gray-50">
                                                    <Image
                                                        src={item.image}
                                                        alt={item.name}
                                                        fill
                                                        className="object-cover mix-blend-multiply"
                                                    />
                                                </div>

                                                {/* Product Info */}
                                                <div className="flex-1 min-w-0 flex flex-col justify-between">
                                                    <div className="flex justify-between items-start gap-4">
                                                        <div>
                                                            <h3 className="text-lg font-bold text-black uppercase leading-tight mb-2">
                                                                {item.name}
                                                            </h3>
                                                            {item.attributes && Object.keys(item.attributes).length > 0 && (
                                                                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
                                                                    {Object.entries(item.attributes).map(([key, value]) => (
                                                                        <span key={key} className="uppercase">
                                                                            {key}: <span className="font-bold text-black">{value}</span>
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="text-lg font-bold text-black">
                                                                ${(item.price * item.quantity).toLocaleString('es-CO', { maximumFractionDigits: 0 })}
                                                            </div>
                                                            {item.quantity > 1 && (
                                                                <div className="text-xs text-gray-500">
                                                                    ${item.price.toLocaleString('es-CO', { maximumFractionDigits: 0 })} c/u
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center justify-between mt-4">
                                                        {/* Quantity Controls */}
                                                        <div className="flex items-center border border-gray-300 h-10 w-fit">
                                                            <button
                                                                onClick={() => handleQuantityDecrease(item)}
                                                                disabled={item.quantity <= 1}
                                                                className="w-10 h-full flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                            >
                                                                <Minus size={14} />
                                                            </button>
                                                            <span className="w-10 text-center font-bold text-sm">
                                                                {item.quantity}
                                                            </span>
                                                            <button
                                                                onClick={() => handleQuantityIncrease(item)}
                                                                className="w-10 h-full flex items-center justify-center hover:bg-gray-100 transition-colors"
                                                            >
                                                                <Plus size={14} />
                                                            </button>
                                                        </div>

                                                        <button
                                                            onClick={() => handleRemoveItem(item)}
                                                            className="text-xs font-bold uppercase underline hover:text-gray-600 transition-colors"
                                                        >
                                                            Eliminar
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Recommended Products Section */}
                                {recommendedProducts.length > 0 && (
                                    <div className="mt-16 pt-8 border-t border-black">
                                        <h3 className="text-xl font-black uppercase italic text-black mb-6">
                                            COMPLETA TU EQUIPACIÓN
                                        </h3>
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                            {recommendedProducts.map((product) => (
                                                <Link
                                                    key={product.id}
                                                    href={`/producto/${product.slug}`}
                                                    target="_blank"
                                                    className="group block"
                                                >
                                                    <div className="aspect-square bg-gray-50 relative mb-3 overflow-hidden">
                                                        <Image
                                                            src={product.image}
                                                            alt={product.name}
                                                            fill
                                                            className="object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                                                        />
                                                    </div>
                                                    <h4 className="text-xs font-bold text-black uppercase truncate mb-1">
                                                        {product.name}
                                                    </h4>
                                                    <p className="text-xs text-gray-600">
                                                        ${product.price.toLocaleString('es-CO', { maximumFractionDigits: 0 })}
                                                    </p>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </div>

                        {/* Summary - Right Side */}
                        <div className="lg:col-span-4">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="bg-white border border-gray-200 p-6 lg:p-8 sticky top-24"
                            >
                                <h2 className="text-xl font-black uppercase italic text-black mb-6">RESUMEN DEL PEDIDO</h2>

                                <div className="space-y-4 mb-8">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-600 uppercase font-medium">Subtotal</span>
                                        <span className="font-bold text-black">
                                            ${cartTotal.toLocaleString('es-CO', { maximumFractionDigits: 0 })}
                                        </span>
                                    </div>

                                    {/* Shipping Zone Selector */}
                                    <div className="space-y-3 pt-4 border-t border-gray-100">
                                        <label className="block text-xs font-bold uppercase text-black">
                                            Zona de Envío
                                        </label>
                                        <div className="relative">
                                            <select
                                                value={shippingZone}
                                                onChange={(e) => setShippingZone(e.target.value)}
                                                className="w-full px-4 py-3 bg-gray-50 border-b-2 border-gray-200 focus:border-black outline-none text-sm font-medium appearance-none cursor-pointer hover:bg-gray-100 transition-colors"
                                            >
                                                <option value="bogota">Bogotá D.C. - Desde $5.000</option>
                                                <option value="cercanos">Alrededores a Bogotá - Desde $15.000</option>
                                                <option value="nacional">Nacional - Desde $25.000</option>
                                            </select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                                <Truck size={16} />
                                            </div>
                                        </div>

                                        {/* Municipality details */}
                                        {shippingZone === 'cercanos' && (
                                            <p className="text-[10px] text-gray-500 leading-tight bg-gray-50 p-2 border-l-2 border-black">
                                                Incluye: Cajicá, Chía, Funza, Facatativá, La Calera, Mosquera
                                            </p>
                                        )}

                                        <div className="text-xs text-gray-500 pt-1">
                                            {cartTotal > 300000 ? (
                                                <span className="text-green-700 font-bold flex items-center gap-1">
                                                    <ShieldCheck size={12} />
                                                    ENVÍO GRATIS APLICADO
                                                </span>
                                            ) : (
                                                <span>Peso est: {totalWeight.toFixed(1)} kg. Costo final puede variar.</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-start text-sm pt-2">
                                        <span className="text-gray-600 uppercase font-medium">Envío</span>
                                        <div className="text-right">
                                            {shippingMessage === "Envío Gratis" ? (
                                                <span className="font-bold text-green-700 uppercase">Gratis</span>
                                            ) : (
                                                <>
                                                    {shippingCost > 0 && (
                                                        <span className="font-bold text-black block">
                                                            ${shippingCost.toLocaleString('es-CO', { maximumFractionDigits: 0 })}
                                                        </span>
                                                    )}
                                                    {shippingMessage && shippingMessage !== "Envío Gratis" && (
                                                        <span className="text-[10px] text-orange-600 block max-w-[150px] mt-1 leading-tight">
                                                            {shippingMessage}
                                                        </span>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    <div className="border-t-2 border-black pt-4 mt-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-lg font-black uppercase italic text-black">Total</span>
                                            <span className="text-2xl font-black text-black">
                                                ${finalTotal.toLocaleString('es-CO', { maximumFractionDigits: 0 })}
                                            </span>
                                        </div>
                                        <p className="text-[10px] text-gray-500 mt-1 text-right">(IVA incluido)</p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setShowCustomerForm(true)}
                                    className="w-full py-4 bg-black text-white font-bold uppercase tracking-widest hover:bg-gray-800 transition-all duration-300 flex items-center justify-center gap-3 group"
                                >
                                    <span>Continuar al Pago</span>
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>

                                <div className="mt-6 flex items-center justify-center gap-2 text-[10px] text-gray-500 uppercase font-medium tracking-wide">
                                    <ShieldCheck size={14} />
                                    <span>Compra 100% segura</span>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <button
                        onClick={() => setShowCustomerForm(false)}
                        className="text-sm font-bold uppercase underline hover:text-gray-600 transition-colors flex items-center gap-2"
                    >
                        <ArrowRight className="w-4 h-4 rotate-180" />
                        Volver al carrito
                    </button>
                </div>

                <motion.form
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    onSubmit={handleSubmit}
                    className="grid lg:grid-cols-12 gap-8 lg:gap-16"
                >
                    {/* Formulario de Cliente */}
                    <div className="lg:col-span-7">
                        <div className="bg-white">
                            <h3 className="text-2xl font-black uppercase italic text-black mb-8 pb-4 border-b border-black">
                                INFORMACIÓN DE ENVÍO
                            </h3>

                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="block text-xs font-bold uppercase text-gray-700">
                                            Nombre *
                                        </label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={customerData.firstName}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-3 bg-gray-50 border-b-2 border-gray-200 focus:border-black outline-none transition-colors placeholder:text-gray-400"
                                            placeholder="Tu nombre"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-xs font-bold uppercase text-gray-700">
                                            Apellido *
                                        </label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={customerData.lastName}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-3 bg-gray-50 border-b-2 border-gray-200 focus:border-black outline-none transition-colors placeholder:text-gray-400"
                                            placeholder="Tu apellido"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-xs font-bold uppercase text-gray-700">
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={customerData.email}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 bg-gray-50 border-b-2 border-gray-200 focus:border-black outline-none transition-colors placeholder:text-gray-400"
                                        placeholder="ejemplo@correo.com"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-xs font-bold uppercase text-gray-700">
                                        Teléfono *
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={customerData.phone}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 bg-gray-50 border-b-2 border-gray-200 focus:border-black outline-none transition-colors placeholder:text-gray-400"
                                        placeholder="Tu número de celular"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-xs font-bold uppercase text-gray-700">
                                        Cédula / NIT
                                    </label>
                                    <input
                                        type="text"
                                        name="documentId"
                                        value={customerData.documentId}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-gray-50 border-b-2 border-gray-200 focus:border-black outline-none transition-colors placeholder:text-gray-400"
                                        placeholder="Número de documento"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-xs font-bold uppercase text-gray-700">
                                        Dirección de entrega
                                    </label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={customerData.address}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-gray-50 border-b-2 border-gray-200 focus:border-black outline-none transition-colors placeholder:text-gray-400"
                                        placeholder="Calle, Carrera, #, Apto..."
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="block text-xs font-bold uppercase text-gray-700">
                                            Ciudad
                                        </label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={customerData.city}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 bg-gray-50 border-b-2 border-gray-200 focus:border-black outline-none transition-colors placeholder:text-gray-400"
                                            placeholder="Ciudad"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-xs font-bold uppercase text-gray-700">
                                            Departamento
                                        </label>
                                        <input
                                            type="text"
                                            name="state"
                                            value={customerData.state}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 bg-gray-50 border-b-2 border-gray-200 focus:border-black outline-none transition-colors placeholder:text-gray-400"
                                            placeholder="Departamento"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Resumen y Botón de Pago */}
                    <div className="lg:col-span-5">
                        <div className="bg-gray-50 p-8 sticky top-24 border border-gray-100">
                            <h3 className="text-xl font-black uppercase italic text-black mb-6 flex items-center gap-2">
                                <ShoppingBag className="w-5 h-5" />
                                RESUMEN DEL PEDIDO
                            </h3>

                            <div className="space-y-4 mb-8 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                {items.map((item) => (
                                    <div key={`${item.id}-${item.variationId || 'base'}`} className="flex gap-4 py-2 border-b border-gray-200 last:border-0">
                                        <div className="relative w-16 h-16 bg-white flex-shrink-0">
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fill
                                                className="object-cover mix-blend-multiply"
                                            />
                                            <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">
                                                {item.quantity}
                                            </span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-bold text-black uppercase truncate">{item.name}</p>
                                            <p className="text-xs text-gray-500">
                                                ${(item.price * item.quantity).toLocaleString('es-CO', { maximumFractionDigits: 0 })}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Shipping Details */}
                            <div className="space-y-3 py-6 border-t-2 border-black">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600 uppercase font-medium">Subtotal</span>
                                    <span className="font-bold text-black">${cartTotal.toLocaleString('es-CO', { maximumFractionDigits: 0 })}</span>
                                </div>
                                <div className="flex justify-between items-start text-sm">
                                    <span className="text-gray-600 uppercase font-medium">Envío</span>
                                    <div className="text-right">
                                        {shippingMessage === "Envío Gratis" ? (
                                            <span className="font-bold text-green-700 uppercase">Gratis</span>
                                        ) : (
                                            <>
                                                {shippingCost > 0 && (
                                                    <span className="font-bold text-black block">
                                                        ${shippingCost.toLocaleString('es-CO', { maximumFractionDigits: 0 })}
                                                    </span>
                                                )}
                                                {shippingMessage && shippingMessage !== "Envío Gratis" && (
                                                    <span className="text-[10px] text-orange-600 block max-w-[150px] mt-1 leading-tight">
                                                        {shippingMessage}
                                                    </span>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-gray-200 pt-4 mb-8">
                                <div className="flex justify-between items-center">
                                    <span className="text-xl font-black uppercase italic text-black">Total</span>
                                    <span className="text-3xl font-black text-black">
                                        ${finalTotal.toLocaleString('es-CO', { maximumFractionDigits: 0 })}
                                    </span>
                                </div>
                            </div>

                            {/* Términos y Condiciones */}
                            <div className="mb-6">
                                <label className="flex items-start gap-3 cursor-pointer group">
                                    <div className="relative flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={acceptedPolicies}
                                            onChange={(e) => setAcceptedPolicies(e.target.checked)}
                                            className="peer h-5 w-5 cursor-pointer appearance-none border-2 border-gray-300 bg-white transition-all checked:border-black checked:bg-black hover:border-black"
                                        />
                                        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-3.5 w-3.5"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                                stroke="currentColor"
                                                strokeWidth="1"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                    <span className="text-xs text-gray-600 leading-tight pt-0.5">
                                        He leído y acepto los <Link href="/terminos-y-condiciones" target="_blank" className="font-bold text-black underline hover:text-gray-600">términos y condiciones</Link> y la <Link href="/politica-de-privacidad" target="_blank" className="font-bold text-black underline hover:text-gray-600">política de privacidad</Link> de Saprix.
                                    </span>
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-4 bg-black hover:bg-gray-800 text-white font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
                            >
                                {isLoading ? (
                                    <>
                                        <IoRefresh className="animate-spin w-5 h-5" />
                                        <span>Procesando...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>PAGAR AHORA</span>
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>

                            <div className="mt-6 flex items-center justify-center gap-2 text-[10px] text-gray-500 uppercase font-medium tracking-wide">
                                <CreditCard size={14} />
                                <span>Pago seguro con Wompi</span>
                            </div>
                        </div>
                    </div>
                </motion.form >
            </div >
        </div >
    );
}
