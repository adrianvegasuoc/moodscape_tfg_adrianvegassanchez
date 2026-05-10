# Moodscape

Moodscape es una aplicacion web Next.js + TypeScript para transformar emociones,
recuerdos y momentos personales en imagenes generadas con IA.

Este repositorio contiene el MVP funcional del proyecto: autenticacion, generacion
de imagenes, guardado en Supabase, exploracion publica de creaciones y una
interfaz refinada para el flujo principal.

## Estado del MVP

El MVP incluye:

- Acceso publico con login, registro y recuperacion de contrasena.
- Home privada para crear imagenes desde prompts emocionales.
- Validacion basica y moderacion local del prompt antes de generar.
- Generacion de imagenes con OpenAI Images API.
- Subida de imagenes generadas a Supabase Storage.
- Persistencia de creaciones en la tabla `posts`.
- Vista personal `Tu mapa emocional`.
- Vista publica de exploracion y categorias.
- Pagina publica `Descubre Moodscape`.
- Sistema visual global con Inter, variables CSS de color y jerarquia tipografica.

## Stack

- Next.js con App Router
- React
- TypeScript en modo estricto
- Supabase Auth, Database y Storage
- OpenAI Images API
- Vercel como plataforma objetivo de despliegue
- ESLint y typecheck con TypeScript

## Rutas principales

### Publicas

- `/login`
- `/register`
- `/recuperar-password`
- `/actualizar-password`
- `/descubre-moodscape`

### Privadas

- `/`
- `/crear`
- `/dashboard`
- `/mi-mapa-emocional`
- `/perfil`

### Exploracion

- `/explorar`
- `/explorar/[term]`

## Generacion de imagenes

La generacion esta encapsulada en:

```text
services/openai/image-generation.ts
```

Configuracion actual por defecto:

- Modelo: `gpt-image-1`
- Resolucion: `1024x1024`
- Calidad: `medium`
- Formato: `png`

El modelo puede cambiarse con la variable:

```bash
OPENAI_IMAGE_MODEL=gpt-image-1
```

Para desarrollo sin consumir la API de OpenAI se puede activar:

```bash
OPENAI_MOCK_MODE=true
```

## Validacion y moderacion de prompts

La validacion reutilizable esta en:

```text
lib/validation/prompt-validation.ts
```

Actualmente comprueba:

- Prompt obligatorio.
- Longitud maxima de 300 caracteres.
- Normalizacion de mayusculas, espacios, acentos y caracteres de control.
- Lista basica de palabras no permitidas en castellano e ingles.
- Patrones comunes de SQL injection.
- Patrones HTML o scripts basicos.

La validacion se aplica antes de llamar a OpenAI. Esta capa no sustituye a
controles adicionales de seguridad o moderacion en fases posteriores.

## Supabase

Moodscape utiliza Supabase para:

- Autenticacion de usuarios.
- Persistencia de creaciones.
- Almacenamiento de imagenes generadas.

### Tabla esperada

El MVP espera una tabla `public.posts` con estos campos principales:

```text
id uuid
user_id uuid
prompt text
image_url text | null
created_at timestamptz
is_public boolean
```

### Storage

El bucket utilizado para imagenes generadas es:

```text
generated-images
```

Las imagenes se guardan con rutas por usuario y la URL publica se persiste en
`posts.image_url`.

## Variables de entorno

Parte de `.env.example` y crea tu archivo local:

```bash
cp .env.example .env.local
```

Variables disponibles:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

OPENAI_API_KEY=
OPENAI_IMAGE_MODEL=gpt-image-1
OPENAI_MOCK_MODE=false
PORT=3000
```

Notas:

- `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` son necesarias
  para conectar con Supabase.
- `OPENAI_API_KEY` es necesaria para generar imagenes reales.
- `OPENAI_MOCK_MODE=true` permite probar el flujo sin llamar a OpenAI.

## Desarrollo local

Instala dependencias:

```bash
npm install
```

Arranca el entorno de desarrollo:

```bash
npm run dev
```

La aplicacion quedara disponible en:

```text
http://localhost:3000
```

## Verificacion

Comandos principales:

```bash
npm run lint
npm run typecheck
npm run build
```

`npm run build` puede necesitar acceso de red para descargar Inter mediante
`next/font/google` si la fuente no esta cacheada.

## Estructura del proyecto

```text
app/          Rutas y Server Actions de Next.js
components/   Componentes de interfaz reutilizables
lib/          Utilidades de entorno, Supabase, usuario y validacion
services/     Integraciones externas, como OpenAI
types/        Tipos compartidos del dominio y Supabase
public/       Recursos estaticos
```

## Despliegue

El despliegue objetivo es Vercel.

1. Sube el repositorio a GitHub, GitLab o Bitbucket.
2. Importa el proyecto en Vercel.
3. Configura las variables de entorno del proyecto.
4. Verifica que Supabase Auth tenga configuradas las URLs de redireccion.
5. Ejecuta el despliegue.

## Limitaciones conocidas

- La moderacion de prompts es basica y local; puede ampliarse con moderacion
  externa o reglas mas contextuales.
- Las estadisticas personales tienen partes preparadas para evolucionar con
  datos reales mas completos.
- La exploracion se basa en prompts y publicaciones disponibles, sin ranking
  avanzado todavia.
- La recuperacion de contrasena depende de la configuracion de email y limites
  de envio de Supabase.

