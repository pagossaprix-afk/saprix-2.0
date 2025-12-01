# Plan de Implementación: Nueva Página de Tienda

## Objetivo
Crear una página de tienda profesional al nivel de Nike/Adidas con sistema de filtros que FUNCIONE correctamente.

## Problemas Actuales Identificados
1. ❌ Filtro de categorías NO funciona (muestra todos los productos)
2. ❌ Diseño poco profesional
3. ❌ Inputs de precio en lugar de slider
4. ❌ Falta de filtros de color y talla
5. ❌ Código complejo y difícil de mantener

## Solución Propuesta

### 1. Arquitectura Nueva
```
/app/tienda/page.tsx (Server Component)
  ├─ Fetch inicial de datos
  ├─ Manejo de searchParams
  └─ Renderiza ShopClient

/components/shop/ShopClient.tsx (Client Component)
  ├─ FilterSidebar (nuevo)
  ├─ ProductGrid (nuevo)
  └─ Lógica de filtrado CLIENT-SIDE
```

### 2. Diseño Premium
- **Esquinas rectas** (border-radius mínimo o 0)
- **Tipografía bold** y clara
- **Espaciado generoso**
- **Colores contrastantes**
- **Animaciones sutiles**
- **Grid responsive**: 2-3-4 columnas

### 3. Sistema de Filtros
#### A. Sidebar Izquierdo
1. **Búsqueda** (input con icono)
2. **Categorías** (árbol jerárquico, colapsable)
3. **Precio** (slider de rango, no inputs)
4. **Colores** (círculos de color)
5. **Tallas** (botones seleccionables)
6. **Línea Saprix** (chips)

#### B. Lógica de Filtrado
- **Client-side filtering** para respuesta instantánea
- Fetch inicial de TODOS los productos
- Aplicar filtros en memoria
- URL params para compartir filtros

### 4. Componentes Nuevos

#### `ShopClient.tsx`
```tsx
'use client'
- Estado: productos filtrados
- Lógica de filtrado
- Manejo de URL params
```

#### `FilterSidebar.tsx` (NUEVO)
```tsx
'use client'
- Búsqueda
- Categorías jerárquicas
- Price Slider (react-slider o nativo)
- Color swatches
- Size buttons
```

#### `ProductGrid.tsx` (NUEVO)
```tsx
- Grid limpio 2-3-4 cols
- Hover effects sutiles
- Quick view
- Add to cart rápido
```

#### `ProductCard.tsx` (MEJORADO)
```tsx
- Imagen grande
- Nombre bold
- Precio destacado
- Botón CTA claro
- Badge de descuento
```

### 5. Implementación por Fases

#### Fase 1: Estructura Base ✅
- [x] Crear `/app/tienda/page.tsx` (Server)
- [ ] Crear `/components/shop/ShopClient.tsx`
- [ ] Fetch de productos y categorías

#### Fase 2: Filtros Funcionales ✅
- [ ] Implementar filtrado client-side
- [ ] Categorías jerárquicas
- [ ] Price slider
- [ ] Color & Size filters

#### Fase 3: Diseño Premium ✅
- [ ] Aplicar diseño Nike-style
- [ ] Esquinas rectas
- [ ] Tipografía bold
- [ ] Espaciado generoso

#### Fase 4: Testing & Polish ✅
- [ ] Probar cada filtro
- [ ] Verificar con datos reales
- [ ] Optimizar performance
- [ ] Responsive design

## Tecnologías
- **Next.js 15** (App Router)
- **React 19** (Client Components)
- **Tailwind CSS** (Utility-first)
- **Framer Motion** (Animaciones)
- **rc-slider** o **@radix-ui/react-slider** (Price range)

## Cronograma
- Fase 1-2: 30 min
- Fase 3: 20 min
- Fase 4: 10 min
**Total: ~1 hora**

## Notas
- Priorizar FUNCIONALIDAD sobre diseño inicialmente
- Verificar filtros con datos reales de WooCommerce
- Mantener código simple y mantenible
