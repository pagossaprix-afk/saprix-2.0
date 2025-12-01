import { NextResponse } from 'next/server';

// Configuración de WooCommerce
const WOO_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || "https://pagos.saprix.com.co";
const CK = process.env.WOOCOMMERCE_CONSUMER_KEY || "ck_88721898d82f29e0f8664d7e3316aa460340f587";
const CS = process.env.WOOCOMMERCE_CONSUMER_SECRET || "cs_37ebd5161dd1ed62e199570e702fb7d123454569";

// Configuración de Wompi
const WOMPI_PUBLIC_KEY = process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY || "pub_test_your_key_here";
const WOMPI_PRIVATE_KEY = process.env.WOMPI_PRIVATE_KEY || "prv_test_your_key_here";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { customer, cartItems, cartTotal } = body;

        if (!customer || !cartItems || cartItems.length === 0) {
            return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 });
        }

        // 1. CREAR ORDEN EN WOOCOMMERCE
        const line_items = cartItems.map((item: any) => ({
            product_id: item.id,
            variation_id: item.variationId || undefined,
            quantity: item.quantity,
        }));

        const orderData = {
            payment_method: 'wompi',
            payment_method_title: 'Pago con Wompi',
            set_paid: false,
            billing: {
                first_name: customer.firstName,
                last_name: customer.lastName,
                address_1: customer.address,
                city: customer.city,
                state: customer.state,
                postcode: customer.postcode,
                country: 'CO',
                email: customer.email,
                phone: customer.phone,
            },
            shipping: {
                first_name: customer.firstName,
                last_name: customer.lastName,
                address_1: customer.address,
                city: customer.city,
                state: customer.state,
                postcode: customer.postcode,
                country: 'CO',
            },
            line_items: line_items,
            meta_data: [
                {
                    key: '_billing_cedula',
                    value: customer.documentId
                }
            ]
        };

        // Crear orden en WooCommerce
        const wooResponse = await fetch(`${WOO_URL}/wp-json/wc/v3/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + Buffer.from(`${CK}:${CS}`).toString('base64'),
            },
            body: JSON.stringify(orderData),
        });

        const wooOrder = await wooResponse.json();

        if (!wooResponse.ok) {
            console.error('WooCommerce Error:', wooOrder);
            throw new Error(wooOrder.message || 'Error al crear la orden en WooCommerce');
        }

        const orderId = wooOrder.id;
        const orderKey = wooOrder.order_key;

        // 2. INTENTAR CREAR TRANSACCIÓN EN WOMPI (OPCIONAL - CON FALLBACK)
        // Si Wompi no está configurado o falla, redirigir a WooCommerce checkout

        try {
            // Solo intentar Wompi si las llaves están configuradas correctamente
            if (WOMPI_PUBLIC_KEY && !WOMPI_PUBLIC_KEY.includes('test_your_key')) {
                const amountInCents = Math.round(cartTotal * 100);
                const reference = `SAPRIX-${orderId}`;

                // Usamos el endpoint de Payment Links que es el correcto para generar una URL de pago
                const wompiPayload = {
                    name: `Orden Saprix #${orderId}`,
                    description: `Pago de orden #${orderId} en Saprix`,
                    single_use: true,
                    collect_shipping: false, // Ya recolectamos la info de envío
                    currency: "COP",
                    amount_in_cents: amountInCents,
                    redirect_url: `${SITE_URL}/orden-confirmada?order_id=${orderId}`,
                    sku: `ORD-${orderId}`
                };

                const wompiResponse = await fetch('https://production.wompi.co/v1/payment_links', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${WOMPI_PUBLIC_KEY}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(wompiPayload),
                });

                if (wompiResponse.ok) {
                    const wompiData = await wompiResponse.json();
                    // El endpoint de payment_links devuelve 'permalink' en data.permalink
                    const permalink = wompiData.data?.permalink;

                    if (permalink) {
                        // Concatenamos los datos del cliente a la URL para pre-llenar (si Wompi lo soporta en el link)
                        // O simplemente devolvemos el link limpio
                        return NextResponse.json({
                            success: true,
                            permalink: `${permalink}?customer_email=${customer.email}`,
                            orderId,
                            reference,
                            provider: 'wompi'
                        });
                    }
                } else {
                    const errorData = await wompiResponse.json();
                    console.error('Wompi API Error:', errorData);
                }
            }
        } catch (wompiError) {
            console.log('Wompi no disponible, usando checkout de WooCommerce:', wompiError);
        }

        // 3. FALLBACK MEJORADO: REDIRIGIR A "ORDER PAY" (PAGAR ORDEN)
        // En lugar de enviar al carrito, enviamos a la página de pago de la orden específica.
        // Como la orden YA fue creada con todos los datos del cliente (líneas 29-60),
        // WooCommerce NO pedirá llenar los datos de nuevo, solo pedirá el pago.

        // La URL estándar es /checkout/order-pay/ID/?pay_for_order=true&key=ORDER_KEY
        // Si tu página de checkout tiene otro slug (ej: /finalizar-compra/), se ajustará automáticamente si WOO_URL es correcto.

        const orderPayUrl = `${WOO_URL}/checkout/order-pay/${orderId}/?pay_for_order=true&key=${orderKey}`;

        return NextResponse.json({
            success: true,
            permalink: orderPayUrl,
            orderId,
            provider: 'woocommerce_order_pay'
        });

    } catch (error: any) {
        console.error('Error en proceso de pago:', error);
        return NextResponse.json(
            { error: error.message || 'Error al procesar el pago' },
            { status: 500 }
        );
    }
}
