# Sistema de Diseño Saprix (v1)

## Guía de estilos
- Paleta: `saprix-electric-blue (#2500ff)`, `saprix-success (verde)`, `saprix-red-orange`, grises extendidos.
- Fondos: patrones `dots/grid/confetti/blobs` con `components/ui/BackgroundPattern`.
- Bordes: tarjetas sin radios (esquinas rectas).

## Tipografía
- Base: Inter (variable). Jerarquía: H1 (48–64), H2 (32–40), H3 (24–28), cuerpo (16–18).
- Títulos en mayúsculas cuando se requiera impacto.

## Layouts
- `Section`: controla fondo y espaciado vertical (`none|sm|md|lg`).
- `Container`: `max-w-7xl` con `px-6` responsivo.
- `Grid`: columnas (`2|3|4`) y `gap (sm|md|lg)`.

## Animaciones
- `lib/ui/motion`: `fadeIn` y `stagger` (easing suave). Usar en listas y entradas de sección.
- Hover de producto: barra de acciones negro + lime.

## Componentes reutilizables
- `VerticalImageSection`: imagen full‑width con overlays y CTA.
- `BackgroundPattern`: patrones CSS para fondos.
- `Spotlight`: highlight reactivo al mouse.

## Convenciones
- Español en copys y etiquetas.
- Accesibilidad: `alt` descriptivo, foco visible, contraste AA.

