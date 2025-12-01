## Objetivo
- Transformar la Home en una landing de calidad con secciones full‑width, efectos creativos y layout limpio, usando capacidades nativas de Next.js y los componentes ya presentes.

## Layouts (Next.js)
- Crear un layout de marketing anidado `app/(marketing)/layout.tsx` para agrupar Home y futuras páginas (header, main, footer consistentes).
- Mantener el layout global actual y anidar el de marketing según el capítulo de layouts (estructura más mantenible).

## Secciones Full‑Width
- Hero (ya creado) con fondo de puntos y confetti, bloque lime y atleta superpuesto.
- Barra negra de statement (ya creada) con punto naranja.
- “Selecciona tu estilo” en 3 columnas sin `gap` ni radios, imagen borde a borde y zapatilla con sombra.
- Marquee de marca con máscara y scroll infinito.
- Bento Grid interactivo con spotlight y overlay en hover.
- Grid de features con borde neón (gradiente azul/verde) y iconos.
- CTA de categorías con banda lime/azul, zapatilla producto y 3 CTAs.

## Efectos Creativos
- Usar `components/ui/BackgroundPattern` para generar fondos `dots/grid/confetti/blobs` en cualquier sección.
- Usar `components/ui/Spotlight` para highlights reactivos al mouse (color y tamaño configurables).
- Animaciones suaves con `framer-motion` (ya instalado) para entradas/hover.

## Consistencia de Marca
- Paleta Tailwind ya definida (`saprix-electric-blue`, `saprix-success`, neutros). Ajustar contraste y accesibilidad.
- Tipografía y pesos siguiendo el tutorial de estilos; asegurar headings con ritmo vertical consistente.

## Accesibilidad
- Alt en imágenes, roles/aria en CTAs, foco visible, contraste suficiente.

## Performance
- `next/image` con `priority` selectivo, `fill` + `object-cover` y `remotePatterns` (ya configurado) para dominios remotos.
- Evitar librerías pesadas; efectos implementados con CSS/React para mantener bundle liviano.

## Entregables
- Nuevo layout `app/(marketing)/layout.tsx`.
- Componentes de secciones listos y conectados desde `app/page.tsx`.
- Ajustes de estilos para full‑width real y responsividad.

## Opcional (si lo apruebas)
- Añadir bloque extra “Parallax hero” y “Glass cards” inspirados en patrones modernos sin dependencias nuevas.
- Si quieres librerías externas tipo marketplace, evaluar impacto y compatibilidad SSR antes de integrar.

¿Confirmas que avance con el layout anidado y la consolidación de estas secciones en la Home?