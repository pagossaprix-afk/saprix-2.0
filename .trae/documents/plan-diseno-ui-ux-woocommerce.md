# Plan de Diseño UI/UX - Integración WooCommerce Saprix

## 1. REQUISITOS DE DISEÑO UI/UX

### 1.1 Análisis de la Identidad de Marca Actual

**Colores de Marca Saprix:**
- Azul Eléctrico: `#2500ff` (Color primario)
- Azul Índigo: `#233775` (Color secundario)
- Azul Negro: `#060321` (Fondos oscuros)
- Rojo-Naranja: `#FF4500` (Acentos y CTAs)
- Blanco: `#FFFFFF` (Texto y fondos)

**Tipografía:**
- Fuente principal: Inter (Google Fonts)
- Estilo: Moderna, legible, deportiva

**Estilo Visual Actual:**
- Bordes ligeramente redondeados (4px)
- Enfoque en deportes de alto rendimiento
- Paleta orientada al futsal profesional

### 1.2 Sistema de Diseño Propuesto

#### Design Tokens

**Paleta Extendida:**
```css
/* Colores Primarios */
--saprix-electric-blue: #2500ff
--saprix-electric-blue-light: #4d33ff
--saprix-electric-blue-dark: #1a00cc

/* Colores Semánticos */
--saprix-success: #00B341
--saprix-warning: #FF9500
--saprix-error: #FF3E7F
--saprix-info: #00C2FF

/* Neutros */
--saprix-gray-50: #f8fafc
--saprix-gray-100: #f1f5f9
--saprix-gray-200: #e2e8f0
--saprix-gray-300: #cbd5e1
--saprix-gray-400: #94a3b8
--saprix-gray-500: #64748b
--saprix-gray-600: #475569
--saprix-gray-700: #334155
--saprix-gray-800: #1e293b
--saprix-gray-900: #0f172a
```

**Sistema de Espaciado:**
```css
--space-xs: 0.25rem;    /* 4px */
--space-sm: 0.5rem;     /* 8px */
--space-md: 1rem;       /* 16px */
--space-lg: 1.5rem;     /* 24px */
--space-xl: 2rem;       /* 32px */
--space-2xl: 3rem;      /* 48px */
--space-3xl: 4rem;      /* 64px */
```

### 1.3 Wireframes de Alta Fidelidad

#### Vista Home

**Estructura:**
```
┌─────────────────────────────────────────────────────────────┐
│ [Logo] Search Wishlist Cart [Menu]                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                                                     │    │
│  │              Hero Slider (3 slides)                 │    │
│  │         "Colección Sala 2025" [CTA]                │    │
│  │                                                     │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
│  Categorías Populares                                       │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                      │
│  │      │ │      │ │      │ │      │                      │
│  │  Hombre  │  Mujer  │  Niños   │ Ofertas │                      │
│  │      │ │      │ │      │ │      │                      │
│  └──────┘ └──────┘ └──────┘ └──────┘                      │
│                                                             │
│  Productos Destacados                                       │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐                           │
│  │     │ │     │ │     │ │     │                           │
│  │  P1 │ │  P2 │ │  P3 │ │  P4 │                           │
│  │     │ │     │ │     │ │     │                           │
│  └─────┘ └─────┘ └─────┘ └─────┘                           │
└─────────────────────────────────────────────────────────────┘
```

#### Vista Catálogo/Tienda

