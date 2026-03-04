# AURA WEALTH — Development Brain

## Project Identity
- **Name**: Aura Wealth — Tableau de Bord Patrimonial
- **Type**: Interactive multi-user wealth management dashboard (France-specific)
- **Methodology**: UI-First → Interactive Multi-Tenant
- **Source of truth**: `aura-maquette.html` (interactive prototype — DO NOT MODIFY)
- **PRD**: `aura-wealth-prd-v1.1.docx` (DO NOT MODIFY)
- **Backlog**: `aura-wealth-backlog.json` (82 user stories, 8 sprints — update status only)

## Project Phase

### Completed (S1–S4): Read-Only Dashboard
59 stories done. All 5 tabs fully implemented with API-driven data, glassmorphism UI, responsive layout, WebGL particles, mock AI chat.

### Current (S5–S8): Interactive Multi-Tenant App
23 stories pending. Adding: authentication, multi-tenant data isolation, CRUD forms, document upload/parsing, sections hide/show, recalcul automatique, onboarding.

## Tech Stack

### Backend (Python)
- **Framework**: FastAPI (async, lightweight, OpenAPI auto-docs)
- **Python version**: 3.12+
- **Package manager**: uv (pyproject.toml)
- **Database**: MongoDB 7 via Motor (async driver), graceful fallback to mock data if unavailable
- **Auth**: JWT (python-jose) + bcrypt (passlib)
- **Structure**: Feature-based modules under `/backend/app/`
- **API prefix**: `/api/v1/`
- **CORS**: Allow frontend origin
- **Serving**: Uvicorn behind Docker
- See `backend/CLAUDE.md` for backend-specific conventions.

### Frontend (React)
- **Framework**: React 18 + Vite (NOT Next.js — we use Python backend, no SSR needed)
- **Styling**: Tailwind CSS 3 (configured with custom design tokens)
- **3D**: Three.js (WebGL particle background)
- **Fonts**: Google Fonts — Cormorant Garamond (display) + DM Sans (body)
- **Language**: TypeScript (.tsx)
- **State**: React Context (NavigationContext, AiChatContext, AuthContext, ToastContext)
- **Routing**: React Router v6 (5 tab views + auth pages + documents + historique)
- **HTTP client**: fetch via `apiFetch<T>()` wrapper with JWT header
- **Structure**: Feature-based under `/frontend/src/`
- See `frontend/CLAUDE.md` for frontend-specific conventions.

### Infrastructure
- **Containerization**: Docker + docker-compose (3 services: mongo + backend + frontend)
- **Frontend build**: Vite → static → served by Nginx in Docker
- **Backend**: Python container with uvicorn
- **Database**: MongoDB 7 container with volume persistence
- **File storage**: Docker volume `/data/uploads/{user_id}/` for documents
- **Ports**: Frontend :5173 (dev) / :80 (prod), Backend :8000, MongoDB :27017

## Architecture

```
aura-wealth/
├── CLAUDE.md                          # This file — project identity, stack, architecture
├── backend/
│   ├── CLAUDE.md                      # Backend conventions (auth, DB, CRUD, parsers)
│   ├── Dockerfile
│   ├── pyproject.toml
│   └── app/
│       ├── main.py                    # FastAPI app, lifespan
│       ├── config.py                  # Settings
│       ├── database.py                # Motor client
│       ├── dependencies.py            # get_current_user (JWT)
│       ├── models/                    # Pydantic schemas (common, user, patrimoine, 5 domains, document, audit, alert)
│       ├── routers/                   # API endpoints (auth, 5 domains, documents, audit, alerts, ai_chat)
│       ├── services/                  # Business logic (patrimoine, recalcul, alerts, storage, parsers/)
│       └── data/                      # mock_data.py + seed.py
├── frontend/
│   ├── CLAUDE.md                      # Frontend conventions (design system, interactions, components)
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── vite.config.ts                 # proxy /api/* → http://localhost:8000
│   └── src/
│       ├── types/                     # TS interfaces (mirror Pydantic, camelCase)
│       ├── api/client.ts              # apiFetch<T>() with JWT
│       ├── context/                   # Navigation, AiChat, Auth, Toast
│       ├── hooks/                     # useApiData, useMutation, 5 domain hooks, useDocuments, useAuditLog, useAlerts
│       └── components/                # auth/, layout/, shared/, webgl/, ai/, onboarding/, wizard/, documents/, historique/, dashboard/, epargne/, bourse/, immobilier/, private-equity/
└── .claude/
    └── commands/                      # Slash commands
        ├── implement.md               # /implement — implement a user story
        ├── backlog.md                 # /backlog — show backlog status
        └── lessons.md                 # /lessons — show lessons learned
```

## Database Structure (MongoDB — Multi-Tenant)

```
aura_wealth (database)
├── users                  { _id, email, hashed_password, nom, prenom, preferences, onboarding_completed }
│                          Index: { email: 1 } unique
├── patrimoine_data        { _id, user_id, domain, data: {...}, updated_at }
│                          Index: { user_id: 1, domain: 1 } unique
├── documents              { _id, user_id, type, filename, storage_path, status, parsed_values, ... }
│                          Index: { user_id: 1, upload_date: -1 }
├── upload_history         { _id, user_id, document_id, action, timestamp, details }
│                          Index: { user_id: 1, timestamp: -1 }
└── audit_log              { _id, user_id, action, domain, field, old_value, new_value, source, timestamp }
                           Indexes: { user_id: 1, timestamp: -1 }, { user_id: 1, domain: 1 }
```

### Data Isolation Rules
- **EVERY query** on patrimoine_data, documents, upload_history, audit_log MUST filter by `user_id`
- `user_id` comes from `get_current_user` middleware (JWT), NEVER from request body
- A user can NEVER see, modify, or delete another user's data
- Seed creates a demo user (demo@aura.fr / demo1234) with 5 patrimoine documents

