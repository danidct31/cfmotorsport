# CF Motorsport

Workshop job hub migrated from PythonAnywhere → **Next.js + NestJS + PostgreSQL on Railway**.

Same stack pattern as Lisa:

```
VS Code → local hot reload → GitHub → Railway → live site
Next.js (web) → NestJS API → Railway PostgreSQL
```

## Apps

| Folder | Role | Port |
|--------|------|------|
| `web/` | Next.js UI | 3000 |
| `api/` | NestJS API + Prisma | 4000 |

## Features

- Password gate (`SITE_PASSWORD`)
- Office gate (`OFFICE_PASSWORD`)
- Primary Jobs (+ per-job notes)
- Weekly Jobs
- Jobs to be done (+ per-job notes)
- Office / desk list
- Yellow/ink visual language, engine background, CF logo

## Local run

```bash
# terminal 1
cd api
npm install
npm run start:dev

# terminal 2
cd web
npm install
npm run dev
```

Open http://localhost:3000

Default local passwords are in `api/.env` (change them). Without Postgres the API still runs using an in-memory fallback.

## Railway

Create 3 services from this repo:

1. **PostgreSQL**
2. **api** — Root Directory `api`
   - `DATABASE_URL` = `${{Postgres.DATABASE_URL}}`
   - `CORS_ORIGIN` = web URL
   - `SITE_PASSWORD`, `OFFICE_PASSWORD`, `SESSION_SECRET`
   - Backup email: `BACKUP_EMAIL`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `BACKUP_SECRET`
   - `NIXPACKS_NODE_VERSION=20`
3. **web** — Root Directory `web`
   - `NEXT_PUBLIC_API_URL` = `https://YOUR-API-DOMAIN/api`
   - `NIXPACKS_NODE_VERSION=20`

Generate public domains for web + api.
