# AGENTS.md

## Project overview

**Siscar** - product catalog & shopping cart for car-related products. Two independent apps (no monorepo tooling, no shared root `package.json`):

- `back/` - Express REST API (Node.js, **CommonJS**)
- `front/` - React SPA (Vite 7, **ES modules**)

Each must be installed and run separately (`cd back && npm install` / `cd front && npm install`).

## Commands

### Backend (`back/`)
```
npm install          # install deps
npm run dev          # start with nodemon (port 3000)
npm start            # production start (node)
npm run seed         # seed admin + client users into MySQL
```
No lint, test, or typecheck scripts exist.

### Frontend (`front/`)
```
npm install          # install deps
npm run dev          # Vite dev server
npm run build        # production build -> dist/
npm run lint         # ESLint 9 (flat config)
npm run preview      # preview production build
npm run deploy       # gh-pages deploy
```
No test scripts exist.

## Database

MySQL required. Schema in `back/src/config/tblproductos.sql` defines 3 tables:
- `tblproductos` (product catalog)
- `tblusuarios` (users, FK -> tblroles)
- `tblroles` (ADMIN=1, CLIENT=2)

DB connection via env vars in `back/.env`.

### Seed users
Run `npm run seed` in `back/` to create:
- **Admin**: `admin@siscar.com` / `admin123` (ADMIN role, can access `/admin/*`)
- **Client**: `cliente@siscar.com` / `cliente123` (CLIENT role, denied from admin panel)

Seed is idempotent - safe to run multiple times.

## Environment variables

### Backend (`back/.env`) - gitignored
`DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `JWT_SECRET`, `JWT_EXP`, `JWT_COOKIE_EXP`

### Frontend (`front/.env`) - gitignored
`VITE_URL_SERVER` (backend API, default `http://localhost:3000`), `VITE_FIREBASE_*` (Firebase config)

## Architecture

- **Express 5** (not 4) - affects route parameter syntax and error handling.
- **Auth flow**: Firebase Auth (frontend) + MySQL roles (backend). On register/login, frontend also calls backend to sync user in MySQL and get JWT with role.
- **Role enforcement**: `AdminLayout` checks `rol` from backend. Only ADMIN users can access `/admin/*`. Backend routes use `verificarToken` + `verificarAdmin` middleware.
- **State**: React Context only - `ProductoContext` -> `AuthContext` -> `CarritoContext`.
- **File uploads**: Multer saves to `back/src/uploads/`, served at `/uploads`.
- **Language**: Codebase is in Spanish (variable names, routes, comments).
- **MVC pattern**: `routes/` -> `controllers/` -> `models/` -> DB pool.

## Gotchas

- `front/deploy.sh` is a GitHub Actions YAML workflow, not a shell script.
- Backend routes `/registrar`, `/actualizar/:id`, `/delete/:id` are shared by products and users.
- Frontend uses Bootstrap 5 via CDN, not installed as npm dependency.
- Roles seed automatically on server startup (ADMIN=1, CLIENT=2) via `INSERT IGNORE` in `index.js`.
