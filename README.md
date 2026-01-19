# Saprix Ecommerce 2.0 - Headless

Este proyecto es la versión headless del ecommerce de Saprix, construida con Next.js y Tailwind CSS, consumiendo datos desde WooCommerce.

## 🚀 Implementaciones Recientes

### Widget de Chat de WhatsApp Inteligente
Hemos implementado un widget de chat personalizado y altamente funcional para mejorar la conversión y la atención al cliente.

**Características Principales:**
-   **Diseño "Clean UI"**: Estética minimalista estilo iOS, con ancho fijo de 400px en escritorio y full-width en móviles.
-   **Context-Aware (Chat Contextual)**: El widget detecta cuando el usuario está viendo un producto específico.
    -   Incluye un botón **"Consultar disponibilidad"** en las páginas de producto.
    -   Al abrirse, pre-llena el mensaje con: *"Hola, estoy viendo [Nombre Producto]..."*.
-   **Carrusel de Productos Integrado**: Muestra productos destacados reales directamente dentro de la ventana del chat.
-   **Automatización**: Apertura automática a los 4 segundos para captar la atención (configurable).
-   **Branding**: Personalizado con el logo de Saprix y título "Chatprix".

**Componentes Clave:**
-   `components/ui/WhatsAppButton.tsx`: Componente principal del widget.
-   `components/context/ChatContext.tsx`: Contexto global para manejar el estado del chat y la inyección de datos de productos.
-   `app/layout.tsx`: Provider global (`ChatProvider`).

### Integración de Contexto Global
Se creó un sistema de estado global usando React Context API (`ChatContext`) para permitir que cualquier componente de la aplicación interactúe con el widget de chat (abrir, cerrar, enviar datos).

## 🛠️ Stack Tecnológico

-   **Framework**: Next.js 14+ (App Router)
-   **Estilos**: Tailwind CSS
-   **Iconos**: React Icons (`react-icons`), Lucide React (`lucide-react`)
-   **Animaciones**: Framer Motion
-   **Backend**: WooCommerce (Headless via API REST)

## 📦 Instalación y Ejecución

1.  **Instalar dependencias:**
    ```bash
    npm install
    # o
    bun install
    ```

2.  **Correr servidor de desarrollo:**
    ```bash
    npm run dev
    # o
    bun run dev
    ```

    Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📁 Estructura de Carpetas Clave

-   `/app`: Rutas y páginas (App Router).
-   `/components`: Componentes reutilizables.
    -   `/ui`: Elementos de interfaz generales (Botones, Inputs, Widget de WhatsApp).
    -   `/product`: Componentes específicos de producto.
    -   `/context`: Contextos globales (Cart, Chat, Wishlist).
-   `/lib`: Utilidades y configuraciones (WooCommerce API).
