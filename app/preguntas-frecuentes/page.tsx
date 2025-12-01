export const metadata = {
    title: 'Preguntas Frecuentes - Saprix',
    description: 'Preguntas frecuentes sobre compras, envíos y productos de Saprix',
};

export default function FAQPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 py-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
                    Preguntas Frecuentes
                </h1>

                <div className="space-y-8">
                    {/* Sobre Pedidos */}
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            Sobre Pedidos
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                    ¿Cómo realizo un pedido?
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Selecciona los productos que deseas, agrégalos al carrito, completa tus datos de envío y realiza el pago de forma segura a través de nuestra pasarela de pagos.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                    ¿Puedo modificar mi pedido después de realizarlo?
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Una vez confirmado el pedido, no es posible modificarlo. Si necesitas hacer cambios, contáctanos inmediatamente y haremos lo posible por ayudarte.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                    ¿Cómo puedo rastrear mi pedido?
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Recibirás un correo electrónico con el número de guía una vez que tu pedido sea despachado. Con este número podrás hacer seguimiento en el sitio web de la transportadora.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Sobre Pagos */}
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            Sobre Pagos
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                    ¿Qué métodos de pago aceptan?
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Aceptamos tarjetas de crédito, débito, PSE y otros métodos de pago disponibles a través de nuestra pasarela segura WOMPI.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                    ¿Es seguro comprar en Saprix?
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Sí, totalmente seguro. Utilizamos WOMPI, una pasarela de pagos certificada PCI DSS que garantiza la seguridad de tus datos financieros.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                    ¿Puedo pagar contra entrega?
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Actualmente no ofrecemos pago contra entrega. Todos los pagos deben realizarse en línea al momento de hacer el pedido.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Sobre Envíos */}
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            Sobre Envíos
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                    ¿Cuánto tiempo tarda el envío?
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    El tiempo de entrega es de 3 a 4 días hábiles dependiendo de la ciudad de destino.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                    ¿Cuál es el costo de envío?
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    El costo de envío varía según la ciudad de destino y la transportadora seleccionada. El valor se calculará al momento del checkout.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                    ¿Hacen envíos a todo Colombia?
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Sí, realizamos envíos a todo el territorio nacional colombiano.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Sobre Productos */}
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            Sobre Productos
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                    ¿Cómo sé qué talla elegir?
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Cada producto tiene una guía de tallas disponible. Te recomendamos consultarla antes de realizar tu compra.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                    ¿Los productos son originales?
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Sí, todos nuestros productos son 100% originales y cuentan con garantía del fabricante.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                    ¿Tienen garantía los productos?
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Sí, todos nuestros productos cuentan con garantía. Consulta nuestra política de garantías para más detalles.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Sobre Devoluciones */}
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            Sobre Devoluciones
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                    ¿Puedo devolver un producto?
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Sí, aceptamos devoluciones dentro de los 30 días posteriores a la compra, siempre que el producto esté sin usar y en su empaque original.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                    ¿Cómo inicio una devolución?
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Contáctanos a servicioalcliente@pagos.saprix.com.co con tu número de orden y el motivo de la devolución.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                    ¿Cuánto tarda el reembolso?
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Una vez aprobada la devolución, el reembolso se procesará en 5-10 días hábiles y se reflejará en tu método de pago original.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Contacto */}
                    <div className="bg-saprix-electric-blue/10 dark:bg-saprix-electric-blue/20 rounded-lg p-6 border border-saprix-electric-blue/30">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            ¿No encontraste tu respuesta?
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            Estamos aquí para ayudarte. Contáctanos y resolveremos tus dudas.
                        </p>
                        <p className="text-gray-900 dark:text-white font-semibold">
                            Email: <a href="mailto:servicioalcliente@pagos.saprix.com.co" className="text-saprix-electric-blue hover:underline">servicioalcliente@pagos.saprix.com.co</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