**Estructura:**
```
┌─────────────────────────────────────────────────────────────┐
│ [Logo] Search Wishlist Cart [Menu]                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Filtros (Sidebar)        Productos (Grid)                 │
│  ┌─────────────┐        ┌─────────────────────────────┐   │
│  │ Categorías  │        │ [Sort: Relevancia ▼]        │   │
│  │ □ Hombre    │        │                             │   │
│  │ □ Mujer     │        │ ┌─────┐ ┌─────┐ ┌─────┐    │   │
│  │ □ Niños     │        │ │     │ │     │ │     │    │   │
│  │             │        │ │  P1 │ │  P2 │ │  P3 │    │   │
│  │ Precio      │        │ │     │ │     │ │     │    │   │
│  │ $0 - $100   │        │ └─────┘ └─────┘ └─────┘    │   │
│  │ $100 - $200 │        │                             │   │
│  │ $200+       │        │ ┌─────┐ ┌─────┐ ┌─────┐    │   │
│  │             │        │ │     │ │     │ │     │    │   │
│  │ Colores     │        │ │  P4 │ │  P5 │ │  P6 │    │   │
│  │ 🔴 🔵 ⚫    │        │ │     │ │     │ │     │    │   │
│  └─────────────┘        │ └─────┘ └─────┘ └─────┘    │   │
│                         │                             │   │
│                         │ [1] 2 3 4 5 [Siguiente >]  │   │
│                         └─────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

#### Vista Producto Individual

**Estructura:**
```
┌─────────────────────────────────────────────────────────────┐
│ [Logo] Search Wishlist Cart [Menu]                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌───────────────────────┐  ┌────────────────────────────┐  │
│  │                       │  │ Nombre Producto           │  │
│  │     Imagen Grande     │  │ ⭐⭐⭐⭐⭐ (4.5) 23 reviews  │  │
│  │     Principal         │  │                            │  │
│  │                       │  │ $199.900 COP               │  │
│  │ ┌──┐┌──┐┌──┐┌──┐     │  │                            │  │
│  │ │  ││  ││  ││  │     │  │ Color: [🔴] [⚫] [🔵]      │  │
│  │ └──┘└──┘└──┘└──┘     │  │                            │  │
│  │     Miniaturas        │  │ Talla: [40] [41] [42] [43] │  │
│  └───────────────────────┘  │                            │  │
│                             │ Cantidad: [-] 1 [+]       │  │
│                             │                            │  │
│                             │ [🛒 Añadir al Carrito]    │  │
│                             │ [❤️ Añadir a Wishlist]    │  │
│                             │                            │  │
│                             │ 📦 Envío gratis > $150k   │  │
│                             │ 🔄 Devoluciones 30 días   │  │
│                             └────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## 2. FLUJO DE USUARIO COMPLETO

### 2.1 Customer Journey Map

#### Fase 1: Descubrimiento
**Usuario**: "Necesito zapatillas para futsal"
**Acciones**:
1. Entra a saprix.com.co
2. Ve hero slider con promociones
3. Explora categorías (Hombre/Mujer/Niños)

**Puntos de Contacto**:
- Hero banner con CTAs claros
- Navegación intuitiva por categorías
- Búsqueda predictiva

**Emociones**: Curioso → Interesado

#### Fase 2: Exploración
**Usuario**: "Quiero ver opciones de zapatillas"
**Acciones**:
1. Clica en "Zapatillas Sala"
2. Aplica filtros (precio, talla, color)
3. Compara productos

**Puntos de Contacto**:
- Filtros laterales intuitivos
- Grid de productos responsive
- Información de precio clara

**Emociones**: Interesado → Evaluativo

#### Fase 3: Decisión
**Usuario**: "Me gustan estas zapatillas"
**Acciones**:
1. Entra al producto individual
2. Lee descripción y especificaciones
3. Selecciona variaciones
4. Lee reseñas

**Puntos de Contacto**:
- Página de producto detallada
- Selector de variaciones
- Reseñas de usuarios
- Información de envío

**Emociones**: Evaluativo → Convencido

#### Fase 4: Acción
**Usuario**: "Las voy a comprar"
**Acciones**:
1. Selecciona talla y color
2. Añade al carrito
3. Procede al checkout
4. Completa pago

### 2.2 Estados de Interacción

#### Botones Primarios
```css
/* Estado Base */
.bg-saprix-electric-blue
.text-white
.px-6.py-3
.rounded-lg
.font-semibold

/* Hover */
.bg-saprix-electric-blue-dark
.transform.scale-105
.transition-all.duration-200

/* Active */
.bg-saprix-electric-blue-dark
.transform.scale-95

/* Loading */
.opacity-75
.pointer-events-none
.animate-pulse

/* Disabled */
.opacity-50
.pointer-events-none
.bg-gray-400
```

#### Tarjetas de Producto
```css
/* Default */
.border-2.border-saprix-indigo
.bg-saprix-indigo
.rounded-lg

/* Hover */
.border-saprix-electric-blue
.shadow-lg
.transform.scale-105

/* Seleccionado */
.border-saprix-red-orange
.ring-2.ring-saprix-red-orange
```

