# Bruma, catálogo de perfumes (PWA)

Vite + JavaScript, instalable y con modo sin conexión. Los datos salen de `public/perfumes.json`
o, si lo configuras, de una tabla en Supabase.

## Probar en tu computador
```bash
npm install
npm run dev        # http://localhost:5173
```

## Datos del catálogo
La app se alimenta de la tabla `perfumes` (ver `supabase/schema.sql`), cargada desde tu CSV madre
(`Clasificacion_123_Perfumes.csv`). Equivalencia de columnas:

| CSV | Tabla |
|---|---|
| ID | codigo |
| Marca | brand |
| Nombre | name |
| Flanker / Versión | version |
| Concentración | concentration |
| Género | gender |
| Familia Olfativa | family (y family_main = primera palabra, usada en los filtros) |
| Uso Ideal | usage (y usage_tags = separado por "/", usado en el filtro de uso) |

Sin Supabase, la app usa `public/perfumes.json` (mismos campos, solo los perfumes visibles).

## Lo que falta completar (opcional, desde el panel de Supabase)
- `price` y `size_ml`: si los completas, aparecen en la tarjeta y se activa el orden por precio.
- `image_url`: URL de la foto subida al bucket `perfumes` (Storage > bucket público).
  Recomendado: WebP de unos 600 px de ancho. Sin foto, la app dibuja un frasco con color según la familia.
- `fragrantica_url`: link a la ficha en Fragantica; muestra el botón "Ver en Fragantica".
- `notes_top`, `notes_heart`, `notes_base`: notas por capa (formato `{"Higo verde","Bergamota"}` al importar CSV).
- `visible`: ponlo en `false` para ocultar un perfume sin borrarlo.

## Usar Supabase
1. Copia `.env.example` a `.env` y completa `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`
   (Project Settings > API). La clave anon/publishable es pública por diseño: la seguridad la da la política RLS.
2. Reinicia `npm run dev`.

## Publicar en Cloudflare
Opción A, desde GitHub (recomendada):
1. Sube el proyecto a un repo.
2. En el dashboard de Cloudflare conecta el repo.
   Build command: `npm run build`. Carpeta de salida: `dist`.
3. Agrega las dos variables `VITE_...` en las variables de entorno del build.

Opción B, desde la terminal:
```bash
npm run build
npx wrangler deploy      # usa wrangler.jsonc
```
