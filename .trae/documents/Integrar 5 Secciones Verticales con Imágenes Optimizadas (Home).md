## Objetivo
- Colocar 5 imágenes en secciones verticales consecutivas, full‑width, con carga eficiente, textos alternativos accesibles y fidelidad visual al diseño.

## Estructura
- Componente reutilizable `components/sections/VerticalImageSection.tsx` con props:
  - `src`, `alt`, `title`, `subtitle`, `ctaLabel`, `ctaHref`, `highlightColor` (lime), `align` (left|right|center), `overlay` (rectángulo lime / dots).
  - Usa `next/image` con `loading="lazy"`, `sizes="100vw"`, `placeholder="blur"` opcional.
- Orquestación en `app/page.tsx` añadiendo 5 secciones consecutivas.

## Optimización
- Formatos: admitir `WebP/JPEG/PNG` (preferir WebP). `next/image` optimiza y sirve tamaños responsivos.
- `lazy loading`: todas salvo la primera (`priority` en la sección 1 si es hero).
- `sizes`: `100vw` para ancho completo; `object-cover` con `aspect-[16/9]` para uniformidad.
- `blurDataURL` opcional si compartes versión low‑res de cada imagen.

## Accesibilidad
- `alt` descriptivo obligatorio para cada imagen.
- Opcional `figcaption` con copy UX (tono Saprix) si el diseño lo requiere.

## Configuración
- Añadir `images.remotePatterns` en `next.config.ts` para los dominios de tus 5 imágenes.
- Paleta: usar lime del diseño junto al azul eléctrico; no cambiar tu paleta Tailwind.

## Entregables
- Componente `VerticalImageSection` listo.
- Inserción de 5 secciones en Home con estilos fieles (espaciados/márgenes/overlay lime/dots).
- Actualización de `next.config.ts` para permitir dominios de las imágenes.

## Lo que necesito de ti
- Las 5 URLs finales (o subir los archivos), el `alt` de cada una y el orden (1→5).
- Indicar si alguna sección incluye título/CTA sobre la imagen y dónde se posiciona (izquierda/derecha/centro).

¿Confirmas que prepare el componente y deje los 5 slots en la Home listos para insertar tus imágenes y textos en cuanto los compartas?