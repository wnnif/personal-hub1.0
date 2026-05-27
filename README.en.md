# Personal Hub 1.0

[简体中文](./README.md) | English

Personal Hub 1.0 is an open-source, self-hosted personal navigation site with a built-in admin console. It is designed for personal homepages, link hubs, developer portals, and lightweight start pages.

The UI follows the Stitch Aura design package: Apple-like minimalism, glass surfaces, fluid backgrounds, and unified light/dark modes.

## Stack

- Next.js App Router
- Tailwind CSS
- PostgreSQL
- Prisma
- Docker Compose

## Features

- Public personal portal at `/`
- Admin console at `/admin`
- Link management with categories, visibility status, and ordering
- Profile, social links, and featured contact cards
- Global site settings
- Light/dark mode
- Daily visitor statistics
- Docker-first self-hosting

## Quick Start With Docker

```bash
cp .env.example .env
docker compose up -d --build
```

Open:

- Portal: `http://localhost:3000`
- Admin: `http://localhost:3000/admin`

Default credentials come from `.env`:

```bash
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="change-me-now"
```

Change them before exposing the app publicly.

The container runs Prisma migrations and seed data automatically on startup.

## Local Development

Start a local PostgreSQL database, set `DATABASE_URL`, then run:

```bash
npm install
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
```

## Routes

- `/` public portal
- `/admin` admin entry, login, and dashboard
- `/admin/login` login compatibility route
- `/admin/dashboard` dashboard
- `/admin/links` links management
- `/admin/categories` categories management
- `/admin/profile` profile and contact settings
- `/admin/settings` global settings

## Environment Variables

```bash
DATABASE_URL="postgresql://wnn:change_me@db:5432/wnn_portal?schema=public"
POSTGRES_DB="wnn_portal"
POSTGRES_USER="wnn"
POSTGRES_PASSWORD="change_me"
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="change-me-now"
ADMIN_SESSION_SECRET="replace-with-a-long-random-string"
```

For production, use a strong `ADMIN_SESSION_SECRET` and a unique admin password.

## Deployment

See [DEPLOYMENT.en.md](./DEPLOYMENT.en.md) for Docker, Docker Compose, Hermes, and Dok Docker Compose deployment notes. Chinese version: [DEPLOYMENT.md](./DEPLOYMENT.md).

## License

MIT
