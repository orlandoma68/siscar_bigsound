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

Seed is idempotent - safe to run multiple times. Extra flags: `npm run seed -- --reset` (delete the two seed users first) and `npm run seed -- --promote <email>` (promote an existing user to ADMIN).

## Environment variables

### Backend (`back/.env`) - gitignored
`DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `JWT_SECRET`, `JWT_EXP`, `JWT_COOKIE_EXP`

### Frontend (`front/.env`) - gitignored
`VITE_URL_SERVER` (backend API, default `http://localhost:3000`), `VITE_FIREBASE_*` (Firebase config), `VITE_WHATSAPP_NUMBER` (WhatsApp del negocio en formato internacional sin espacios ni `+`, ej. `51999999999`; si está vacío, `BotonWhatsApp.jsx` no se renderiza).

## Architecture

- **Express 5** (not 4) - affects route parameter syntax and error handling.
- **Auth flow**: Firebase Auth (frontend) + MySQL roles (backend). On register/login, frontend also calls backend to sync user in MySQL and get JWT with role.
- **Role enforcement**: `AdminLayout` checks `rol` from backend. Only ADMIN users can access `/admin/*`. Backend routes use `verificarToken` + `verificarAdmin` middleware.
- **State**: React Context only, nested `ProductoContext` -> `AuthContext` -> `CarritoContext` in `App.jsx`. Only `AuthContext` and `CarritoContext` are consumed by components; `ProductoContext` is wired up but never consumed.
- **File uploads**: Multer saves to `back/src/uploads/`, served at `/uploads`.
- **Language**: Codebase is in Spanish (variable names, routes, comments).
- **MVC pattern**: `routes/` -> `controllers/` -> `models/` -> DB pool.
- **Delete confirmations**: `front/src/components/ModalConfirmar.jsx` is a reusable Bootstrap confirm modal (props: `id`, `titulo`, `mensaje`, `textoConfirmar`, `onConfirmar`). Used by admin pages (`ShowProductsPage.jsx`, `ContactosPage.jsx`); no native `window.confirm` remains in `pages/admin`.
- **Categories**: there is NO categories table - the navbar dropdown (`Modalinicio.jsx`) derives unique categories from product `categoria` values via `pedirProductosCategoriaUnicos` (dedupes on `trim().toLowerCase()`). It opens on click and closes on outside click/Escape. Selecting one routes to `/category/:categoria` -> `Listproducts.jsx`, which filters with `pedirProductosCategoria` (also case/whitespace-normalized). `Listproducts`'s `useEffect` depends on `[categoria]` so switching categories re-filters without a reload.

## Gotchas

- `front/deploy.sh` is a GitHub Actions YAML workflow, not a shell script.
- Backend routes `/registrar`, `/actualizar/:id`, `/delete/:id` are shared by products and users.
- Frontend uses Bootstrap 5 via CDN, not installed as npm dependency.
- Roles seed automatically on server startup (ADMIN=1, CLIENT=2) via `INSERT IGNORE` in `index.js`.
- **Broken Google-role calls**: `front/src/context/AuthContext.jsx` fetches `${VITE_URL_SERVER}/sincronizar-google` and `/verificar-rol` WITHOUT the `/usuarios` prefix, but the backend mounts those routes at `/usuarios/*` (`back/src/routes/routesUsuario.js`). Both calls 404 today; Google sign-in never syncs the user to MySQL. If fixing, change the frontend URLs, not the backend mount.
- **Response-shape mismatch**: `ProductoContext.obtenerProductos` stores the raw JSON body (`setProductos(data)`), while `pedirProductos()` in `front/src/js/pedirProductos.js` returns `result.data` and is what `Listproducts.jsx`/`ShowProductsPage.jsx`/`Modalinicio.jsx` actually use.
- `back/src/uploads/*` images are tracked in git. Product rows store only the filename in `imagen`; the frontend renders them as `${VITE_URL_SERVER}/uploads/<imagen>`.
- **Deploy mismatch**: `front/package.json` `homepage` says `orlandoma68.github.io/sitemcar/` but the git remote is `orlandoma68/siscar_bigsound`; `vite.config.js` sets no `base`, so `npm run build` emits absolute `/assets/*` paths (breaks on GitHub Pages subpath hosting).
- Root `package-lock.json` is an empty stub (no root `package.json`); ignore it and run npm inside `back/` or `front/`.
