# AGENTS.md

## Project overview

**Siscar** - product catalog & shopping cart for car-related products. Two independent apps (no monorepo tooling, no shared root `package.json`):

- `back/` - Express REST API (Node.js, **CommonJS**)
- `front/` - React SPA (Vite 7, **ES modules**)

Each must be installed and run separately (`cd back && npm install` / `cd front && npm install`). Codebase is Spanish (variable names, routes, comments).

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
npm run deploy       # gh-pages -d dist
```
No test scripts exist.

## Database

MySQL required. Schema in `back/src/config/tblproductos.sql` defines 6 tables:
- `tblproductos` (product catalog; `descripcion` is `TEXT`)
- `tblusuarios` (users, FK -> tblroles)
- `tblroles` (ADMIN=1, CLIENT=2)
- `tblpedidos` + `tblpedidos_detalle` (orders; detail snapshots `codigo`, `nombre`, `precio`, `cantidad` at purchase time)
- `tblcontactos` (contact messages)

DB connection via env vars in `back/.env`. On startup, `back/src/index.js` auto-creates/alters the order + contact tables and idempotently adds missing columns (`tipo_envio`/`metodo_pago`/`direccion` on `tblpedidos`, `codigo` on `tblpedidos_detalle`), so new columns are applied just by restarting the server. Manual migration files also live in `back/src/config/` (`migracion_descripcion_text.sql`, `migracion_pedido_codigo.sql`). Roles also seed on startup (ADMIN=1, CLIENT=2) via `INSERT IGNORE`.

### Seed users
Run `npm run seed` in `back/` to create:
- **Admin**: `admin@siscar.com` / `admin123` (ADMIN role, can access `/admin/*`)
- **Client**: `cliente@siscar.com` / `cliente123` (CLIENT role, denied from admin panel)

Seed is idempotent - safe to run multiple times. Extra flags: `npm run seed -- --reset` (delete the two seed users first) and `npm run seed -- --promote <email>` (promote an existing user to ADMIN).

## Environment variables

### Backend (`back/.env`) - gitignored
`DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `JWT_SECRET`, `JWT_EXP`, optional `PORT`. (`JWT_COOKIE_EXP` sits in `.env` but no code reads it.)

Auto-admin at registration: `ADMIN_EMAIL` (exact email(s), comma-separated) and `ADMIN_DOMAIN` (corporate domain(s) without `@`, comma-separated) make a new user born as ADMIN (else CLIENT). Applied in `rolNuevoUsuario()` (`back/src/controllers/controllersUsuario.js`) on both classic register and Google sign-in creation - only at creation time, does not promote existing users. If both are empty/omitted every new user is CLIENT.

Password reset (forgot password) reads `FRONT_URL` (default `http://localhost:5173`, used to build the reset link) and SMTP vars `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` via `back/src/services/emailService.js`. If `SMTP_HOST` is empty the email is NOT sent: the controller returns the reset link as `enlace` in the API response (dev fallback). Reset tokens are JWTs valid 30 min; routes `POST /usuarios/olvidar-password` and `POST /usuarios/restablecer-password`.

### Frontend (`front/.env`) - gitignored
- `VITE_URL_SERVER` (backend API, default `http://localhost:3000`)
- Firebase vars consumed by `front/src/js/config.js` (note the non-standard, typo'd names - copy them exactly): `VITE_FIREBASE_APIKEY`, `VITE_FIREBASE_AUTDOMAIN`, `VITE_FIREBASE_PROJECTID`, `VITE_FIREBASE_STORAGEBUCKET`, `VITE_FIREBASE_MESSAGINGSENDERID`, `VITE_FIREBASE_APPID`, `VITE_FIREBASE_MEASUREMENTID`
- `VITE_WHATSAPP_NUMBER` (WhatsApp del negocio en formato internacional sin espacios ni `+`, ej. `51999999999`; si está vacío, `BotonWhatsApp.jsx` no se renderiza)

## Architecture

- **Express 5** (not 4) - affects route parameter syntax and error handling.
- **MVC pattern**: `routes/` -> `controllers/` -> `models/` -> DB pool.
- **Auth flow**: Firebase Auth (frontend) + MySQL roles (backend). Login and Google sign-in return a JWT with role; register only creates the user (no token, redirects to `/auth/login`). The frontend stores the JWT in `localStorage` (`token`) and sends it as `Authorization: Bearer ...`. The backend sets NO cookies - `cookie-parser` and the `req.cookies.jwt` read in `middlewares/auth.js` are vestigial (JWT flows via the header only).
- **Role enforcement**: `AdminLayout` only requires a logged-in user with any non-null `rol`; the real ADMIN gate is server-side (`verificarToken` + `verificarAdmin`, 403 for CLIENT) on `/usuarios/listar`, `/pedidos`, `/contactos`, and product create/update/delete.
- **State**: React Context only, nested `ProductoContext` -> `AuthContext` -> `CarritoContext` in `App.jsx`. Only `AuthContext` and `CarritoContext` are consumed by components; `ProductoContext` is wired up but never consumed.
- **File uploads**: Multer saves to `back/src/uploads/`, served at `/uploads`. Product rows store only the filename in `imagen`; the frontend renders `${VITE_URL_SERVER}/uploads/<imagen>`.
- **Delete confirmations**: `front/src/components/ModalConfirmar.jsx` is a reusable Bootstrap confirm modal (props: `id`, `titulo`, `mensaje`, `textoConfirmar`, `onConfirmar`). Used by admin pages (`ShowProductsPage.jsx`, `ContactosPage.jsx`); no native `window.confirm` remains in `pages/admin`.
- **Categories**: there is NO categories table - the navbar dropdown (`Modalinicio.jsx`) derives unique categories from product `categoria` values via `pedirProductosCategoriaUnicos` (dedupes on `trim().toLowerCase()`). It opens on click and closes on outside click/Escape. Selecting one routes to `/category/:categoria` -> `Listproducts.jsx`, which filters with `pedirProductosCategoria` (also case/whitespace-normalized). `Listproducts`'s `useEffect` depends on `[categoria]` so switching categories re-filters without a reload.
- **WhatsApp button**: `front/src/components/BotonWhatsApp.jsx` is a floating button rendered in `PublicLayout.jsx` (visible on all public pages, not admin). Configured via `VITE_WHATSAPP_NUMBER`; if empty, it does not render. Clicking opens a panel with "Chatear por WhatsApp" (wa.me with a greeting) and, when the cart has items, "Enviar resumen de carrito" built by `construirMensajeCarrito` (lines with `[codigo] nombre - cantidad x precio = subtotal` + total). The panel closes on outside click/Escape. Uses an inline SVG of the WhatsApp logo because lucide-react ships no brand icons.
- **Frontend uses Bootstrap 5 via CDN** (`index.html`), not installed as npm dependency.

## Gotchas

- `front/deploy.sh` is a GitHub Actions YAML workflow, not a shell script - and not a working deploy path as-is: it lives in `front/` (not `.github/workflows/`) and runs `npm ci` at the repo root, which has no `package.json`. Real deploy is `npm run deploy` (gh-pages).
- Backend routes `/registrar`, `/actualizar/:id`, `/delete/:id` are shared by products and users.
- Products router is mounted at `/productos` and its list route is also `/productos`, so the catalog endpoint is `GET /productos/productos` (double path). `pedirProductos()` in `front/src/js/pedirProductos.js` already uses the correct URL.
- `tblpedidos_detalle.codigo` snapshots the product code at purchase time; it is `NULL` for orders created before the column was added (frontend hides it via `item.codigo ? ... : ''` in `Checkout.jsx`/`PedidosPage.jsx`).
- `tblproductos.codigo` uniqueness is enforced only in the controller (`obtenerProductoCodigo` pre-check), not by a DB UNIQUE constraint.
- **Response-shape mismatch**: the product list endpoint returns `{ success: true, data: [...] }`. `pedirProductos()` in `front/src/js/pedirProductos.js` returns `result.data` and is what `Listproducts.jsx`/`ShowProductsPage.jsx`/`Modalinicio.jsx` actually use, while `ProductoContext.obtenerProductos` stores the raw body (`setProductos(data)`).
- `back/src/uploads/*` images are tracked in git.
- **Deploy mismatch**: `front/package.json` `homepage` says `orlandoma68.github.io/sitemcar/` but the git remote is `orlandoma68/siscar_bigsound`; `vite.config.js` sets no `base`, so `npm run build` emits absolute `/assets/*` paths (breaks on GitHub Pages subpath hosting).
- Root `package-lock.json` is an empty stub (no root `package.json`); ignore it and run npm inside `back/` or `front/`.
