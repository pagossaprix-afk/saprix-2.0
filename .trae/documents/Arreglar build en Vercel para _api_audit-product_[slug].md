## Causa raíz
- El error viene de `@woocommerce/woocommerce-rest-api`: requiere la opción `url` y falla con “Options Error: url is required” cuando falta.
- En `lib/woocommerce.ts` se instancia el cliente WooCommerce con `process.env.WOOCOMMERCE_API_URL`, `WOOCOMMERCE_CONSUMER_KEY` y `WOOCOMMERCE_CONSUMER_SECRET`. Si no están presentes en el entorno de build, la instancia se evalúa en import y rompe el proceso de “Collecting page data”.
- En local existen en `.env.local`; en Vercel probablemente no están configuradas para `Production`/`Preview`.

## Cambios de código propuestos
1. **Inicialización diferida del cliente WooCommerce**
   - Reemplazar la instancia global por una factoría segura:
     - En `lib/woocommerce.ts`, exportar `getWooApi()` que valida `url`, `consumerKey`, `consumerSecret` y crea `new API(...)` sólo cuando se llama.
     - Mantener utilidades (`getProductBySlug`, `getProductVariations`, etc.) pero internamente obtener el cliente con `const api = getWooApi()`.
   - Beneficio: evita ejecutar `new API(...)` en tiempo de import durante el build y permite errores controlados si falta configuración.

2. **Actualizar consumidores**
   - Sustituir `import api from '@/lib/woocommerce'` por llamadas internas a `getWooApi()` en:
     - `app/api/audit-product/[slug]/route.ts`
     - `app/page.tsx` y cualquier otra página/endpoint que usa `api.get(...)`.

3. **Manejo de errores robusto**
   - Si faltan variables, devolver respuesta coherente:
     - En endpoints API: `500` con mensaje claro “WooCommerce no configurado”.
     - En páginas: fallback a listas vacías y logs de servidor, evitando romper el build.

4. **Opcional (si se requiere evitar prerendering de datos WooCommerce)**
   - Añadir `export const dynamic = 'force-dynamic'` sólo en páginas que dependen fuertemente de WooCommerce y no necesitan SSG. Preferir la inicialización diferida antes que volver dinámicas todas las páginas.

## Configuración en Vercel
- Crear variables en Project → Settings → Environment Variables para `Production` y `Preview`:
  - `WOOCOMMERCE_API_URL`
  - `WOOCOMMERCE_CONSUMER_KEY`
  - `WOOCOMMERCE_CONSUMER_SECRET`
- Gatillar redeploy para que el build tenga acceso a ellas.

## Verificación
1. **Local**
   - Con `.env.local` presente, ejecutar `npm run build` y confirmar que no aparece “url is required”.
   - Revisar páginas clave: `app/page.tsx`, `app/producto/[slug]/page.tsx` y el endpoint `GET /api/audit-product/[slug]` con un `slug` válido.
2. **Vercel**
   - Redeploy del proyecto; verificar logs del build: debe compilar, ejecutar TypeScript y completar “Collecting page data” sin errores.
   - Probar el endpoint `GET /api/audit-product/{slug}` en Preview/Production.

## Entregables
- Refactor en `lib/woocommerce.ts` con `getWooApi()` y validación de env.
- Actualización de consumidores en rutas y páginas.
- Manejo de errores consistente.
- Verificación del build local y despliegue exitoso en Vercel.

¿Confirmas que proceda con estos cambios y la configuración en Vercel?