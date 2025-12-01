## Objetivo
- Convertir la UI estática de `components/product/ProductPageFigma.tsx:61` en una página de producto real conectada a WooCommerce, con selección de variantes, wishlist y carrito local sincronizado con el header.

## Datos del producto (server)
- Usar `app/producto/[slug]/page.tsx:9-20` para obtener el producto por `slug` (`getProductBySlug`) y sus variaciones (`getProductVariations`).
- Reutilizar el mapeo existente `config/mappings/product-single.ts:4-19` con `applyMapping` para nombre, imágenes, precios y descripciones.
- Extraer opciones de color y talla desde variaciones con `getColorOptionsFromVariations` y `getSizeOptionsFromVariations` (`lib/woocommerce.ts:98-156`).

## Refactor del componente
- Modificar `ProductPageFigma` para recibir props: `product`, `images`, `price`, `regularPrice`, `salePrice`, `colorOptions`, `sizeOptions`, `variations` y `mapped`.
- Sustituir arrays y textos hardcodeados por datos reales (nombre, breadcrumbs simples por categorías si están disponibles; si no, mantener fallback).
- Mantener estilos y componentes existentes (`lib/design-system`, Tailwind tokens `tailwind.config.ts`).

## Selección de variantes
- Al elegir color y talla, resolver el `variantId` cruzando listas de variaciones por opción (intersección). Si no hay intersección válida o `stock_status` ≠ `instock`, deshabilitar la combinación.
- Actualizar imagen principal al cambiar color si la variación provee `image.src` o hay galería asociada (ya soportado en `lib/woocommerce.ts:119-129`).

## Carrito local
- Implementar handler "Añadir al Carrito" que persiste en `localStorage`:
  - `cartItems`: array de `{ slug, nombre, imagen, precio, quantity, variantId }`.
  - `cartCount`: cantidad total (sumatoria de `quantity`).
- Esto alimenta el mini-carrito del header `components/layout/FutsalHeader.tsx:430-476` y los contadores `FutsalHeader.tsx:73` / `:531-533`.

## Wishlist local
- Toggle wishlist y persistir:
  - `wishlist`: array de `{ slug, nombre, imagen }`.
  - `wishlistCount`: entero; actualizar para reflejar en el header `FutsalHeader.tsx:426-431`.

## Accesibilidad y estados
- Mantener y mejorar los `aria-label`, `disabled` y teclas de navegación ya presentes en `ProductPageFigma.tsx:186-199` y `:209-224`.
- Conservar la semántica y responsividad actuales.

## Verificación
- Validar en `/producto/[slug]` que:
  - Nombre, precios e imágenes se muestran desde WooCommerce.
  - Color/talla resuelven una variación válida y deshabilitan combinaciones no disponibles.
  - Añadir al carrito actualiza `localStorage` y el contador del header; el mini-carrito lista los items (`FutsalHeader.tsx:445-468`).
  - Wishlist refleja el estado y el contador.

¿Confirmo y procedo con los cambios para implementar esta integración end-to-end?