# Documentación de Integración Robusta

## 1. Arquitectura General
El sistema utiliza una arquitectura híbrida donde Next.js consume datos de dos fuentes principales:
1.  **WooCommerce (E-commerce)**: Vía `lib/woocommerce.ts` para productos, precios y stock.
2.  **WordPress (Contenido)**: Vía `lib/api/wordpress.ts` para blogs, medios y páginas corporativas.

## 2. Componentes Implementados

### Frontend (Next.js)
*   **`lib/api/wordpress.ts`**: Cliente HTTP optimizado para la REST API de WP. Soporta:
    *   Lectura de Posts con filtrado avanzado.
    *   **Escritura**: Creación de borradores de posts (`createPost`).
    *   **Media**: Subida de imágenes (`uploadMedia`).
*   **`types/wordpress.ts`**: Definiciones TypeScript estrictas para evitar errores de tipo en tiempo de compilación.

### Backend (WordPress)
*   **Saprix Connect Plugin** (`docs/snippets/saprix-connect-v1.php`):
    *   Debe instalarse en `wp-content/plugins/` o `mu-plugins/`.
    *   Maneja CORS para permitir peticiones desde el dominio Headless.
    *   Corrige los enlaces de "Vista Previa" para que apunten al entorno de staging/producción de Next.js.
    *   Expone endpoints personalizados para operaciones masivas (si se desea activar).

## 3. Configuración Requerida

### Variables de Entorno (.env.local)
Asegúrate de tener estas variables configuradas en Vercel/Local:

```bash
NEXT_PUBLIC_WORDPRESS_URL="https://pagos.saprix.com.co"
# Para escritura (Blogs/Media):
WORDPRESS_API_USER="tu_usuario_admin"
WORDPRESS_API_APP_PASSWORD="xxxx xxxx xxxx xxxx" 
# Generar en WP Admin > Usuarios > Perfil > Contraseñas de Aplicación
```

## 4. Ejemplo de Uso (Crear Post desde Next.js)

```typescript
import { createPost, uploadMedia } from "@/lib/api/wordpress";

// 1. Subir imagen
const media = await uploadMedia(fileInput.files[0], "mi-imagen.jpg");

// 2. Crear Post
const newPost = await createPost({
  title: "Mi Nuevo Artículo desde Headless",
  content: "Contenido HTML aquí...",
  status: "draft",
  featured_media: media.id
});
```
