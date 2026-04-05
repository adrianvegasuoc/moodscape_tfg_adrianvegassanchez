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

## Variables de entorno

Parte de `.env.example` y crea tu archivo `.env.local`:

```bash
cp .env.example .env.local
```

Variables necesarias:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY`

## Desarrollo

```bash
npm run dev
```

## Verificacion

```bash
npm run lint
npm run typecheck
npm run build
```
