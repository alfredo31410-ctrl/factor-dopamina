# Factor Dopamina — PRD

## Problem Statement (original, ES)
Plataforma web "Factor Dopamina" (factordopamina.com) para hombres enfocada en mejora personal masculina, motivación, disciplina, enfoque, energía, mentalidad, hábitos, rendimiento, propósito y transformación. Estética: masculina, moderna, futurista, premium, tecnológica, minimalista pero impactante. Paleta: fondo negro/muy oscuro, verde neón #CCFF00 como acento, blanco para contraste. Detalles visuales inspirados en moléculas, conexiones neuronales, líneas tecnológicas.

## Architecture
- **Backend**: FastAPI + Motor (async MongoDB). Single `server.py`. All routes under `/api`.
- **Frontend**: React + React Router + Tailwind + shadcn. Sonner for toasts. Fonts: Outfit (headings) + Manrope (body) + JetBrains Mono (accent).
- **Auth**: JWT (HS256, 12h). httpOnly cookie (samesite=none, secure=true) + `Authorization: Bearer` fallback via localStorage token.
- **Storage**: Emergent Object Storage (EMERGENT_LLM_KEY) for image uploads. Also supports external image URLs.
- **DB collections**: `users`, `courses`, `contact_messages`, `files`.

## Personas
1. **Admin (creador de contenido)** — gestiona cursos desde un panel privado.
2. **Visitante** — navega Home/Cursos/Detalle/Contacto, hace clic en CTA Hotmart, envía mensajes de contacto.

## Core Requirements
- Public marketing site (Home, Cursos, Curso Detail, Contacto).
- Admin panel: login, CRUD cursos (título, descripciones, miniatura, módulos, link Hotmart, estado, destacado).
- Upload de imágenes (object storage) y URLs externas.
- 5+ cursos seed.
- Diseño visual potente y masculino, neón verde sobre negro.

## Implemented (2026-02-15)
- ✅ Backend: auth (login, logout, me), public courses (`GET /api/courses`, `GET /api/courses/{slug}`), admin CRUD (`/api/admin/courses`), image upload (`/api/admin/upload`), file proxy (`/api/files/{path}`), contact (`POST /api/contact`).
- ✅ Admin seeding (idempotent) + 5 courses seed: Disciplina Absoluta, Mentalidad de Acero, Energía Masculina, Enfoque Profundo, Propósito y Dirección.
- ✅ Frontend pages: Home (hero + pillars + featured + community + footer), Cursos (grid), Curso Detail (hero + modules + Hotmart CTA), Contacto (formulario), Admin Login, Admin Dashboard (table + modal editor + image upload + delete).
- ✅ AuthContext + ProtectedRoute.
- ✅ Backend test suite (12/12 passing) at `/app/backend/tests/test_factor_dopamina.py`.

## Prioritized Backlog (next phases)
### P0
- (none) — MVP complete.

### P1
- Newsletter / email capture (Mailchimp / Resend) en Home + Footer.
- Pixel de Meta + Google Analytics para tracking de conversiones a Hotmart.
- Brute-force lockout en login (5 fallos = 15 min).
- Admin: panel de mensajes de contacto (lectura, marcar leído).

### P2
- Blog / Artículos cortos en español para SEO.
- Sistema de testimonios reales con foto.
- Multi-idioma (es/en).
- Cupones/promos editables desde admin.
- Sistema de afiliados (referidos Hotmart).

## Test Credentials
- `admin@factordopamina.com` / `FactorDopamina2026!`
