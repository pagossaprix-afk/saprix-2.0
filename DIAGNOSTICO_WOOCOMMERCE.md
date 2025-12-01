# 🔍 DIAGNÓSTICO: Fallo de Conexión WooCommerce API

**Fecha**: 2025-11-26  
**Proyecto**: Saprix E-commerce Headless  
**Estado**: ❌ **CREDENCIALES SIN PERMISOS DE LECTURA**

---

## 📋 RESUMEN DEL PROBLEMA

La aplicación Next.js no puede conectarse a la API de WooCommerce debido a que las credenciales API actuales **NO tienen permisos de lectura** (`Read`).

### Error Detectado

```json
{
  "code": "woocommerce_rest_cannot_view",
  "message": "Lo siento, no tienes permiso para ver este recurso"
}
```

---

## 🔧 SOLUCIÓN REQUERIDA

### Paso 1: Generar Nuevas Credenciales API en WordPress

Debes acceder al panel de administración de WordPress y crear nuevas credenciales con **permisos de lectura/escritura**:

1. **Accede a WordPress Admin**:
   ```
   https://pagos.saprix.com.co/wp-admin
   ```

2. **Navega a**:
   ```
   WooCommerce → Ajustes → Avanzado → REST API
   ```

3. **Crea una nueva clave API**:
   - **Descripción**: `Saprix Headless Frontend`
   - **Usuario**: Selecciona un usuario con rol de Administrador
   - **Permisos**: **Lectura/Escritura** (Read/Write)
   - Haz clic en **Generar clave API**

4. **Copia las credenciales generadas**:
   - `Consumer Key` (ck_...)
   - `Consumer Secret` (cs_...)

### Paso 2: Actualizar el Archivo `.env.local`

Reemplaza las credenciales en el archivo `.env.local`:

```bash
# WooCommerce API Configuration
NEXT_PUBLIC_WORDPRESS_URL=https://pagos.saprix.com.co
WOOCOMMERCE_API_URL=https://pagos.saprix.com.co

# NUEVAS CREDENCIALES CON PERMISOS DE LECTURA/ESCRITURA
WOOCOMMERCE_CONSUMER_KEY=ck_NUEVA_CLAVE_AQUI
WOOCOMMERCE_CONSUMER_SECRET=cs_NUEVO_SECRET_AQUI
```

### Paso 3: Reiniciar el Servidor de Desarrollo

```bash
# Detener el servidor actual (Ctrl+C en la terminal)
# Luego ejecutar:
npm run dev
```

---

## 📊 ESTADO ACTUAL

### ✅ Configuración Correcta

- [x] Archivo `.env.local` creado
- [x] Variables de entorno configuradas
- [x] Servidor de desarrollo detecta `.env.local`
- [x] URL de WooCommerce correcta: `https://pagos.saprix.com.co`

### ❌ Problemas Identificados

- [ ] **Credenciales sin permisos de lectura**
- [ ] Error 401 Unauthorized en todas las peticiones
- [ ] Página `/productos` no carga (error 500)
- [ ] Homepage sin productos destacados

---

## 🧪 PRUEBA DE CREDENCIALES

Para verificar que las nuevas credenciales funcionan, ejecuta:

```bash
curl "https://pagos.saprix.com.co/wp-json/wc/v3/products?per_page=1&consumer_key=TU_NUEVA_CK&consumer_secret=TU_NUEVO_CS"
```

**Respuesta esperada**: JSON con datos de productos (no error 401)

---

## 📝 CREDENCIALES ACTUALES (SIN PERMISOS)

```
Consumer Key: ck_88721898d82f29e0f8664d7e3316aa460340f587
Consumer Secret: cs_37ebd5161dd1ed62e199570e702fb7d123454569
```

**Problema**: Estas credenciales están configuradas con permisos insuficientes o fueron revocadas.

---

## 🔐 RECOMENDACIONES DE SEGURIDAD

1. **Nunca hardcodear credenciales** en el código fuente
2. **Usar `.env.local`** para desarrollo local
3. **Usar variables de entorno** en producción (Vercel/Netlify)
4. **Rotar credenciales** periódicamente
5. **Eliminar credenciales antiguas** del panel de WordPress

---

## 📞 PRÓXIMOS PASOS

1. ✅ **Acceder a WordPress Admin**
2. ✅ **Generar nuevas credenciales API** con permisos Read/Write
3. ✅ **Actualizar `.env.local`** con las nuevas credenciales
4. ✅ **Reiniciar servidor** (`npm run dev`)
5. ✅ **Verificar** que `/productos` carga correctamente

---

## 🎯 ARCHIVOS AFECTADOS

Los siguientes archivos usan las credenciales de WooCommerce:

- `lib/woocommerce.ts` - Cliente principal
- `lib/woocommerce-edge.ts` - Cliente Edge Runtime
- `app/api/create-order/route.ts` - Creación de pedidos
- `scripts/migrate-tags.ts` - Scripts de migración
- `scripts/migrate-categories.ts`
- `scripts/create-attributes.ts`

**Nota**: Todos estos archivos tienen fallbacks a las credenciales hardcodeadas en `woocommerce-edge.ts`, pero las variables de entorno tienen prioridad.

---

## ✅ VERIFICACIÓN POST-SOLUCIÓN

Después de actualizar las credenciales, verifica:

1. **Homepage** (`http://localhost:3000`):
   - ✅ Productos destacados visibles
   - ✅ Sin errores 401 en consola

2. **Página de Productos** (`http://localhost:3000/productos`):
   - ✅ Catálogo completo visible
   - ✅ Filtros funcionando
   - ✅ Sin error 500

3. **Página de Producto Individual**:
   - ✅ Imágenes cargando
   - ✅ Variaciones (colores/tallas) disponibles
   - ✅ Precio correcto

---

**Generado automáticamente por Antigravity AI**
