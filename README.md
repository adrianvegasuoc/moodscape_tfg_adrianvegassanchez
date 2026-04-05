# Moodscape

Base tecnica inicial para el MVP de Moodscape, una aplicacion web orientada a la expresion emocional mediante arte generativo basado en IA.

## Stack

- Next.js con App Router
- TypeScript en modo estricto
- Vercel como plataforma de despliegue objetivo
- Supabase para autenticacion, base de datos y storage
- Estructura preparada para futura integracion con OpenAI API

## Estructura

```text
app/
components/
lib/
services/
types/
public/
```

## Instalacion

Instala las dependencias del proyecto con:

```bash
npm install
```

## Desarrollo local

Arranca el entorno de desarrollo con:

```bash
npm run dev
```

La aplicacion quedara disponible en `http://localhost:3000`.

## Variables de entorno

Parte de `.env.example` y crea tu archivo `.env.local`:

```bash
cp .env.example .env.local
```

Variables disponibles en esta base:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY`

Completa las que necesites segun la fase del proyecto. Para la integracion con Supabase, las dos variables `NEXT_PUBLIC_*` seran las primeras obligatorias.

## Despliegue en Vercel

1. Sube el repositorio a GitHub, GitLab o Bitbucket.
2. Importa el proyecto en Vercel.
3. Configura las mismas variables de entorno del archivo `.env.local` dentro del panel de Vercel.
4. Ejecuta el despliegue.

Vercel detectara automaticamente que se trata de un proyecto Next.js y utilizara la configuracion adecuada por defecto.

Tambien puedes desplegarlo con la CLI de Vercel:

```bash
vercel
```

## Verificacion

```bash
npm run lint
npm run typecheck
npm run build
```
