# Informe Técnico: Estructura de Mapeo e Integración ERP ↔ Headless WordPress

## 1. Resumen Ejecutivo: ¿Qué hicimos?
Diseñamos y desplegamos una arquitectura de integración middleware robusta sobre WordPress. En lugar de usar la API nativa de WooCommerce (que es lenta y compleja para ERPs antiguos), creamos una Custom API V4 optimizada.

### Logros Clave:
*   **Independencia de IDs**: Toda la sincronización se basa en SKU, eliminando el problema de mapear IDs de bases de datos diferentes.
*   **Performance (Batching)**: Capacidad de actualizar cientos de productos y stock en una sola petición HTTP.
*   **Lógica B2B/B2C en Base de Datos**: Extendimos WordPress con tablas personalizadas SQL para manejar reglas de negocio complejas (convenios, laboratorios, descuentos por volumen) que WooCommerce nativo no soporta eficientemente.
*   **Seguridad**: Autenticación por X-API-KEY y Rate Limiting incorporado.

## 2. Los Snippets (El "Core" de la Solución)
Detectamos dos archivos maestros que contienen toda la lógica. Para replicar el sistema, estos son los archivos sagrados:

### A. El Motor de Conexión (API)
**Archivo**: `docs/snippets/wordpress_custom_api_v3_4_COMPLETE.php`
Este es un plugin completo (se debe instalar en `wp-content/mu-plugins/` para que no pueda ser desactivado por error).

**Funciones**:
*   Exponer endpoints: `/custom-api/v1/product/sku/{sku}`, `/products/batch`.
*   Gestionar seguridad (CORS, Auth).
*   Validar y subir imágenes desde URLs externas automáticamente.
*   Mapear taxonomías y metadatos personalizados (JetEngine).

### B. El Motor de Promociones (Lógica PTC)
**Archivo**: `docs/snippets/woocommerce_beneficios_b2c_v3_FINAL.php`
Este snippet maneja la lógica compleja de "Pague X, Lleve Y" y regalos, interviniendo directamente en el cálculo del carrito de WooCommerce.

**Funciones**:
*   Detectar reglas de negocio en tabla SQL `wp_item_ptc`.
*   Agregar automáticamente productos de regalo al carrito.
*   Controlar stocks máximos y límites por usuario.

## 3. Guía de Replicación Paso a Paso (How-To)
Para replicar este entorno en otro headless (ej: "PharmaClone"), sigue estrictamente estos pasos:

### Paso 1: Preparar la Base de Datos (SQL Custom)
La API espera tablas que no existen en WordPress por defecto. Debes ejecutar este SQL en tu base de datos (phpMyAdmin o CLI):

```sql
/* Tablas para Lógica B2B y Promociones */
CREATE TABLE wp_cliente_descuento_item (id INT AUTO_INCREMENT PRIMARY KEY, CLIENTE_ID VARCHAR(50), ITEM_ID VARCHAR(50), VALOR DECIMAL(10,2), FECHA_FINAL DATE);
CREATE TABLE wp_convenio (id INT AUTO_INCREMENT PRIMARY KEY, CONVENIO_ID INT, NOMBRE VARCHAR(255));
CREATE TABLE wp_laboratorio (id INT AUTO_INCREMENT PRIMARY KEY, LAB_ID INT, NOMBRE VARCHAR(255));
CREATE TABLE wp_item_ptc (
    id INT AUTO_INCREMENT PRIMARY KEY, 
    ITEM_ID VARCHAR(50), 
    ITEM_ID_RECAMBIO VARCHAR(50), 
    POR_COMPRA_DE INT, 
    RECIBE_PTC INT, 
    FECHA_INICIO DATE, 
    FECHA_FIN DATE,
    TOPE_MAXIMO INT DEFAULT 0,
    LIMITE_POR_USUARIO INT DEFAULT 0
);
```

### Paso 2: Instalar el "Core" de la API
Toma el contenido de `docs/snippets/wordpress_custom_api_v3_4_COMPLETE.php`.
Crea un archivo llamado `pharma-core-api.php` en la carpeta `/wp-content/mu-plugins/` de tu instalación WordPress.
*Nota: Si la carpeta mu-plugins no existe, créala. "MU" significa Must Use; estos plugins se ejecutan siempre antes que los normales.*
Define tu API Key en el `wp-config.php` del servidor para seguridad:

```php
define('CUSTOM_API_KEY', 'tu-clave-secreta-super-segura-aqui');
```

### Paso 3: Configurar el Snippet de Promociones
Toma el contenido de `docs/snippets/woocommerce_beneficios_b2c_v3_FINAL.php`.
Puedes ponerlo en `functions.php` de tu tema hijo o concatenarlo dentro de tu plugin en mu-plugins (recomendado para orden).

### Paso 4: Mapeo de Categorías
No intentes sincronizar IDs de categorías entre entornos. Usa el Slug como fuente de verdad.

En el documento `docs/technical/woocommerce-mapping.md` definimos que el frontend debe buscar categorías críticas por slug, ejemplo:
*   `cadena-de-frio` (Slug crítico para logística)
*   `medicamentos-rx` (Slug para validación médica)

### Paso 5: Probar la Conexión
Usa Postman o Curl para verificar que el sistema responde.

**Endpoint de Prueba (Crear/Actualizar Producto por SKU)**: `POST https://tu-sitio.com/wp-json/custom-api/v1/products/batch`

**Headers**:
*   `X-API-KEY`: (La clave que definiste en wp-config.php)
*   `Content-Type`: application/json

**Body**:
```json
{
  "mode": "upsert",
  "products": [
    {
      "sku": "PRUEBA-01",
      "title": "Producto Test API",
      "regular_price": "15000",
      "stock_quantity": 100
    }
  ]
}
```
