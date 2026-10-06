# AGENTS.md

## Project overview

**Siscar** - product catalog & shopping cart for car-related products. Two independent apps, **no monorepo tooling and no root `package.json`** (the root `package-lock.json` is an empty stub - ignore it, never run npm at the root):

- `back/` - Express REST API (Node.js, **CommonJS**)
- `front/` - React SPA (Vite 7, **ES modules**)

Install and run each separately (`cd back && npm install` / `cd front && npm install`). Codebase is Spanish (variable names, routes, comments) - keep new code Spanish too.

## Commands

### Backend (`back/`)
```
npm install          # install deps
npm run dev          # nodemon, port 3000 (or $PORT)
npm start            # production start (node)
npm run seed         # SEE "Seed script is broken" below
```
No lint, test, or typecheck scripts exist.

### Frontend (`front/`)
```
npm install
npm run dev          # Vite dev server
npm run build        # -> dist/
npm run lint         # the ONLY static check in the repo (ESLint 9 flat config)
npm run preview
npm run deploy       # gh-pages -d dist
```
No test or typecheck scripts exist. `npm run lint` matters because `react-refresh/only-export-components` and `react-hooks` rules are enabled and fail the build; `no-unused-vars` ignores vars matching `^[A-Z_]` so uppercase helper consts are exempt.

## Verification

There are **no automated tests anywhere** and no CI (`.github/` does not exist), so verification is manual:
- front: `npm run lint`, plus `npm run dev` and exercise the route in `App.jsx`.
- back: `npm run dev` then `GET http://localhost:3000/` should answer `Hello World!` (`routes/routesIndex.js`). On startup the console prints `Roles verificados en la BD`, `Tablas de pedidos verificadas en la BD`, `Tabla de contactos verificada en la BD`, `Tabla de auditoria de roles verificada en la BD`, `Server iniciado en el puerto 3000` - a missing line means that bootstrap step threw against the DB.

## Setup prerequisites

- **MySQL is required** and there is **no committed `.env`** - `back/.env` and `front/.env` are gitignored and exist only locally. Ask the user for DB credentials rather than inventing them. The local `back/.env` points at database `bigsound`.
- Watch the root `.gitignore`: it lists `env` (no leading dot), which does **not** match `.env`. Only `back/.gitignore` and `front/.gitignore` actually keep `.env` out of git - do not create a root-level `.env`.
- **Always run the backend from inside `back/`.** `configUpload.js` writes to the *relative* path `./src/uploads/`, while `index.js` serves uploads via an *absolute* `__dirname` path. Starting from the repo root silently splits them and breaks image upload/serving.
- Schema bootstrap lives in code, not migrations: `back/src/index.js` on startup seeds roles (`INSERT IGNORE` ADMIN=1/CLIENT=2), `CREATE TABLE IF NOT EXISTS` for `tblpedidos`, `tblpedidos_detalle`, `tblcontactos`, `tblauditoria_roles`, then idempotently `ALTER TABLE`s missing columns (`tipo_envio`, `metodo_pago`, `direccion` on `tblpedidos`; `codigo` on `tblpedidos_detalle`). **Restarting the server applies new columns** - no manual migration needed. Standalone SQL also exists in `back/src/config/` (`migracion_descripcion_text.sql`, `migracion_pedido_codigo.sql`).
- **`back/src/config/tblproductos.sql` is destructive** - it opens with `DROP TABLE IF EXISTS` for every table. Only run it against a throwaway DB. It defines 6 tables (no `tblauditoria_roles`).

### Seed script is broken
`back/src/config/seed.js` has its `usuarios` array **commented out**, so plain `npm run seed` and `npm run seed -- --reset` fail with `ReferenceError: usuarios is not defined`. Only `npm run seed -- --promote <email>` (UPDATE an existing user to `rol_id = 1`) actually runs. There are no seeded admin/client accounts; create the first admin by registering with an email/domain listed in `ADMIN_EMAIL` / `ADMIN_DOMAIN`, or by promoting an existing user.

## Environment variables

