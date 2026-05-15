# Panchakanya Gold Dashboard (Next.js + Prisma)

Admin dashboard for Panchakanya Jewellers. Runs fully locally with **Next.js App Router**, **PostgreSQL**, and **Prisma** — no external API required.

## Stack

- **Next.js 15** — frontend + API routes
- **Prisma** — ORM + migrations
- **PostgreSQL** — database (local or hosted)
- **Local uploads** — files stored in `public/uploads/`

## Quick start

### 1. PostgreSQL

Install PostgreSQL locally and create a database, or use a hosted instance. Set `DATABASE_URL` in `.env` (see `.env.example`).

### 2. Configure environment

Copy `.env.example` to `.env` and set your connection string.

### 3. Install & migrate

```bash
npm install
npm run db:migrate
npm run db:seed
```

### 4. Run dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

**Default login:** `admin@panchakanya.com` / `admin12345`

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Next.js dev server (port 3000) |
| `npm run build` | Production build |
| `npm run db:migrate` | Create/apply Prisma migrations |
| `npm run db:seed` | Seed admin user + sample data |
| `npm run db:studio` | Open Prisma Studio |

## API

All former external API calls now hit internal routes:

```
/api/v1/en/<resource>
```

Examples: `login`, `product`, `category`, `banner`, `blog`, `gift`, `contact`, `company`, `dashboard`, `order`, etc.

File uploads:

```
POST /api/v1/en/enhanced-upload/single
```

Files are saved under `public/uploads/<documentType>/` and served at `/uploads/...`.

## Project structure

```
prisma/schema.prisma   # Database models
src/app/               # Next.js App Router
src/app/api/v1/en/     # REST API (replaces external backend)
src/lib/api/           # API handlers + router
src/pages/             # Feature pages (used via client router)
src/components/        # UI components
public/uploads/        # Local file storage
```

## Notes

- UI still uses React Router inside a client shell (`ClientApp`) for minimal migration friction. Routes can be moved to Next.js file-based routing incrementally.
- Firebase push notifications remain optional client-side; backend push is stored in `PushNotification` table.
- Socket.io chunked uploads are simplified to direct local uploads for local development.