#### Inputs y Formularios
```css
/* Default */
.border-gray-300
.rounded-md
.px-4.py-2

/* Focus */
.border-saprix-electric-blue
.ring-2.ring-saprix-electric-blue/20

/* Error */
.border-red-500
.text-red-600

/* Success */
.border-green-500
.text-green-600
```

## 3. INTEGRACIÓN TÉCNICA

### 3.1 Mapeo WooCommerce → Frontend

#### Estructura de Datos
```typescript
// WooCommerce Product
interface WCProduct {
  id: number;
  name: string;
  slug: string;
  type: 'simple' | 'variable';
  price: string;
  regular_price: string;
  sale_price: string;
  images: Array<{
    src: string;
    alt: string;
  }>;
  attributes: Array<{
    name: string;
    options: string[];
  }>;
}

// Frontend Product
interface Product {
  id: number;
  name: string;
  slug: string;
  price: {
    current: number;
    original?: number;
    currency: 'COP';
  };
  images: {
    main: string;
    gallery: string[];
  };
  variations: {
    color?: string[];
    size?: string[];
  };
}
```

#### Mapeo de Campos
```typescript
const productMapping = {
  'id': 'id',
  'name': 'name',
  'slug': 'slug',
  'price.current': 'sale_price || regular_price || price',
  'price.original': 'regular_price',
  'images.main': 'images[0].src',
  'images.gallery': 'images.slice(1).map(img => img.src)',
  'variations.color': 'attributes.find(attr => attr.name.toLowerCase().includes("color")).options',
  'variations.size': 'attributes.find(attr => attr.name.toLowerCase().includes("size")).options'
};
```

### 3.2 Personalización de Plantillas WooCommerce

#### Hooks y Filtros Necesarios
```php
// functions.php

// 1. Personalizar endpoint de productos
add_filter('woocommerce_rest_prepare_product_object', 'custom_product_response', 10, 3);
function custom_product_response($response, $object, $request) {
    $data = $response->get_data();
    
    // Agregar campos personalizados
    $data['custom_fields'] = get_post_meta($object->get_id(), '_custom_fields', true);
    
    // Modificar estructura de imágenes
    $data['images'] = array_map(function($image) {
        return [
            'src' => $image['src'],
            'alt' => $image['alt'],
            'position' => $image['position']
        ];
    }, $data['images']);
    
    $response->set_data($data);
    return $response;
}

// 2. Agregar atributos personalizados
add_action('woocommerce_rest_insert_product_object', 'add_custom_attributes', 10, 3);
function add_custom_attributes($product, $request, $creating) {
    // Procesar atributos para frontend
    $attributes = $product->get_attributes();
    foreach ($attributes as $attribute) {
        if ($attribute->get_variation()) {
            // Es una variación
            $product->add_meta_data('_variation_attributes', $attribute->get_data());
        }
    }
}
```

### 3.3 Sistema de Caché y Optimización

#### Estrategia de Caché
```typescript
// Implementar SWR o React Query
import { SWRConfig } from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function App({ Component, pageProps }) {
  return (
    <SWRConfig 
      value={{
        fetcher,
        refreshInterval: 300000, // 5 minutos
        revalidateOnFocus: false,
        revalidateOnReconnect: true,
      }}
    >
      <Component {...pageProps} />
    </SWRConfig>
  );
}
```

#### Optimización de Imágenes
```typescript
// Componente de imagen optimizada
import Image from 'next/image';

interface OptimizedImageProps {
  src: string;
  alt: string;
  priority?: boolean;
  sizes: string;
}

export function OptimizedImage({ src, alt, priority, sizes }: OptimizedImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className="object-cover"
      style={{
        maxWidth: "100%",
        height: "auto"
      }} />
  );
}
```

## 4. ENTREGABLES

### 4.1 Archivo Figma Organizado

#### Estructura de Páginas
```
Saprix Ecommerce Design System
├── 📁 01 - Foundation
│   ├── Color Palette
│   ├── Typography
│   ├── Spacing
│   ├── Shadows
│   └── Icons
├── 📁 02 - Components
│   ├── Buttons
│   ├── Forms
│   ├── Cards
│   ├── Navigation
│   └── Modals
├── 📁 03 - Layouts
│   ├── Home Page
│   ├── Catalog Page
│   ├── Product Page
│   ├── Cart Page
│   └── Checkout Page
├── 📁 04 - Prototypes
│   ├── Mobile Flow
│   ├── Desktop Flow
│   └── Interactions
└── 📁 05 - Documentation
    ├── Design Tokens
    ├── Usage Guidelines
    └── Developer Handoff
```

