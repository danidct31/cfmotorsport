# Lisa

Online clothes shop — **React + Next.js** frontend, **NestJS** API, **PostgreSQL** on **Railway**.

```
VS Code → Code locally → Hot reload → Git → GitHub → Railway → Live website
```

```
React + Next.js  ──►  Railway
                        │
                     NestJS API
                        │
                  Railway PostgreSQL
```

## Project structure

```
lisa/
├── web/          # Next.js storefront (port 3000)
├── api/          # NestJS API (port 4000)
├── package.json  # npm workspaces
└── README.md
```

## Prerequisites

- Node.js LTS
- Git
- A [Railway](https://railway.app) account
- A [GitHub](https://github.com) account (`danidct31`)
- PostgreSQL locally **or** Railway Postgres (for real data)

## Local development

### 1. Install

```bash
cd elisa
npm install
```

Or install each app:

```bash
cd web && npm install
cd ../api && npm install
```

### 2. Environment

Copy examples (already created as `.env` / `.env.local` for local use):

- `api/.env` → `DATABASE_URL`, `PORT=4000`, `CORS_ORIGIN`
- `web/.env.local` → `NEXT_PUBLIC_API_URL=http://localhost:4000/api`

### 3. Database (when Postgres is ready)

```bash
cd api
npx prisma migrate dev --name init
npx prisma db seed
```

Without a database, the **web** app still runs using a built-in fallback catalog.

### 4. Run (two terminals)

```bash
# Terminal 1 — API
cd api
npm run start:dev

# Terminal 2 — Web (hot reload)
cd web
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — that’s **Lisa**.

## Deploy on Railway (no Vercel)

Create **three** Railway services from the same GitHub repo:

| Service    | Root directory | Notes |
|-----------|----------------|--------|
| Postgres  | —              | Railway PostgreSQL plugin |
| `api`     | `api`          | Set `DATABASE_URL` from Postgres; `CORS_ORIGIN` = your web URL |
| `web`     | `web`          | Set `NEXT_PUBLIC_API_URL` = `https://<api-domain>/api` |

### API variables

- `DATABASE_URL` — from Railway Postgres (reference variable)
- `PORT` — Railway sets this automatically
- `CORS_ORIGIN` — your Lisa web URL, e.g. `https://lisa-web.up.railway.app`

### Web variables

- `NEXT_PUBLIC_API_URL` — e.g. `https://lisa-api.up.railway.app/api`

After deploy, run migrate + seed once (API `railway.toml` does this on start, or run via Railway shell):

```bash
npx prisma migrate deploy
npx prisma db seed
```

## GitHub (`danidct31`)

```bash
git init
git add .
git commit -m "Initial Lisa clothes shop — Next.js, NestJS, Prisma"
git branch -M main
git remote add origin https://github.com/danidct31/lisa.git
git push -u origin main
```

Create the empty repo **lisa** under [github.com/danidct31](https://github.com/danidct31) first (or tell the agent your GitHub token / install GitHub CLI).

## API endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/products` | All products (`?category=tops`) |
| GET | `/api/products/featured` | Featured products |
| GET | `/api/products/:slug` | Single product |

## Later stack (not required today)

Docker Desktop · Android Studio · Expo Go · Supabase · Vercel (optional later)
