<?php

/**
 * 1. Forzar envío a la dirección de facturación
 * Esto desactiva la opción "¿Enviar a una dirección diferente?" y oculta los campos de envío redundantes.
 */
add_filter('woocommerce_cart_needs_shipping_address', '__return_false');

/**
 * 2. Estilos CSS Personalizados para mejorar la apariencia del Checkout
 * - Layout Responsive: 1 columna en móvil, 2 columnas en desktop.
 * - Estilos modernos para inputs.
 * - Oculta elementos innecesarios.
 */
add_action('wp_head', 'saprix_checkout_styles');

function saprix_checkout_styles()
{
    if (is_checkout() && !is_wc_endpoint_url('order-received')) {
        ?>
        <style>
            /* --- LAYOUT GENERAL Y RESPONSIVE --- */

            /* Contenedor principal */
            .woocommerce-checkout {
                max-width: 1200px;
                /* Más ancho para permitir 2 columnas cómodas */
                margin: 0 auto !important;
                background: #fff;
                padding: 2rem;
                border-radius: 8px;
            }

            /* Por defecto (Mobile/Tablet): 1 Columna */
            form.woocommerce-checkout {
                display: flex;
                flex-direction: column;
                gap: 2rem;
            }

            /* Desktop (Pantallas grandes): 2 Columnas */
            @media (min-width: 1024px) {
                form.woocommerce-checkout {
                    display: grid;
                    grid-template-columns: 1.2fr 0.8fr;
                    /* 60% Detalles - 40% Pedido */
                    gap: 3rem;
                    align-items: start;
                    /* Alinear al inicio */
                }

                /* Columna Izquierda: Detalles del Cliente */
                #customer_details {
                    width: 100% !important;
                    float: none !important;
                    margin: 0 !important;
                    grid-column: 1;
                    grid-row: 1 / span 2;
                    /* Ocupar todo el alto necesario */
                }

                /* Columna Derecha: Título "Tu Pedido" y Tabla de Review */
                #order_review_heading {
                    grid-column: 2;
                    margin-top: 0 !important;
                    /* Quitar margen superior extra en desktop */
                }

                #order_review {
                    grid-column: 2;
                    width: 100% !important;
                    float: none !important;
                }
            }

            /* --- COLUMNAS INTERNAS (WooCommerce Legacy) --- */
            /* Forzar que "Col-1" y "Col-2" dentro de customer_details sean full width 
                       (Ya eliminamos "Enviar a otra dirección", así que esto solo estiliza nombre/apellido etc si estuvieran en columnas) */
            .col2-set {
                width: 100% !important;
                float: none !important;
                display: block;
            }

            .col2-set .col-1,
            .col2-set .col-2 {
                width: 100% !important;
                float: none !important;
                padding: 0 !important;
                max-width: 100% !important;
            }

            /* --- ESTILOS VISUALES (Headless Look) --- */

            /* Títulos */
            .woocommerce-billing-fields h3,
            #order_review_heading {
                font-size: 1.5rem;
                font-weight: 800;
                text-transform: uppercase;
                margin-bottom: 1.5rem;
                border-bottom: 2px solid #000;
                padding-bottom: 0.5rem;
                font-style: italic;
                color: #000;
            }

            /* Inputs y Labels */
            .woocommerce-billing-fields label {
                font-size: 0.75rem;
                font-weight: 700;
                text-transform: uppercase;
                color: #374151;
                margin-bottom: 0.25rem;
                display: block;
            }

            .woocommerce input.input-text,
            .woocommerce select {
                padding: 12px 16px !important;
                border: 1px solid #e5e7eb !important;
                border-radius: 0 !important;
                border-bottom-width: 2px !important;
                background-color: #f9fafb !important;
                font-size: 0.95rem !important;
                line-height: 1.5 !important;
                width: 100%;
                box-sizing: border-box;
                margin-bottom: 1rem;
            }

            .woocommerce input.input-text:focus,
            .woocommerce select:focus {
                border-color: #000 !important;
                background-color: #fff !important;
                outline: none !important;
            }

            /* --- SECCIÓN TU PEDIDO (Sticky en Desktop opcional) --- */
            #order_review {
                background: #f9f9f9;
                padding: 2rem;
                border: 1px solid #eee;
            }

            /* Tabla de productos limpia */
            table.shop_table {
                border: none !important;
                width: 100%;
            }

            table.shop_table th {
                display: none;
            }

            /* Ocultar el thead */

            table.shop_table td {
                border-top: none !important;
                border-bottom: 1px solid #e5e7eb !important;
                padding: 1rem 0 !important;
            }

            tr.cart_item td.product-name {
                font-weight: 600;
                color: #111;
            }

            tr.cart_item .product-quantity {
                font-weight: normal;
                color: #6b7280;
                font-size: 0.9em;
            }

            /* Totales */
            table.shop_table tfoot th,
            table.shop_table tfoot td {
                padding: 1rem 0 !important;
                border-bottom: 1px solid #e5e7eb;
            }

            tr.order-total th,
            tr.order-total td {
                border-top: 2px solid #000 !important;
                border-bottom: none !important;
                font-size: 1.25rem;
                font-weight: 800;
                color: #000;
                padding-top: 1.5rem !important;
            }

            /* Botón Pagar */
            #place_order {
                background-color: #000 !important;
                color: #fff !important;
                font-weight: 800 !important;
                text-transform: uppercase !important;
                padding: 1rem 2rem !important;
                font-size: 1rem !important;
                width: 100%;
                border-radius: 0;
                margin-top: 1.5rem;
            }

            #place_order:hover {
                background-color: #222 !important;
            }

            /* Ocultar campos adicionales innecesarios */
            .woocommerce-additional-fields h3 {
                display: none;
            }
        </style>
        <?php
    }
}
