# Sistema de Búsqueda Inteligente con Caché Local

## 📋 Descripción

Este sistema implementa una búsqueda inteligente de productos que funciona con un caché local, eliminando la dependencia de las credenciales de lectura de WooCommerce y proporcionando búsquedas ultra rápidas.

## 🚀 Características

- ✅ **Búsqueda instantánea**: Los productos se buscan en caché local
- ✅ **Fuzzy matching**: Encuentra productos incluso con errores de escritura
- ✅ **Sin acentos**: Buscar "zapato" encuentra "zapatilla"
- ✅ **Sincronización automática**: Se actualiza cada 24 horas automáticamente
- ✅ **Puntuación de relevancia**: Los resultados se ordenan por relevancia

## 🔧 Endpoints

### `/api/sync-products`
Sincroniza todos los productos de WooCommerce al caché local.

**Método**: GET  
**Respuesta**:
```json
{
  "success": true,
  "message": "Successfully synced 150 products",
  "totalProducts": 150,
  "lastSync": "2025-11-28T07:14:27.011Z"
}
```

### `/api/search?q={query}&per_page={limit}`
Busca productos en el caché local.

**Parámetros**:
- `q`: Término de búsqueda (mínimo 3 caracteres)
- `per_page`: Número de resultados (1-20, default: 6)

**Respuesta**:
```json
{
  "productos": [
    {
      "id": 123,
      "nombre": "Zapatilla Futsal Pro",
      "slug": "zapatilla-futsal-pro",
      "precio": "150000",
      "imagen": "https://..."
    }
  ],
  "categorias": [...],
  "paginas": [...],
  "totalResults": 5,
  "cacheInfo": {
    "lastSync": "2025-11-28T07:14:27.011Z",
    "totalProducts": 150
  }
}
```

### `/api/cron/sync`
Endpoint protegido para sincronización automática vía cron.

**Headers requeridos**:
```
Authorization: Bearer {CRON_SECRET}
```

## ⚙️ Configuración

### Variables de Entorno

Agrega estas variables a tu archivo `.env.local`:

```env
# URL del sitio (para cron jobs)
NEXT_PUBLIC_SITE_URL=https://tu-sitio.com

# Secret para proteger el endpoint de cron
CRON_SECRET=tu-secret-super-seguro-aqui
```

### Sincronización Automática

El sistema se sincroniza automáticamente de dos formas:

1. **Vercel Cron** (en producción): Configurado en `vercel.json` para ejecutarse diariamente a las 2 AM
2. **Auto-sync en búsqueda**: Si el caché tiene más de 24 horas, se sincroniza automáticamente en segundo plano

## 📁 Estructura de Archivos

```
app/
├── api/
│   ├── sync-products/
│   │   └── route.ts          # Sincroniza productos de WooCommerce
│   ├── search/
│   │   └── route.ts          # Búsqueda en caché local
│   └── cron/
│       └── sync/
│           └── route.ts      # Endpoint para cron jobs
data/
└── products-cache.json       # Caché de productos (auto-generado)
vercel.json                   # Configuración de cron jobs
```

## 🔄 Sincronización Manual

Para sincronizar manualmente los productos:

1. **En desarrollo**:
   ```bash
   curl http://localhost:3001/api/sync-products
   ```

2. **En producción**:
   ```bash
   curl https://tu-sitio.com/api/sync-products
   ```

## 🧪 Pruebas

### Probar búsqueda:
```bash
curl "http://localhost:3001/api/search?q=zapato&per_page=5"
```

### Probar cron (requiere CRON_SECRET):
```bash
curl -H "Authorization: Bearer tu-secret" http://localhost:3001/api/cron/sync
```

## 📊 Algoritmo de Búsqueda

El sistema usa un algoritmo de fuzzy matching que:

1. **Normaliza el texto**: Elimina acentos y convierte a minúsculas
2. **Coincidencia exacta**: 100 puntos
3. **Todas las palabras**: 80 puntos
4. **Coincidencia parcial**: 60 puntos proporcional
5. **Fuzzy character-by-character**: 40 puntos proporcional

Solo se muestran resultados con puntuación > 20.

## 🚀 Despliegue en Vercel

1. Asegúrate de que `vercel.json` esté en la raíz del proyecto
2. Configura `CRON_SECRET` en las variables de entorno de Vercel
3. El cron job se ejecutará automáticamente cada día a las 2 AM

## 🔒 Seguridad

- El endpoint `/api/cron/sync` está protegido con un secret
- El caché se guarda localmente y no se expone públicamente
- Las credenciales de WooCommerce solo se usan en el servidor

## 📝 Notas

- El caché se regenera automáticamente si tiene más de 24 horas
- Si el caché no existe, se crea automáticamente en la primera búsqueda
- El archivo `data/products-cache.json` está en `.gitignore`
