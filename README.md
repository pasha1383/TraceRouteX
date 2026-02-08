# TraceRouteX

Monorepo containing the backend (Express + TypeORM) and frontend (Next.js) for TraceRouteX.

## Getting Started

1) Install dependencies for both apps:

- npm run install:all

2) Run both backend and frontend together (from repo root):

- npm run dev

This will start:
- Backend on http://localhost:5000 (PORT configurable via backend/.env)
- Frontend on http://localhost:3000

## Other Scripts

- npm run build — builds both apps
- npm run start — starts both apps in production mode (assumes build already done)
