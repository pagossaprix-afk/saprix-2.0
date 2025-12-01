## Objetivo
- Replicar fielmente, sección por sección, el diseño de las imágenes que compartiste, usando azul eléctrico + verde lime exacto, con tipografías, espaciados y efectos igualados. Aplicar a Home y páginas de producto.

## Instalación y Base UI
- Instalar UI para componentes accesibles y consistentes:
  - `npm i @radix-ui/react-popover @radix-ui/react-dialog @radix-ui/react-tabs` (si es necesario para interacciones)
  - Integrar shadcn/ui (buttons, sheet, tabs): `npx shadcn@latest init` y añadir `button`, `sheet`, `tabs`, `popover`.
- Tipografía:
  - Revisar si se requiere una fuente manuscrita para el subtítulo “Urban Sportwear”; si el diseño exige script, añadir una Google Font ligera y declararla en `fontFamily`.
- Tokens Tailwind:
  - Añadir `saprix-lime` (aprox. #C6FF00) junto a `saprix-electric-blue` y `saprix-success` para igualar el verde brillante del diseño.

## Home – Secciones (pixel‑perfect)
1) Hero “Through the Mayhem”
- Full‑width sin contenedor; fondo de puntos (densidad decreciente) y texto de gran tamaño “MAYHEM” en gris claro en el fondo.
- Atleta a la izquierda, bloque lime exacto detrás (rectángulo con posición y z‑index medido).
- A la derecha: subtítulo manuscrito “Urban Sportwear”, título en 2–3 líneas bold, overlay lime parcial sobre la segunda línea.
- CTA negro: `Explore Our Categories` con padding/altura según imagen.
- Implementar con `BackgroundPattern` (dots + confetti), capas absolutas y `next/image`.

2) Statement Bar
- Banda negra 100% ancho, texto en mayúsculas centrado en white bold.
- “Confetti” dorado sutil en la derecha y esquina inferior (gradiente radial con puntos).

3) “Select Your Style Now”
- Título centrado con highlight lime en la palabra `NOW`.
- Tres imágenes en grid 3 columnas, borde‑a‑borde sin gap ni radios.
- Zapatilla al centro superpuesta con sombra elíptica.

4) Bloque Doble “Men/Women Apparel”
- Título superior “Best Shoes for Running 2022” con `SHOP NOW` centrado.
- Dos tarjetas grandes (izquierda/ derecha) con imagen, overlay gris claro detrás (rectángulos offset), títulos `MEN APPAREL` y `WOMEN APPAREL`, botón `SHOP NOW` negro.
- Confetti dorado y puntos en laterales.

5) “Essential Items” Dark Card
- Fondo negro con patrón de puntos y texto gigante “MAYHEM” en ultra‑light detrás.
- Zapatilla blanca a la izquierda con rectángulo lime detrás.
- Texto a la derecha: título, precio lime `99` con badge, párrafo, botón `ADD TO CART` con borde lime.

## Producto – Página Single (pixel‑perfect + funcional)
- Hero dark con imagen grande del producto y rectángulo lime; precio destacado.
- Galería con miniaturas y zoom hover.
- Variantes color/talla: intersección de variaciones (ya tenemos helpers), estados disabled, feedback de stock.
- CTA sticky (desktop/móvil): añadir al carrito + wishlist.
- Tabs: descripción, especificaciones, reseñas.
- Relacionados: slider horizontal full‑width con tarjetas.

## Contenido (UX Writing – tono Saprix)
- Copys en español, contundentes y funcionales (CTA claros: `Comprar ahora`, `Explorar categorías`, `Añadir al carrito`).
- Jerarquía visual: H1/H2/H3 con pesos y tamaños medidos; evitar texto genérico ajeno a Saprix.

## Detalles de Fidelidad (medición)
- Usar guía de espaciado: margen superior/inferior ~48–64px, paddings ~24–32px.
- Títulos ~64–72px bold; subtítulo script ~20–24px; botones ~44px alto.
- Colores: azul `#2500ff`; lime aproximado a imagen `#C6FF00` (se sampleará); dorado confetti `#FFB020`.

## Ficheros a crear/ajustar
- `app/(marketing)/layout.tsx`: layout anidado (header/footer, fondo patrón global).
- `app/page.tsx`: orquestación de secciones.
- `components/ui/BackgroundPattern.tsx`, `components/ui/Spotlight.tsx`: utilidades visuales.
- `components/home/*`: hero, statement, style select, apparel, essential card, bento grid, feature grid, CTA.
- `tailwind.config.ts`: añadir `saprix-lime` y (si hace falta) fuente script.
- `next.config.ts`: verificar dominios remotos de imágenes.

## Performance y Accesibilidad
- `next/image` con `priority` selectivo; patrones CSS puros para evitar bundle extra.
- ARIA/roles, foco visible, contraste AA, tamaños táctiles.

## Verificación
- Medición “pixel‑approx” con reglas de DevTools (comparación visual).
- Navegación a `/producto/[slug]` para validar galería, variantes y CTA.

¿Procedo con la implementación exacta en Home y Producto (incluyendo instalación de UI y tokens lime) para alcanzar fidelidad pixel‑perfect según las imágenes?