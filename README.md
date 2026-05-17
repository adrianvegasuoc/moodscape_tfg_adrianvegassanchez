# Moodscape

Moodscape es una aplicación web desarrollada con Next.js y TypeScript para transformar emociones, recuerdos y momentos personales en imágenes generadas mediante inteligencia artificial.

Este repositorio contiene el MVP funcional del proyecto: autenticación, generación de imágenes, guardado en Supabase, exploración colectiva de creaciones y una interfaz refinada para el flujo principal.

## Estado del MVP

El MVP incluye:

- Acceso público con login, registro y recuperación de contraseña.
- Home privada para crear imágenes desde prompts emocionales.
- Validación básica y moderación local del prompt antes de generar.
- Generación de imágenes con OpenAI Images API.
- Subida de imágenes generadas a Supabase Storage.
- Persistencia de creaciones en la tabla `posts`.
- Vista personal `Tu mapa emocional`.
- Vista de exploración colectiva y categorías.
- Página pública `Descubre Moodscape`.
- Sistema visual global con Inter, variables CSS de color y jerarquía tipográfica.

## Stack

- Next.js con App Router.
- React.
- TypeScript en modo estricto.
- Supabase Auth, Database y Storage.
- OpenAI Images API.
- Vercel como plataforma objetivo de despliegue.
- ESLint y typecheck con TypeScript.

## Rutas principales

### Públicas

- `/login`
- `/register`
- `/recuperar-password`
- `/actualizar-password`
- `/descubre-moodscape`

### Privadas

- `/`
- `/mi-mapa-emocional`

### Exploración

- `/explorar`
- `/explorar/[term]`

### Técnicas

- `/auth/callback`: callback de Supabase Auth para confirmación de email, recuperación de contraseña y creación de sesión.
- `/dashboard`: alias legacy que redirige a `/`.

## Generación de imágenes

La generación está encapsulada en:

```text
services/openai/image-generation.ts
```

## Documentación técnica

La documentación técnica navegable puede generarse con:

```bash
npm run docs
```

La salida se genera en la carpeta `docs/`.
