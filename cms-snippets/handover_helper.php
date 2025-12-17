<?php
/**
 * Title: Saprix Headless Handover Helper - DEBUG VERSION
 * Description: Allows populating the WooCommerce Cart and Checkout fields via URL parameters for a seamless Headless -> WordPress transition.
 * Usage: https://your-site.com/checkout/?saprix_handover=true&items=123:1,456:2&billing_first_name=Juan...
 */

// 1. Intercept the request to populate the Cart
add_action('template_redirect', 'saprix_handle_cart_handover');

function saprix_handle_cart_handover()
{
    // DEBUG: Log that function was called
    error_log('SAPRIX DEBUG: saprix_handle_cart_handover() called');
    error_log('SAPRIX DEBUG: $_GET = ' . print_r($_GET, true));
    
    // Only run if our flag is present
    if (!isset($_GET['saprix_handover'])) {
        error_log('SAPRIX DEBUG: No saprix_handover flag, exiting');
        return;
    }
    
    error_log('SAPRIX DEBUG: saprix_handover flag detected!');

    // Ensure WooCommerce is loaded
    if (!function_exists('WC')) {
        error_log('SAPRIX DEBUG: WooCommerce not loaded, exiting');
        return;
    }
    
    error_log('SAPRIX DEBUG: WooCommerce is loaded');

    // A. Empty the current cart to avoid duplicates
    WC()->cart->empty_cart();
    error_log('SAPRIX DEBUG: Cart emptied');

    // B. Parse Items from URL (Format: id:qty,id:qty)
    if (isset($_GET['items'])) {
        $items_param = sanitize_text_field($_GET['items']);
        error_log('SAPRIX DEBUG: items parameter = ' . $items_param);
        
        $items = explode(',', $items_param);
        error_log('SAPRIX DEBUG: Exploded items = ' . print_r($items, true));

        foreach ($items as $item) {
            $parts = explode(':', $item);
            error_log('SAPRIX DEBUG: Processing item parts = ' . print_r($parts, true));
            
            $product_id = intval($parts[0]);
            $quantity = isset($parts[1]) ? intval($parts[1]) : 1;
            
            error_log('SAPRIX DEBUG: product_id = ' . $product_id . ', quantity = ' . $quantity);

            if ($product_id > 0) {
                // Add to cart (Product ID, Qty)
                // WooCommerce automatically handles variations when you pass the variation ID
                $cart_item_key = WC()->cart->add_to_cart($product_id, $quantity);
                
                if ($cart_item_key) {
                    error_log('SAPRIX DEBUG: Successfully added product ' . $product_id . ' to cart. Cart key: ' . $cart_item_key);
                } else {
                    error_log('SAPRIX DEBUG: FAILED to add product ' . $product_id . ' to cart');
                }
            } else {
                error_log('SAPRIX DEBUG: Invalid product_id: ' . $product_id);
            }
        }
        
        // Check cart contents after adding
        $cart_count = WC()->cart->get_cart_contents_count();
        error_log('SAPRIX DEBUG: Cart now has ' . $cart_count . ' items');
        error_log('SAPRIX DEBUG: Cart contents = ' . print_r(WC()->cart->get_cart(), true));
    } else {
        error_log('SAPRIX DEBUG: No items parameter in URL');
    }

    // Note: We don't redirect here, we let the page continue to load the Checkout
    // The query params remain in the URL so step 2 can read them.
    error_log('SAPRIX DEBUG: Handover function complete, continuing to checkout page');
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

    return $value;
}


// 4. Lógica de costo de envío personalizado (Peso por pares)
// Fórmula: Base + (Incremento * floor((Cantidad - 1) / 2))
// Ejemplo Nacional: 25.000 + (5.000 * floor((6-1)/2)) = 25.000 + 10.000 = 35.000
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
