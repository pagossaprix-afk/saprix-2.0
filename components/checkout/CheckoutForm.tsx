"use client";

import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { motion } from 'framer-motion';
import { IoRefresh } from 'react-icons/io5';
import { toast } from 'sonner';
import { X, Plus, Minus, ShieldCheck, ShoppingBag, ArrowRight, Truck, CreditCard } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import ProductCard from '@/components/product/ProductCard';

export default function CheckoutForm() {
    const { items, cartTotal, removeItem, updateQuantity } = useCart();
    const [isLoading, setIsLoading] = useState(false);
    const [showCustomerForm, setShowCustomerForm] = useState(false);

    // Updated number as requested
    const WHATSAPP_NUMBER = "573023932008";

    // Function now accepts data to build the full message
    const handleWhatsAppCheckout = (data: typeof customerData) => {
        if (!shippingZone) {
            toast.error("Por favor selecciona una zona de envío");
            return;
        }

        // 1. Calculate Shipping Cost (Mirroring PHP Logic)
        const totalQty = items.reduce((acc, item) => acc + item.quantity, 0);
        let calculatedShipping = 0;

        // Formula: floor((qty - 1) / 2) -> 1-2=0, 3-4=1, 5-6=2
        const incrementFactor = Math.floor((totalQty - 1) / 2);
        const incrementPrice = 5000;

        let shippingLabel = '';

        if (shippingZone === 'bogota') {
            calculatedShipping = 10000 + (incrementFactor * incrementPrice);
            shippingLabel = `Bogotá D.C.: $10.000`; // Removed "- Desde" as requested
        } else if (shippingZone === 'cercanos') { // Alrededores
            calculatedShipping = 15000 + (incrementFactor * incrementPrice);
            shippingLabel = `Alrededores a Bogotá: $15.000`;
        } else if (shippingZone === 'nacional' || shippingZone === 'costa_atlantica') {
            calculatedShipping = 25000 + (incrementFactor * incrementPrice);
            shippingLabel = shippingZone === 'costa_atlantica'
                ? `Costa Atlántica: $25.000 (Requiere Abono)`
                : `Nacional: $25.000`;
        } else if (shippingZone === 'recoger') {
            calculatedShipping = 0;
            shippingLabel = `Recoger en Tienda: Gratis`;
        }

        // 2. Build Message with Customer Data
        const finalTotal = cartTotal + calculatedShipping;
        let message = `*¡Hola! Quiero finalizar mi compra en Saprix.*\n\n`;
        message += `*PEDIDO:*\n`;

        items.forEach(item => {
            const variantInfo = item.attributes && Object.keys(item.attributes).length > 0
                ? ` - ${Object.values(item.attributes).join(' / ')}`
                : '';

            // Generate product link (client-side)
            const productLink = `${window.location.origin}/producto/${item.slug}`;
            // Removed parentheses from product link for WhatsApp preview
            message += `* (${item.quantity}) ${item.name}${variantInfo} ${productLink}\n`;
        });

        message += `\n*ENVÍO:* ${shippingLabel}\n`;
        if (shippingZone === 'costa_atlantica') {
            message += `*CONDICIÓN DE ENVÍO:* ABONO DE $20.000 (Nequi) + Saldo Contraentrega\n`;
        }
        message += `*TOTAL A PAGAR:* $${finalTotal.toLocaleString('es-CO')}\n\n`;

        message += `📋 *DATOS DEL CLIENTE:*\n`;
        message += `Nombre: ${data.firstName} ${data.lastName}\n`;
        message += `Documento: ${data.documentId}\n`;
        message += `Teléfono: ${data.phone}\n`;
        message += `Email: ${data.email}\n`;
        message += `Dirección: ${data.address} ${data.apartment ? `(${data.apartment})` : ''}\n`;
        message += `Ciudad/Depto: ${data.city}, ${data.state}\n\n`;

        if (shippingZone === 'costa_atlantica') {
            message += `*Quedo atento para realizar el abono de $20.000 a Nequi y finalizar mi pedido.*`;
        } else {
            message += `*Quedo atento para proceder con el pago. ¿Me pueden informar por qué medio?*`;
        }

        // 3. Open WhatsApp
        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, '_blank');
    };

    const handleWompiCheckout = () => {
        if (!shippingZone) {
            toast.error("Por favor selecciona una zona de envío");
            return;
        }

        setIsLoading(true);

        try {
            // --- CART HANDOVER LOGIC (WOMPI/DEFAULT) ---
            // Construimos la URL para 'entregar' el carrito a WooCommerce
            const baseUrl = "https://pagos.saprix.com.co/finalizar-compra/";

            // 1. Construir string de items: ID:QTY,ID:QTY
            const itemsString = items.map(item => {
                const idToUse = item.variationId || item.id;
                return `${idToUse}:${item.quantity}`;
            }).join(',');

            // 2. Mapear parámetros básicos (sin datos de cliente, ya que se pedirán en WooCommerce)
            const params = new URLSearchParams();
            params.append('saprix_handover', 'true');
            params.append('items', itemsString);
            params.append('shipping_zone', shippingZone);

            // Redirección
            const handoverUrl = `${baseUrl}?${params.toString()}`;
            console.log("🚀 Redirecting to Handover:", handoverUrl);

            toast.success("Redirigiendo a pasarela de pagos segura...");

            // Pequeño delay para que el usuario vea el toast
            setTimeout(() => {
                window.location.href = handoverUrl;
            }, 1000);

        } catch (error: any) {
            console.error('Error:', error);
            toast.error('Hubo un error al procesar la solicitud.');
            setIsLoading(false);
        }
    };
    const [recommendedProducts, setRecommendedProducts] = useState<any[]>([]);
    const [customerData, setCustomerData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        documentId: '',
        address: '',
        apartment: '',
        city: '',
        state: '',
        postcode: ''
    });

    // Billing State
    const [sameAsShipping, setSameAsShipping] = useState(true);
    const [billingAddress, setBillingAddress] = useState({
        firstName: '',
        lastName: '',
        address: '',
        apartment: '',
        city: '',
        state: '',
        postcode: '',
        phone: ''
    });

    // Shipping State
    const [shippingCost, setShippingCost] = useState(0);
    const [shippingMessage, setShippingMessage] = useState('');
    const [shippingZone, setShippingZone] = useState(''); // Default: empty to force selection

    // Payment Method State
    const [paymentMethod, setPaymentMethod] = useState<'wompi' | 'addi' | 'whatsapp'>('wompi');

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
                recoger: 0,
                bogota: 10000,
                cercanos: 15000,
                nacional: 25000,
                costa_atlantica: 25000
            };

            // Additional cost per kg after 3 kg
            const additionalRates = {
                recoger: 0,
                bogota: 3000,
                cercanos: 3000,
                nacional: 8000,
                costa_atlantica: 8000
            };

            let cost = baseRates[shippingZone as keyof typeof baseRates] ?? baseRates.nacional;

            // If weight exceeds 3 kg, add incremental cost
            if (totalWeight > 3) {
                const extraWeight = totalWeight - 3;
                const extraCost = Math.ceil(extraWeight) * (additionalRates[shippingZone as keyof typeof additionalRates] ?? additionalRates.nacional);
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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setCustomerData({
            ...customerData,
            [e.target.name]: e.target.value
        });
    };

    const handleBillingInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setBillingAddress({
            ...billingAddress,
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
            if (!customerData.firstName || !customerData.lastName || !customerData.email || !customerData.phone || !customerData.documentId || !customerData.address || !customerData.city || !customerData.state) {
                toast.error('Por favor completa todos los campos obligatorios');
                setIsLoading(false);
                return;
            }

            if (!acceptedPolicies) {
                toast.error('Debes aceptar los términos y condiciones para continuar');
                setIsLoading(false);
                return;
            }

            // --- WHATSAPP FLOW ---
            if (paymentMethod === 'whatsapp') {
                handleWhatsAppCheckout(customerData);
                setIsLoading(false);
                return;
            }

            // --- CART HANDOVER LOGIC (WOMPI/DEFAULT) ---
            // Construimos la URL para 'entregar' el carrito a WooCommerce
            const baseUrl = "https://pagos.saprix.com.co/finalizar-compra/";

            // 1. Construir string de items: ID:QTY,ID:QTY
            // Si tiene variationId, usamos ese preferiblemente (WooCommerce maneja IDs de variación directamente en add_to_cart usualmente)
            const itemsString = items.map(item => {
                const idToUse = item.variationId || item.id;
                return `${idToUse}:${item.quantity}`;
            }).join(',');

            // 2. Mapear datos del cliente a params de URL de WooCommerce
            const params = new URLSearchParams();
            params.append('saprix_handover', 'true');
            params.append('items', itemsString);
            if (shippingZone) {
                params.append('shipping_zone', shippingZone);
            }

            // Billing / Customer Fields
            params.append('billing_first_name', customerData.firstName);
            params.append('billing_last_name', customerData.lastName);
            params.append('billing_email', customerData.email);
            params.append('billing_phone', customerData.phone);
            params.append('billing_address_1', customerData.address);
            params.append('billing_address_2', customerData.apartment || '');
            params.append('billing_city', customerData.city);
            params.append('billing_state', customerData.state);
            params.append('billing_postcode', customerData.postcode || '');
            params.append('billing_country', 'CO'); // Default

            // Cedula (Mapeada en el snippet PHP a billing_cedula / billing_dni)
            params.append('documentId', customerData.documentId);

            // Redirección
            const handoverUrl = `${baseUrl}?${params.toString()}`;
            console.log("🚀 Redirecting to Handover:", handoverUrl);

            toast.success("Redirigiendo a pasarela de pagos segura...");

            // Pequeño delay para que el usuario vea el toast
            setTimeout(() => {
                window.location.href = handoverUrl;
            }, 1000);

        } catch (error: any) {
            console.error('Error:', error);
            toast.error('Hubo un error al procesar la solicitud.');
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
                                                <ProductCard
                                                    key={product.id}
                                                    id={product.id}
                                                    name={product.name}
                                                    price={product.price.toString()}
                                                    imageUrl={product.image}
                                                    slug={product.slug}
                                                    images={product.images || [product.image]}
                                                    type={product.type || 'simple'}
                                                />
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
                                                className={`w-full px-4 py-3 bg-gray-50 border-b-2 outline-none text-sm font-medium appearance-none cursor-pointer hover:bg-gray-100 transition-colors ${!shippingZone ? 'border-red-500 text-gray-500' : 'border-gray-200 focus:border-black'}`}
                                            >
                                                <option value="" disabled>-- Selecciona una opción --</option>
                                                <option value="recoger">Recoger en Tienda - Gratis</option>
                                                <option value="bogota">Bogotá D.C. - Desde $10.000</option>
                                                <option value="cercanos">Alrededores a Bogotá - Desde $15.000</option>
                                                <option value="nacional">Nacional (Excepto Costa) - Desde $25.000</option>
                                                <option value="costa_atlantica">Costa Atlántica ($25.000) - Requiere Abono</option>
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

                                        {shippingZone === 'costa_atlantica' && (
                                            <div className="bg-blue-50 p-2 border-l-2 border-blue-600 space-y-1">
                                                <p className="text-[10px] font-bold text-blue-900 leading-tight uppercase">
                                                    CONDICIÓN DE ENVÍO: ADELANTO DE $20.000
                                                </p>
                                                <p className="text-[10px] text-blue-800 leading-tight">
                                                    El envío vale <strong>$25.000</strong>. Para despachar con <strong>Pago Contraentrega</strong>, debes abonar <strong>$20.000</strong> por Nequi anticipadamente.
                                                </p>
                                                <p className="text-[10px] text-gray-500 leading-tight pt-1 border-t border-blue-200">
                                                    <strong>Incluye:</strong> Atlántico, Magdalena, Guajira, Bolívar.
                                                </p>
                                            </div>
                                        )}

                                        {shippingZone && shippingZone !== 'recoger' && (
                                            <div className="bg-orange-50 border-l-2 border-orange-500 p-2">
                                                <p className="text-[10px] text-orange-800 leading-tight">
                                                    <strong>¡Importante!</strong> Si la ciudad de entrega no coincide con la zona seleccionada, el pedido no será despachado.
                                                </p>
                                            </div>
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
                                        <span className="text-gray-600 uppercase font-medium">
                                            Envío {shippingZone === 'bogota' ? ': Bogotá D.C.' :
                                                shippingZone === 'cercanos' ? ': Alrededores a Bogotá' :
                                                    shippingZone === 'costa_atlantica' ? ': Costa Atlántica' :
                                                        shippingZone === 'nacional' ? ': Nacional' :
                                                            shippingZone === 'recoger' ? ': Recoger en Tienda' : ''}
                                        </span>
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

                                    <div className="border-t-2 border-black pt-4 mt-4 mb-6">
                                        <div className="flex justify-between items-center">
                                            <span className="text-lg font-black uppercase italic text-black">Total</span>

                                            <span className="text-2xl font-black text-black">
                                                ${finalTotal.toLocaleString('es-CO', { maximumFractionDigits: 0 })}
                                            </span>
                                        </div>
                                        <p className="text-[10px] text-gray-500 mt-1 text-right">(IVA incluido)</p>
                                    </div>
                                </div>


                                {/* Banners de Pago */}
                                {/* Banners de Pago */}
                                <div className="grid grid-cols-2 gap-4 items-center mb-8 pt-4 border-t border-gray-100">
                                    <div className="flex justify-center border-r border-gray-100">
                                        <Image
                                            src="/Pagos-seguros-Wompi-Horizontal.png"
                                            alt="Pagos Seguros Wompi"
                                            width={150}
                                            height={40}
                                            className="object-contain"
                                        />
                                    </div>
                                    <div className="flex flex-col items-center gap-1">
                                        <Image
                                            src="/Pagos con Addi.webp"
                                            alt="Pagos Seguros Addi"
                                            width={150}
                                            height={40}
                                            className="object-contain"
                                        />
                                        <p className="text-[10px] font-medium text-gray-500 text-center leading-tight">
                                            Puedes pagar también con <strong>Addi</strong>
                                        </p>
                                    </div>
                                </div>

                                {/* Botón Continuar (Va al Formulario) */}
                                {/* Botones de Acción (Direct Cart Handover) */}
                                <div className="space-y-4">
                                    {/* Wompi Button - Hidden for Costa Atlántica */}
                                    {shippingZone !== 'costa_atlantica' ? (
                                        <button
                                            type="button"
                                            id="btn-pay-now-wompi"
                                            disabled={!shippingZone}
                                            onClick={() => {
                                                if (!shippingZone) return;
                                                handleWompiCheckout();
                                            }}
                                            className="w-full py-4 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-all duration-300 flex items-center justify-center gap-3 group shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-black"
                                        >
                                            <span>Pagar ahora: Nequi, Tarjetas, PSE o Addi</span>
                                        </button>
                                    ) : (
                                        <div className="p-4 bg-orange-50 border border-orange-200 rounded text-sm text-orange-800 text-center">
                                            <p className="font-bold">⚠️ Para envíos a la Costa Atlántica</p>
                                            <p className="text-xs mt-1">Por motivos de validación de seguridad, los pedidos para tu zona se procesan exclusivamente vía WhatsApp.</p>
                                        </div>
                                    )}

                                    {/* WhatsApp Button (Active) */}
                                    <button
                                        type="button"
                                        disabled={!shippingZone}
                                        onClick={() => {
                                            if (!shippingZone) return;
                                            setPaymentMethod('whatsapp');
                                            setShowCustomerForm(true);
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                        }}
                                        className="w-full py-4 bg-[#25D366] text-white text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-3 shadow-md hover:bg-[#20bd5a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#25D366]"
                                    >
                                        <span>Pagar ahora por WhatsApp</span>
                                    </button>
                                </div>

                                <div className="mt-6 flex items-center justify-center gap-2 text-[10px] text-gray-500 uppercase font-medium tracking-wide">
                                    <ShieldCheck size={14} />
                                    <span>Compra 100% segura</span>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div >
            </div >
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
                    id="checkout-form"
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
                                {/* Country Field - Read Only */}
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold uppercase text-gray-700">
                                        País / Región
                                    </label>
                                    <div className="w-full px-4 py-3 bg-gray-100 border-b-2 border-gray-200 text-gray-600 cursor-not-allowed">
                                        Colombia
                                    </div>
                                </div>
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
                                        Cédula / NIT *
                                    </label>
                                    <input
                                        type="text"
                                        name="documentId"
                                        value={customerData.documentId}
                                        onChange={handleInputChange}
                                        required
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
                                        required
                                        className="w-full px-4 py-3 bg-gray-50 border-b-2 border-gray-200 focus:border-black outline-none transition-colors placeholder:text-gray-400"
                                        placeholder="Calle, Carrera, #, Apto..."
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-xs font-bold uppercase text-gray-700">
                                        Apartamento, habitación, etc. (opcional)
                                    </label>
                                    <input
                                        type="text"
                                        name="apartment"
                                        value={customerData.apartment}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-gray-50 border-b-2 border-gray-200 focus:border-black outline-none transition-colors placeholder:text-gray-400"
                                        placeholder="Apartamento, unidad, etc."
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
                                            required
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
                                            required
                                            className="w-full px-4 py-3 bg-gray-50 border-b-2 border-gray-200 focus:border-black outline-none transition-colors placeholder:text-gray-400"
                                            placeholder="Departamento"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-xs font-bold uppercase text-gray-700">
                                        Código postal (opcional)
                                    </label>
                                    <input
                                        type="text"
                                        name="postcode"
                                        value={customerData.postcode}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-gray-50 border-b-2 border-gray-200 focus:border-black outline-none transition-colors placeholder:text-gray-400"
                                        placeholder="Código postal"
                                    />
                                </div>

                                {/* Billing Address Toggle */}
                                <div className="pt-6 border-t border-gray-100">
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <div className="relative flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={sameAsShipping}
                                                onChange={(e) => setSameAsShipping(e.target.checked)}
                                                className="peer h-5 w-5 cursor-pointer appearance-none border-2 border-gray-300 bg-white transition-all checked:border-black checked:bg-black hover:border-black"
                                            />
                                            <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                        </div>
                                        <span className="text-sm font-medium text-gray-700">Usar la misma dirección para facturación</span>
                                    </label>
                                </div>

                                {/* Billing Address Form */}
                                {!sameAsShipping && (
                                    <div className="space-y-6 pt-6 animate-in fade-in slide-in-from-top-4 duration-300">
                                        <h3 className="text-lg font-black uppercase italic text-black border-b border-gray-200 pb-2">
                                            Dirección de Facturación
                                        </h3>

                                        <div className="space-y-2">
                                            <label className="block text-xs font-bold uppercase text-gray-700">País / Región</label>
                                            <div className="w-full px-4 py-3 bg-gray-100 border-b-2 border-gray-200 text-gray-600 cursor-not-allowed">Colombia</div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="block text-xs font-bold uppercase text-gray-700">Nombre *</label>
                                                <input
                                                    type="text"
                                                    name="firstName"
                                                    value={billingAddress.firstName}
                                                    onChange={handleBillingInputChange}
                                                    required={!sameAsShipping}
                                                    className="w-full px-4 py-3 bg-gray-50 border-b-2 border-gray-200 focus:border-black outline-none transition-colors placeholder:text-gray-400"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="block text-xs font-bold uppercase text-gray-700">Apellido *</label>
                                                <input
                                                    type="text"
                                                    name="lastName"
                                                    value={billingAddress.lastName}
                                                    onChange={handleBillingInputChange}
                                                    required={!sameAsShipping}
                                                    className="w-full px-4 py-3 bg-gray-50 border-b-2 border-gray-200 focus:border-black outline-none transition-colors placeholder:text-gray-400"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block text-xs font-bold uppercase text-gray-700">Dirección *</label>
                                            <input
                                                type="text"
                                                name="address"
                                                value={billingAddress.address}
                                                onChange={handleBillingInputChange}
                                                required={!sameAsShipping}
                                                className="w-full px-4 py-3 bg-gray-50 border-b-2 border-gray-200 focus:border-black outline-none transition-colors placeholder:text-gray-400"
                                                placeholder="Calle, Carrera, #, Apto..."
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block text-xs font-bold uppercase text-gray-700">Apartamento, habitación, etc. (opcional)</label>
                                            <input
                                                type="text"
                                                name="apartment"
                                                value={billingAddress.apartment}
                                                onChange={handleBillingInputChange}
                                                className="w-full px-4 py-3 bg-gray-50 border-b-2 border-gray-200 focus:border-black outline-none transition-colors placeholder:text-gray-400"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="block text-xs font-bold uppercase text-gray-700">Ciudad *</label>
                                                <input
                                                    type="text"
                                                    name="city"
                                                    value={billingAddress.city}
                                                    onChange={handleBillingInputChange}
                                                    required={!sameAsShipping}
                                                    className="w-full px-4 py-3 bg-gray-50 border-b-2 border-gray-200 focus:border-black outline-none transition-colors placeholder:text-gray-400"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="block text-xs font-bold uppercase text-gray-700">Departamento *</label>
                                                <input
                                                    type="text"
                                                    name="state"
                                                    value={billingAddress.state}
                                                    onChange={handleBillingInputChange}
                                                    required={!sameAsShipping}
                                                    className="w-full px-4 py-3 bg-gray-50 border-b-2 border-gray-200 focus:border-black outline-none transition-colors placeholder:text-gray-400"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="block text-xs font-bold uppercase text-gray-700">Código postal (opcional)</label>
                                                <input
                                                    type="text"
                                                    name="postcode"
                                                    value={billingAddress.postcode}
                                                    onChange={handleBillingInputChange}
                                                    className="w-full px-4 py-3 bg-gray-50 border-b-2 border-gray-200 focus:border-black outline-none transition-colors placeholder:text-gray-400"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="block text-xs font-bold uppercase text-gray-700">Teléfono *</label>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={billingAddress.phone}
                                                    onChange={handleBillingInputChange}
                                                    required={!sameAsShipping}
                                                    className="w-full px-4 py-3 bg-gray-50 border-b-2 border-gray-200 focus:border-black outline-none transition-colors placeholder:text-gray-400"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
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
                                    <span className="text-gray-600 uppercase font-medium">
                                        Envío {shippingZone === 'bogota' ? ': Bogotá D.C.' :
                                            shippingZone === 'cercanos' ? ': Alrededores a Bogotá' :
                                                shippingZone === 'costa_atlantica' ? ': Costa Atlántica' :
                                                    shippingZone === 'nacional' ? ': Nacional' :
                                                        shippingZone === 'recoger' ? ': Recoger en Tienda' : ''}
                                    </span>
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

                            {/* Nota sobre redirección */}
                            <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 text-sm text-blue-800">
                                <p className="font-bold">Siguiente paso:</p>
                                <p>Serás redirigido a nuestra pasarela de pagos segura para completar tu compra con <strong>Addi, Wompi o Transferencia</strong>.</p>
                            </div>

                            <button
                                type="submit"
                                form="checkout-form"
                                id={paymentMethod === 'whatsapp' ? 'btn-finish-order-whatsapp' : 'btn-finish-order-wompi'}
                                disabled={isLoading}
                                className={`w-full py-4 ${paymentMethod === 'whatsapp' ? 'bg-[#25D366] hover:bg-[#20bd5a]' : 'bg-black hover:bg-gray-800'} text-white font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group shadow-lg`}
                            >
                                {isLoading ? (
                                    <>
                                        <IoRefresh className="animate-spin w-5 h-5" />
                                        <span>Procesando...</span>
                                    </>
                                ) : (
                                    <>
                                        {paymentMethod === 'whatsapp' ? (
                                            <>
                                                <span>Finalizar Pedido en WhatsApp</span>
                                                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.372 2.905 5.521 7.189 7.111.409.136.73.238 1.002.324.77.243 1.426.243 1.945.149.574-.104 1.758-.718 2.006-1.411.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                                </svg>
                                            </>
                                        ) : (
                                            <>
                                                <span>Continuar al Pago Seguro</span>
                                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                            </>
                                        )}
                                    </>
                                )}
                            </button>

                            {/* Payment Method Info Message */}
                            {paymentMethod === 'whatsapp' && (
                                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded text-sm text-green-800 text-center">
                                    <p className="font-medium">Estás eligiendo pagar vía WhatsApp.</p>
                                    <p className="text-xs mt-1">Al hacer clic, se abrirá un chat con nuestro equipo para finalizar tu compra.</p>
                                </div>
                            )}

                            {/* "Próximamente" button removed as functionality is active via top button flow */}

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