#### Biblioteca de Componentes

**Botones:**
- Primary Button (CTA principal)
- Secondary Button (Acciones secundarias)
- Ghost Button (Acciones terciarias)
- Icon Button (Acciones rápidas)
- Loading Button (Estados de carga)

**Formularios:**
- Text Input
- Select Dropdown
- Checkbox/Radio
- Toggle Switch
- File Upload
- Error States

**Cards:**
- Product Card
- Category Card
- Review Card
- Blog Card
- Promo Card

**Navegación:**
- Header Navigation
- Breadcrumb
- Pagination
- Tabs
- Sidebar Menu

### 4.2 Documentación de Especificaciones

#### Design Tokens Document
```yaml
# Colors
primary:
  base: "#2500ff"
  light: "#4d33ff"
  dark: "#1a00cc"
  
secondary:
  base: "#233775"
  light: "#3d4d8f"
  dark: "#152251"

# Typography
font-family:
  primary: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
  
font-sizes:
  xs: "0.75rem"    # 12px
  sm: "0.875rem"   # 14px
  base: "1rem"     # 16px
  lg: "1.125rem"   # 18px
  xl: "1.25rem"    # 20px
  2xl: "1.5rem"    # 24px
  3xl: "1.875rem"  # 30px
  4xl: "2.25rem"   # 36px

# Spacing
spacing:
  unit: 4px
  scale:
    - 4px   # xs
    - 8px   # sm
    - 16px  # md
    - 24px  # lg
    - 32px  # xl
    - 48px  # 2xl
    - 64px  # 3xl
```

#### Component Specifications

**Product Card Component:**
```yaml
name: ProductCard
status: Ready for dev
description: Card component for product listings

structure:
  image:
    aspectRatio: 1:1
    objectFit: cover
    borderRadius: 8px
    
  content:
    title:
      fontSize: 16px
      fontWeight: 600
      lineHeight: 1.4
      maxLines: 2
      
    price:
      fontSize: 18px
      fontWeight: 700
      color: primary.base
      
    badge:
      position: top-left
      background: red-orange
      color: white
      padding: 4px 8px
      borderRadius: 4px

states:
  - default
  - hover (scale: 1.05, shadow: lg)
  - loading (skeleton)
  - error (fallback image)

responsive:
  mobile: 2 columns
  tablet: 3 columns
  desktop: 4 columns
```

### 4.3 Guía de Estilo para Desarrolladores

#### Convenciones de Nomenclatura
```typescript
// Components
/components
  /ui          // Base UI components
  /product     // Product-specific components
  /shop        // Shop-related components
  /layout      // Layout components
  /shared      // Shared components

// Naming convention
ProductCard.tsx        // PascalCase for components
useProduct.ts          // camelCase for hooks
product.utils.ts       // camelCase for utilities
product.types.ts       // camelCase for types

// CSS classes
product-card           // kebab-case for classes
product-card__image    // BEM methodology
product-card--large    // BEM modifiers
```

#### Responsive Breakpoints
```css
/* Mobile First Approach */
/* Default: Mobile (< 640px) */

/* Tablet */
@media (min-width: 640px) {
  /* sm styles */
}

/* Desktop */
@media (min-width: 1024px) {
  /* lg styles */
}

/* Large Desktop */
@media (min-width: 1280px) {
  /* xl styles */
}
```

### 4.4 Prototipos Navegables

#### Flujos de Usuario

1. **Flujo de Exploración → Compra:**
   - Home → Categoría → Producto → Carrito → Checkout
   - Duración estimada: 3-5 minutos
   - Puntos de decisión: 3

2. **Flujo de Búsqueda Directa:**
   - Search → Resultados → Producto → Carrito → Checkout
   - Duración estimada: 2-4 minutos
   - Puntos de decisión: 2

3. **Flujo de Wishlist:**
   - Producto → Wishlist → Comparación → Carrito → Checkout
   - Duración estimada: 5-7 minutos
   - Puntos de decisión: 4

#### Microinteracciones

**Hover Effects:**
- Product cards: Scale + shadow elevation
- Buttons: Color transition + scale
- Links: Underline slide-in