## Sprint Plan (8 × 1 week)
1. **S1 → MVP0**: Skeleton + Dashboard (US-001 to US-014) — DONE
2. **S2 → MVP1**: Epargne + Bourse + UX (US-020 to US-040) — DONE
3. **S3 → MVP1**: Immobilier + PE (US-050 to US-064) — DONE
4. **S4 → Pilote**: AI mock + Responsive + Polish (US-070 to US-083) — DONE
5. **S5 → MVP2**: Auth + Multi-tenant + UI Components (US-100 to US-103)
6. **S6 → MVP3**: CRUD API + Inline Edit + Forms (US-110 to US-116)
7. **S7 → MVP4**: Documents Upload/Parsing + Sections Hide/Show (US-120 to US-126)
8. **S8 → MVP5**: Recalcul + Audit Log UI + Onboarding + Alerts (US-130 to US-134)

## Global Code Conventions
- **Language**: All code in English. All user-facing text in French.
- **Components**: One component per file, named PascalCase matching filename.
- **Files**: kebab-case for directories, PascalCase for components.
- **Types**: Shared TypeScript interfaces in `types/`, mirroring backend Pydantic models.
- **API responses**: Camel case JSON (FastAPI `alias_generator=to_camel`).
- **Mock data**: Single source of truth in `backend/app/data/mock_data.py`.
- **Formatting**: All French numbers via `formatEur()`/`formatPct()` from `@/utils/format` — never inline `toLocaleString`.

### CamelCase Pitfall
Pydantic's `to_camel` capitalizes the letter after EVERY `_`, including digits.
- `projection_10ans` → `projection10Ans` (NOT `projection10ans`)
- `economie_per_10k` → `economiePer10K` (NOT `economiePer10k`)
- **Rule**: When adding a Pydantic field with a number, verify the camelCase output and match it exactly in TypeScript types.

## What NOT to Do
- Do NOT use Next.js (Python backend, React+Vite frontend).
- Do NOT use CSS-in-JS (styled-components, emotion). Use Tailwind.
- Do NOT implement real AI/LLM calls (mock responses only).
- Do NOT change the design. The maquette is the contract.
- Do NOT use Redux or Zustand (Context is sufficient).
- Do NOT add i18n (French only, hardcoded).
- Do NOT store passwords in plain text. Always bcrypt.
- Do NOT trust user-supplied IDs for data access. Always filter by JWT user_id.
- Do NOT write directly to DB in routers. Use `services/patrimoine.py` for all writes.
- Do NOT skip ConfirmDialog before any write/delete/reset action.

## Quality Gates
- **Visual fidelity**: ≥95% match to `aura-maquette.html` on 375px/768px/1280px.
- **Performance**: Lighthouse >80, WebGL >30fps on mobile.
- **TypeScript**: Strict mode, no `any` types.
- **Backend**: Pydantic validation on all endpoints, 100% type coverage.
- **Docker**: `docker-compose up` must bring up working app in <30s.
- **Data isolation**: No cross-user data leak — test with 2 users minimum.
- **Confirmation**: Every destructive or write action requires a ConfirmDialog popup.

## Docker Configuration
```yaml
services:
  mongo:
    image: mongo:7
    ports: ["27017:27017"]
    volumes: [mongo_data:/data/db]
    healthcheck:
      test: mongosh --eval "db.adminCommand('ping')" --quiet
  backend:
    build: ./backend
    ports: ["8000:8000"]
    environment:
      - MONGODB_URI=mongodb://mongo:27017/aura_wealth
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      mongo: { condition: service_healthy }
    volumes: [uploads_data:/data/uploads]
  frontend:
    build: ./frontend
    ports: ["80:80"]
    depends_on: [backend]
volumes:
  mongo_data:
  uploads_data:
```

## Mock Data Values (from maquette — EXACT)
- Patrimoine Brut: 1 465 800 € / Net: 1 045 800 € / Projection: 1 785 000 €
- CRD: 420 000 € / Endettement: 24.5% / Capacité: ~150 000 €
- Locatif: 16 800 €/an, 1 400 €/mois / Cash-flow: +850 €/mois
- TMI: 30% / IR: 12 500 € / PS: 1 200 € / TF: 2 800 € / Total: 16 500 €
- Epargne: 86 350 € / Livret A: 22 950 € / LDDS: 12 000 €
- PER: 45 100 € / PERCOL: 18 300 € / Retraite: 63 400 €
- PEA: 84 200 € (+12.4%) / Crypto: 32 800 € (+28.7%)
- Immo: 1 250 000 € / PE: 25 000 € investi, 26 150 € valo, 1.05x TVPI

## Useful Commands
```bash
cd frontend && npm run dev                              # Vite dev :5173
cd backend && uvicorn app.main:app --reload --port 8000 # API :8000
docker-compose up --build                               # Full stack
cd backend && python -m pytest                          # Tests
cd frontend && npm run build                            # Type check + build
```

## Slash Commands
```
/implement              # Auto-pick & implement next eligible story (9-step workflow)
/implement US-110       # Implement a specific story
/backlog                # Show backlog status dashboard
/backlog S5             # Show a specific sprint
/lessons                # Show all lessons learned
/lessons pitfall        # Filter by category
/lessons --sprint S1    # Filter by sprint
/lessons --stats        # Statistics dashboard
```

## Lessons Learned System
See `lessons-learned.json`. Categories: pattern, pitfall, fix, perf, design, tooling, refactor. Severity: high (must-follow), medium, low. Min 1 / max 5 per story. Read ALL before starting a story. High severity = NON-NEGOTIABLE.
