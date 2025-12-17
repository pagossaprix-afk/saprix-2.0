<?php
/**
 * Title: Saprix Headless Handover Helper
 * Description: Allows populating the WooCommerce Cart and Checkout fields via URL parameters for a seamless Headless -> WordPress transition.
 * Usage: https://your-site.com/checkout/?saprix_handover=true&items=123:1,456:2&billing_first_name=Juan...
 */

// 1. Intercept the request to populate the Cart
add_action('template_redirect', 'saprix_handle_cart_handover');

function saprix_handle_cart_handover()
{
    // Only run if our flag is present
    if (!isset($_GET['saprix_handover'])) {
        return;
    }

    // Ensure WooCommerce is loaded
    if (!function_exists('WC')) {
        return;
    }

    // A. Empty the current cart to avoid duplicates
    WC()->cart->empty_cart();

    // B. Parse Items from URL (Format: id:qty,id:qty)
    if (isset($_GET['items'])) {
        $items = explode(',', sanitize_text_field($_GET['items']));

        foreach ($items as $itemStr) {
            $parts = explode(':', $itemStr);
            if (count($parts) === 2) {
                $product_id = intval($parts[0]);
                $quantity = intval($parts[1]);

                if ($product_id > 0 && $quantity > 0) {
                     // Verificación robusta: ¿Es producto simple o variación?
                    $product = wc_get_product($product_id);

                    if ($product) {
                        if ($product->is_type('variation')) {
                            // Es una variación: Necesitamos el ID del padre
                            $parentId = $product->get_parent_id();
                            WC()->cart->add_to_cart($parentId, $quantity, $product_id);
                        } else {
                            // Es un producto simple
                            WC()->cart->add_to_cart($product_id, $quantity);
                        }
                    }
                }
            }
        }

    // Note: We don't redirect here, we let the page continue to load the Checkout
    // The query params remain in the URL so step 2 can read them.
}

// 2. Pre-fill Checkout Fields from URL parameters
add_filter('woocommerce_checkout_get_value', 'saprix_prefill_checkout_fields', 10, 2);

function saprix_prefill_checkout_fields($value, $input)
{
    // Only if we are in our handover mode
    if (!isset($_GET['saprix_handover'])) {
        return $value;
    }

    // If WordPress already has a value (e.g. logged in user), prefer that unless empty
    if (!empty($value)) {
        return $value;
    }

    // Map URL params to fields. 
    // Example: ?billing_first_name=Juan maps to $input 'billing_first_name'
    if (isset($_GET[$input])) {
        return sanitize_text_field($_GET[$input]);
    }

    // Special handling for Cedula variations
    $cedula_keys = array('billing_cedula', 'cedula', 'billing_dni', 'dni', 'billing_identification');
    if (in_array($input, $cedula_keys)) {
        // Try to find ANY cedula param in the URL
        if (isset($_GET['billing_cedula']))
            return sanitize_text_field($_GET['billing_cedula']);
        if (isset($_GET['cedula']))
            return sanitize_text_field($_GET['cedula']);
        if (isset($_GET['documentId']))
            return sanitize_text_field($_GET['documentId']);
    }


// 4. Lógica de costo de envío personalizado (Peso por pares)
// Fórmula: Base + (Incremento * floor(Cantidad / 2))
// Ejemplo Nacional: 25.000 + (5.000 * floor(6/2)) = 25.000 + 15.000 = 40.000
add_filter('woocommerce_package_rates', 'saprix_custom_shipping_cost', 10, 2);

function saprix_custom_shipping_cost($rates, $package)
{
    // Contar total de items en el carrito
    $total_qty = WC()->cart->get_cart_contents_count();
    
    // Incremento por cada 2 items adicionales
    // 1-2 items: 0 incrementos
    // 3-4 items: 1 incremento
    // 5-6 items: 2 incrementos
    $increment_factor = floor(($total_qty - 1) / 2);

    foreach ($rates as $rate_key => $rate) {
        
        // Lógica para NACIONAL / RESTO DEL PAÍS
        if (stripos($rate->label, 'Nacional') !== false || stripos($rate->label, 'Resto') !== false || stripos($rate->label, 'País') !== false) {
            
            // Costo Base: 25.000 | Incremento: 5.000
            $base_cost = 25000;
            $increment_cost = 5000;
            
            // Cálculo
            $new_cost = $base_cost + ($increment_factor * $increment_cost);
            
            // Aplicar costo
            $rates[$rate_key]->cost = $new_cost;
            
            // Asegurar que los impuestos se recalculen si los hay (aunque normalmente no hay IVA en envío)
            // $rates[$rate_key]->taxes = ...; 
        }

        // Lógica para ALREDEDORES (Si quieres que aplique igual)
        // Asumimos Base 15.000 e incremento 5.000 (puedes ajustar)
        elseif (stripos($rate->label, 'Alrededores') !== false) {
             $base_cost = 15000;
             $increment_cost = 5000;
             
             $new_cost = $base_cost + ($increment_factor * $increment_cost);
             $rates[$rate_key]->cost = $new_cost;
        }

        // Lógica para BOGOTÁ
        // Base 10.000 + Incremento 5.000
        elseif (stripos($rate->label, 'Bogotá') !== false) {
             $base_cost = 10000;
             $increment_cost = 5000;
             
             $new_cost = $base_cost + ($increment_factor * $increment_cost);
             $rates[$rate_key]->cost = $new_cost;
        }
    }

    return $rates;
}
