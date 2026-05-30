# Deployment Guide

[简体中文](./DEPLOYMENT.md) | English

This project is designed for Docker-first deployment. The recommended production path is Docker Compose with one app container and one PostgreSQL container.

## 1. One-Command Install / Update

Install on a fresh server:

```bash
curl -fsSL https://raw.githubusercontent.com/wnnif/personal-hub/main/scripts/install.sh | bash
```

Customize the install path and initial admin password:

```bash
curl -fsSL https://raw.githubusercontent.com/wnnif/personal-hub/main/scripts/install.sh | INSTALL_DIR=/opt/personal-hub APP_PORT=3017 ADMIN_PASSWORD='your-password' bash
```

Update later:

```bash
curl -fsSL https://raw.githubusercontent.com/wnnif/personal-hub/main/scripts/update.sh | bash
```

If you used a custom install path:

```bash
curl -fsSL https://raw.githubusercontent.com/wnnif/personal-hub/main/scripts/update.sh | INSTALL_DIR=/opt/personal-hub bash
```

## 2. Prepare Environment

Copy the example file:

```bash
cp .env.example .env
```

Edit `.env`:

```bash
POSTGRES_DB="wnn_portal"
POSTGRES_USER="wnn"
POSTGRES_PASSWORD="please_change_me"
DATABASE_URL="postgresql://wnn:please_change_me@db:5432/wnn_portal?schema=public"

ADMIN_EMAIL="admin"
ADMIN_PASSWORD="124"
ADMIN_SESSION_SECRET="please_change_this_session_secret"
VISIT_HASH_SALT="please_change_this_visit_hash_salt"
NEXT_PUBLIC_SHOW_DEFAULT_CREDENTIALS="false"
```

Important:

- `POSTGRES_PASSWORD` and the password inside `DATABASE_URL` must match.
- The default `ADMIN_PASSWORD=124` is for local onboarding; change it before exposing the app to the internet.
- `ADMIN_SESSION_SECRET` is required in production and signs admin session cookies.
- `VISIT_HASH_SALT` is used to hash visitor IPs for visit statistics; for public deployments, change it to a server-only value.
- The production login page does not show the `admin / 124` hint by default. Enable `NEXT_PUBLIC_SHOW_DEFAULT_CREDENTIALS=true` only for demos.

## 3. Deploy With Docker Compose

```bash
docker compose up -d --build
```

Open:

```txt
http://SERVER_IP:3000
http://SERVER_IP:3000/admin
```

The app container runs these automatically during startup:

```bash
npx prisma generate
npx prisma migrate deploy
npx prisma db seed
```

The seed script is idempotent. It inserts initial content only when the database has not been initialized.

## 4. Useful Commands

View logs:

```bash
docker compose logs -f app
```

Restart:

```bash
docker compose restart app
```

Rebuild after pulling updates:

```bash
git pull
docker compose up -d --build
```

Stop:

```bash
docker compose down
```

Stop and remove database data:

```bash
docker compose down -v
```

## 5. Hermes / Dok Docker Compose Deployment

Dok deployment uses Docker Compose. If your server panel can deploy from a Git repository with Docker Compose:

1. Create a new app from the Git repository.
2. Select Docker Compose deployment.
3. Use `docker-compose.yml` at the repository root.
4. Add the environment variables from `.env.example`.
5. Expose container port `3000`.
6. Bind your domain to the app service.
7. Enable HTTPS in the panel or reverse proxy.

If your panel deploys from a Dockerfile only:

1. Build from the repository root.
2. Use `Dockerfile`.
3. Provide a managed PostgreSQL database.
4. Set `DATABASE_URL` to the managed database connection string.
5. Set `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `ADMIN_SESSION_SECRET`.
6. Expose port `3000`.

## 6. Reverse Proxy

For Nginx, Caddy, Traefik, Dokploy, or similar tools, proxy traffic to:

```txt
http://app:3000
```

For a single-server Docker Compose setup, map host port `3000` directly or let your panel attach a reverse proxy.

## 7. Backups

The PostgreSQL data is stored in the Docker volume:

```txt
postgres_data
```

Back up this volume or use `pg_dump` regularly.

Example:

```bash
docker compose exec db pg_dump -U wnn wnn_portal > backup.sql
```
