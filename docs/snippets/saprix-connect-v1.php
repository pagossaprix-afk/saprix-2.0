<?php
/**
 * Plugin Name: Saprix Connect
 * Description: Motor de conexión robusto para Headless Next.js. Expone endpoints optimizados y gestiona CORS.
 * Version: 1.0.0
 * Author: Saprix Engineering
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

class SaprixConnect {

    private static $instance = null;

    public static function instance() {
        if (is_null(self::$instance)) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public function __construct() {
        // Cors Handling
        add_action('init', [$this, 'handle_cors']);
        add_filter('rest_pre_serve_request', [$this, 'cors_headers'], 10, 3);
        
        // Custom Endpoints
        add_action('rest_api_init', [$this, 'register_routes']);

        // Headless Preview Fix
        add_filter('preview_post_link', [$this, 'fix_preview_link'], 10, 2);
    }

    /**
     * Permite peticiones desde el dominio Headless (Next.js)
     */
    public function handle_cors() {
        header("Access-Control-Allow-Origin: *"); // En producción cambiar * por dominio real
        header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE");
        header("Access-Control-Allow-Headers: Authorization, X-API-KEY, Content-Type");
    }

    public function cors_headers($value, $result, $request) {
        return $value;
    }

    /**
     * Registra endpoints personalizados bajo /saprix/v1/
     */
    public function register_routes() {
        // Endpoint rápido para verificar conexión
        register_rest_route('saprix/v1', '/ping', [
            'methods' => 'GET',
            'callback' => function() {
                return new WP_REST_Response(['status' => 'ok', 'time' => time()], 200);
            },
            'permission_callback' => '__return_true'
        ]);

        // Endpoint Batch para Productos (si se requiere escritura masiva)
        register_rest_route('saprix/v1', '/products/batch', [
            'methods' => 'POST',
            'callback' => [$this, 'handle_product_batch'],
            'permission_callback' => [$this, 'check_auth']
        ]);
    }

    /**
     * Lógica placeholder para batch de productos
     */
    public function handle_product_batch($request) {
        $params = $request->get_json_params();
        // Aquí iría la lógica compleja de upsert con SKU
        return new WP_REST_Response([
            'message' => 'Batch endpoint ready. Implement logic here.',
            'received' => count($params['products'] ?? [])
        ], 200);
    }

    /**
     * Verificación de seguridad simple
     */
    public function check_auth($request) {
        // Opción 1: Validar usuario de WP con App Password (nativo)
        if (is_user_logged_in() && current_user_can('edit_posts')) {
            return true;
        }

        // Opción 2: Validar API Key custom (header X-API-KEY definido en wp-config.php)
        $api_key = $request->get_header('X-API-KEY');
        if (defined('CUSTOM_API_KEY') && $api_key === CUSTOM_API_KEY) {
            return true;
        }

        return new WP_Error('rest_forbidden', 'Acceso denegado.', ['status' => 403]);
    }

    /**
     * Redirige la vista previa al frontend Headless
     */
    public function fix_preview_link($link, $post) {
        $headless_url = 'https://tusitio-headless.vercel.app'; // Configurar URL
        return $headless_url . '/api/preview?secret=MY_SECRET&slug=' . $post->post_name;
    }
}

// Inicializar
SaprixConnect::instance();