### Backend (`back/.env`) - gitignored
`DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `JWT_SECRET`, `JWT_EXP`, optional `PORT`. (`JWT_COOKIE_EXP` sits in `.env` but no code reads it.)

Auto-admin at registration: `ADMIN_EMAIL` (exact emails, comma-separated) and `ADMIN_DOMAIN` (corporate domains without `@`, comma-separated) make a new user born ADMIN, else CLIENT. Applied in `rolNuevoUsuario()` (`back/src/controllers/controllersUsuario.js`) on classic register **and** Google sign-in creation - only at creation time, it never promotes existing users. If both are empty every new user is CLIENT.

Password reset reads `FRONT_URL` (default `http://localhost:5173`) plus `SMTP_HOST/PORT/USER/PASS/FROM` via `back/src/services/emailService.js`. If `SMTP_HOST` is empty **no mail is sent** - the controller returns the reset link as `enlace` in the API response (dev fallback). Reset tokens are JWTs with `tipo: 'reset'`, valid 30 min. Routes: `POST /usuarios/olvidar-password`, `POST /usuarios/restablecer-password`.

### Frontend (`front/.env`) - gitignored
- `VITE_URL_SERVER` (backend API). Only `AuthContext.jsx` falls back to `http://localhost:3000`; `js/pedirProductos.js`, `js/useContactosNoLeidos.js` and `ProductoContext` read it with **no default**, so it must be set.
- Firebase vars consumed by `front/src/js/config.js` (note the non-standard, typo'd names - copy them exactly): `VITE_FIREBASE_APIKEY`, `VITE_FIREBASE_AUTDOMAIN`, `VITE_FIREBASE_PROJECTID`, `VITE_FIREBASE_STORAGEBUCKET`, `VITE_FIREBASE_MESSAGINGSENDERID`, `VITE_FIREBASE_APPID`, `VITE_FIREBASE_MEASUREMENTID`
- `VITE_WHATSAPP_NUMBER` (international, no spaces/`+`, e.g. `51999999999`; if empty `BotonWhatsApp.jsx` does not render)

## Architecture

- **Express 5** (not 4) - affects route parameter syntax and error handling.
- **MVC**: `routes/` -> `controllers/` -> `models/` -> mysql2 pool (`config/configDb.js`, single shared pool, `connectionLimit: 10`).
- **Auth**: Firebase Auth (frontend) + MySQL roles (backend). Login and Google sign-in return a JWT containing `{id, email, rol}`; register only creates the user (no token) and returns `redirect: "/auth/login"`. Frontend stores the JWT in `localStorage` under `token` and sends `Authorization: Bearer ...`. **The backend sets no cookies** - `cookie-parser` and the `req.cookies.jwt` fallback in `middlewares/auth.js` are vestigial.
- **Role enforcement**: `AdminLayout.jsx` only requires a logged-in user with any non-null `rol`; the real ADMIN gate is server-side (`verificarToken` + `verificarAdmin`, 403 for CLIENT) on `/usuarios/listar`, `/usuarios/:id/rol`, `GET /pedidos`, all `/contactos` reads/writes, and product create/update/delete. `NavarAdmin.jsx` items are flagged `soloAdmin` to hide them client-side; "Mis Pedidos" is intentionally visible to CLIENT.
- **Admin user management**: `/admin/usuarios` (`UsuariosPage.jsx`) lists via `GET /usuarios/listar` and changes roles via `PUT /usuarios/:id/rol`. Securities in `cambiarRolUsuario`: target must exist, `rol_id` must be a real role, you cannot change your own role, you cannot revoke the last remaining ADMIN. Every change is written to `tblauditoria_roles`. **The JWT carries the `rol` claim, so a promoted user only sees the new role after re-login.**
- **Response shapes are inconsistent** - read them per endpoint instead of assuming:
  - `GET /productos/productos` and `/buscar` -> `{ success: true, data: [...] }`
  - `GET /productos/stats`, `/usuarios/listar`, `/pedidos/*` -> `{ ok: true, data: ... }`
  - `pedirProductos()` in `front/src/js/pedirProductos.js` returns `result.data`, and that helper is what `Listproducts.jsx` / `ShowProductsPage.jsx` / `Modalinicio.jsx` actually use. `ProductoContext.obtenerProductos` stores the **raw body** (`setProductos(data)`), so the context's `productos` is the wrapper object, not an array - the context is wired up in `App.jsx` but never consumed.
- **Orders**: `crearPedido` validates `tipo_envio` (`retiro en local` | `envio a domicilio`, address required for the latter) and `metodo_pago` (`transferencia` | `efectivo`), re-reads prices server-side, then inserts order + detail rows and decrements stock in a single transaction (`modelsPedido.crearPedido`). `tblpedidos_detalle` **snapshots** `codigo`, `nombre`, `precio`, `cantidad` at purchase time; `codigo` is `NULL` for pre-migration orders (frontend hides it via `item.codigo ? ... : ''`). Note the stock UPDATE is `WHERE cantidad >= ?`, so it can silently no-op, and cancelling an order (`estado: 'cancelado'`) does **not** restore stock.
- **File uploads**: Multer saves to `back/src/uploads/` as `Date.now()-<originalname>`. Product rows store only the filename in `imagen`; the frontend renders `${VITE_URL_SERVER}/uploads/<imagen>`. Update/delete unlink the old file from disk. `back/src/uploads/*` images are **tracked in git**.
- **Delete confirmations**: `front/src/components/ModalConfirmar.jsx` is the reusable Bootstrap confirm modal (props: `id`, `titulo`, `mensaje`, `textoConfirmar`, `onConfirmar`), used by `ShowProductsPage.jsx`, `ContactosPage.jsx`, `UsuariosPage.jsx`. No native `window.confirm` remains in `pages/admin`.
- **State**: React Context only, nested `ProductoContext` -> `AuthContext` -> `CarritoContext` in `App.jsx`. Only `AuthContext` and `CarritoContext` are consumed by components.
- **Categories**: there is NO categories table. The navbar dropdown (`Modalinicio.jsx`) derives unique categories from product `categoria` values via `pedirProductosCategoriaUnicos` (dedupes on `trim().toLowerCase()`), opens on click, closes on outside click/Escape. Selecting one routes to `/category/:categoria` -> `Listproducts.jsx`, which filters client-side with `pedirProductosCategoria` (same normalization). Its `useEffect` depends on `[categoria]` so switching categories re-filters without a reload.
- **Image zoom**: `front/src/components/ZoomImagen.jsx` (props `src`, `alt`, `alto=400`, `zoom=2`) stacks an `aria-hidden` duplicate `img` layer at `scale(2)` and pans it with `transform-origin` set to the cursor's percentage on `mousemove`; both layers use `object-fit: cover` so they stay aligned. Used by `Itemdetail.jsx` on `/item/:id`.
- **WhatsApp button**: `front/src/components/BotonWhatsApp.jsx` floats in `PublicLayout.jsx` (public pages only, not admin). Panel offers "Chatear por WhatsApp" plus, when the cart has items, "Enviar resumen de carrito" built by `construirMensajeCarrito` (`[codigo] nombre - cantidad x precio = subtotal` + total). Closes on outside click/Escape. Uses an inline WhatsApp SVG because `lucide-react` ships no brand icons.
- **UI**: Bootstrap 5 + FontAwesome via CDN in `front/index.html` - **not** npm dependencies. Components are Bootstrap-class based rather than using a component library.

## Gotchas

- `front/deploy.sh` is a GitHub Actions YAML workflow, not a shell script - and it does not work as-is: it lives in `front/` (not `.github/workflows/`) and runs `npm ci` at the repo root, which has no `package.json`. Real deploy is `npm run deploy` (gh-pages).
- **Deploy/base path mismatch**: `front/package.json` `homepage` says `orlandoma68.github.io/sitemcar/` and the package is still named `cursoreact2025`, but the git remote is `orlandoma68/siscar_bigsound`; `vite.config.js` sets no `base`, so `npm run build` emits absolute `/assets/*` paths and breaks on GitHub Pages subpath hosting.
- Backend route paths `/registrar`, `/actualizar/:id`, `/delete/:id` are **shared by products and users** (both routers mount the same shapes under different prefixes).
- The products router is mounted at `/productos` and its list route is also `/productos`, so the catalog endpoint is `GET /productos/productos` (double path). `pedirProductos()` already uses the correct URL.
- `tblproductos.codigo` uniqueness is enforced only in the controller (`obtenerProductoCodigo` pre-check in `crearProducto`), not by a DB constraint. `crearProducto` also defaults `imagen` to the literal string `'default-product.png'` when no file is uploaded.
- Unread contact badge polls `GET /contactos/no-leidos` every 30 s via `useContactosNoLeidos` and only runs while the admin nav is mounted.
