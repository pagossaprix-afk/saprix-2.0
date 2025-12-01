## Objetivo
- Crear una experiencia visual “wow” en Home y en páginas de producto: full‑width, efectos modernos, componentes pulidos, accesibilidad y performance top.

## Alcance
- Home: hero, statement bar, grillas bento, secciones full‑width, marquee de marca, CTA colecciones.
- Producto: galería premium, selección de variantes (color/talla), precio/stock, CTA sticky, ficha técnica y reseñas, secciones de productos relacionados.

## Librerías/Componentes a instalar
- UI base: Radix UI + shadcn/ui (botones, sheets, popovers, tooltips, dialogs, drawers).
- Animación: framer‑motion (ya está) y utilidades CSS (gradientes, glass, spotlight hechos a medida).
- Iconos: lucide‑react (ya está).
- Opcional: marquee util/spline‑like parallax sin dependencias pesadas.

## Layouts (Next.js)
- Definir layout “marketing” anidado para Home y páginas públicas: header/navbar, footer, fondo de patrones y contenedor full‑width coherente.
- Mantener layout global según buenas prácticas de Next (layouts anidados).

## Home (entregables por sección)
- Hero full‑width: imagen protagonista, bloque lime, textos contundentes, CTA primario.
- Statement bar negra: copy centrado, acento naranja.
- Grilla “Selecciona tu estilo”: 3 imágenes borde a borde + zapatilla overlay con sombra elíptica.
- Marquee de marca: scroll infinito con máscara, colores de marca.
- Bento grid interactivo: spotlight reactivo al mouse, hover zoom, overlay.
- Features neón: tarjetas con borde degradado azul/verde.
- CTA categorías: banda lime/azul, imagen producto y 3 CTAs.

## Página de Producto (entregables)
- Galería: carrusel/miniaturas, zoom/hover, soporte a imágenes de variación.
- Variantes: resolver `variantId` por intersección color/talla; estados disabled; feedback de stock.
- Precios: regular/sale con badge, moneda formateada.
- CTA: “Añadir al carrito” sticky (desktop y mobile), wishlist.
- Info: tabs para descripción, especificaciones, reseñas (estructura lista; contenido de WooCommerce existente).
- Relacionados: slider de productos similares + “Te puede interesar”.

## Integración y datos
- WooCommerce (ya integrado): `getProductBySlug`, `getProductVariations`, colores/tallas desde variaciones.
- Carrito/wishlist: localStorage + contadores sincronizados en header; mejorar mini‑carrito con componentes shadcn (Drawer/Sheet + List).

## Performance y Accesibilidad
- `next/image` con dominios remotos (ya configurado), `priority` selectivo.
- Roles/aria, foco visible, contrastes AA, tab order consistente.

## Estilo y Tokens
- Usar paleta Saprix: `saprix-electric-blue`, `saprix-success`, grises extendidos.
- Patrones de fondo y spotlight reutilizables como utilidades.

## Plan de Entrega
- Fase 1: instalar UI (shadcn + Radix), crear layout marketing, pulir Home con secciones anteriores.
- Fase 2: refactor de `Producto` con galería/variantes/CTA sticky y tabs; relacionados.
- Fase 3: mini‑carrito y wishlist con componentes shadcn; ajustes de accesibilidad y performance.

¿Procedo a instalar y aplicar este rediseño end‑to‑end en Home y Producto?