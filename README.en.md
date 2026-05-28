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
- Global site settings and SEO title/description
- Light/dark mode
- Daily visitor statistics with database-level uniqueness and hashed IPs
- Docker-first self-hosting

## One-Command Install

For a fresh server. The default install path is `/opt/personal-hub1.0`:

```bash
curl -fsSL https://raw.githubusercontent.com/wnnif/personal-hub1.0/main/scripts/install.sh | bash
```

Customize the install path and initial admin password:

```bash
curl -fsSL https://raw.githubusercontent.com/wnnif/personal-hub1.0/main/scripts/install.sh | INSTALL_DIR=/opt/personal-hub APP_PORT=3017 ADMIN_PASSWORD='your-password' bash
```

## One-Command Update

```bash
curl -fsSL https://raw.githubusercontent.com/wnnif/personal-hub1.0/main/scripts/update.sh | bash
```

If you used a custom install path:

```bash
curl -fsSL https://raw.githubusercontent.com/wnnif/personal-hub1.0/main/scripts/update.sh | INSTALL_DIR=/opt/personal-hub bash
```

## Quick Start With Docker

```bash
cp .env.example .env
# edit .env if needed
docker compose up -d --build
```

Open:

- Portal: `http://localhost:3000`
- Admin: `http://localhost:3000/admin`

Default credentials come from `.env`:

```bash
ADMIN_EMAIL="admin"
ADMIN_PASSWORD="124"
```

These defaults are intended for local onboarding. Before exposing the app publicly, change `ADMIN_PASSWORD`, `POSTGRES_PASSWORD`, `ADMIN_SESSION_SECRET`, and `VISIT_HASH_SALT`.

The production login page does not show the `admin / 124` hint by default. For a public demo, enable it explicitly:

```bash
NEXT_PUBLIC_SHOW_DEFAULT_CREDENTIALS="true"
```

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
DATABASE_URL="postgresql://wnn:please_change_me@db:5432/wnn_portal?schema=public"
POSTGRES_DB="wnn_portal"
POSTGRES_USER="wnn"
POSTGRES_PASSWORD="please_change_me"
ADMIN_EMAIL="admin"
ADMIN_PASSWORD="124"
ADMIN_SESSION_SECRET="please_change_this_session_secret"
VISIT_HASH_SALT="please_change_this_visit_hash_salt"
NEXT_PUBLIC_SHOW_DEFAULT_CREDENTIALS="false"
```

Notes:

- `ADMIN_SESSION_SECRET` is required in production and signs admin session cookies.
- Changing `ADMIN_PASSWORD` or `ADMIN_PASSWORD_SHA256` invalidates old admin cookies automatically.
- `VISIT_HASH_SALT` is used to hash visitor IPs for visit statistics, so raw IPs are not stored by default.

## Deployment

See [DEPLOYMENT.en.md](./DEPLOYMENT.en.md) for Docker, Docker Compose, Hermes, and Dok Docker Compose deployment notes. Chinese version: [DEPLOYMENT.md](./DEPLOYMENT.md).

## License

MIT