**Loading States:**
- Skeleton screens for content
- Spinner for actions
- Progress bars for multi-step processes

**Feedback:**
- Success: Green check animation
- Error: Red shake animation
- Warning: Orange pulse

## 5. CRONOGRAMA DETALLADO

### Fase 1: Investigación y Análisis (Semana 1)
**Duración**: 5 días
**Entregables**:
- Análisis de competencia
- User research synthesis
- Arquitectura de información
- Wireframes de baja fidelidad

**Hitos diarios:**
- Día 1: Análisis de marca y competencia
- Día 2: User research y entrevistas
- Día 3: Arquitectura de información
- Día 4: Wireframes baja fidelidad
- Día 5: Revisión y validación

### Fase 2: Sistema de Diseño (Semana 2)
**Duración**: 5 días
**Entregables**:
- Design tokens definidos
- Tipografía y colores
- Componentes base
- Iconografía

**Hitos diarios:**
- Día 1: Foundation (colores, tipografía)
- Día 2: Componentes base (botones, forms)
- Día 3: Componentes complejos (cards, navigation)
- Día 4: Iconografía e ilustraciones
- Día 5: Documentación del sistema

### Fase 3: Diseño de Interfaces (Semanas 3-4)
**Duración**: 10 días
**Entregables**:
- Home page completa
- Catálogo con filtros
- Página de producto
- Carrito y checkout

**Hitos semanales:**
- Semana 3: Home y catálogo
- Semana 4: Producto y flujo de compra

### Fase 4: Prototipado y Testing (Semana 5)
**Duración**: 5 días
**Entregables**:
- Prototipos navegables
- Test de usuarios
- Iteraciones basadas en feedback

**Hitos diarios:**
- Día 1: Creación de prototipos
- Día 2: Preparación de test
- Día 3: Testing con usuarios
- Día 4: Análisis de resultados
- Día 5: Iteraciones finales

### Fase 5: Documentación y Handoff (Semana 6)
**Duración**: 5 días
**Entregables**:
- Documentación completa
- Guía de implementación
- Assets organizados
- Reunión de handoff

**Hitos diarios:**
- Día 1: Documentación de componentes
- Día 2: Guía de implementación
- Día 3: Assets y especificaciones
- Día 4: Preparación de handoff
- Día 5: Presentación final

### Puntos de Revisión y Validación

**Revisiones semanales** con stakeholders:
- Viernes de cada semana
- 30-45 minutos
- Feedback documentado
- Decisiones registradas

**Validación de usuario**:
- Test de usabilidad en semana 5
- 5-7 usuarios objetivo
- Tareas específicas del flujo de compra
- Métricas de éxito definidas

**Aprobación final**:
- Reunión de handoff en semana 6
- Todos los stakeholders involucrados
- Documentación firmada
- Plan de implementación acordado

### Recursos Necesarios

**Equipo de diseño**:
- 1 UX/UI Designer (principal)
- 1 UI Designer (apoyo semanas 3-4)
- 1 UX Researcher (semana 1 y 5)

**Herramientas**:
- Figma (diseño y prototipado)
- Maze (testing remoto)
- Notion (documentación)
- Slack (comunicación)

**Presupuesto estimado**:
- Diseño y prototipado: 40 horas
- Testing y iteración: 10 horas
- Documentación: 10 horas
- Total: 60 horas de trabajo especializado

## CONCLUSIÓN

Este plan de diseño UI/UX integral para la integración de WooCommerce con Saprix proporciona:

1. **Un sistema de diseño coherente** que respeta la identidad de marca actual
2. **Flujos de usuario optimizados** para maximizar conversiones
3. **Componentes reutilizables** que aceleran el desarrollo
4. **Documentación exhaustiva** para facilitar la implementación
5. **Un cronograma realista** con hitos claros y revisables

El enfoque está en crear una experiencia de compra fluida, moderna y específicamente adaptada al mercado de futsal, manteniendo la flexibilidad que ofrece la arquitectura headless de WooCommerce.

**Próximos pasos**:
1. Validar el plan con stakeholders
2. Comenzar con la Fase 1 de investigación
3. Configurar el espacio de trabajo en Figma
4. Programar las sesiones de usuario
5. Establecer el canal de comunicación para el proyecto