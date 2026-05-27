# Deployment Guide

[简体中文](./DEPLOYMENT.md) | English

This project is designed for Docker-first deployment. The recommended production path is Docker Compose with one app container and one PostgreSQL container.

## 1. Prepare Environment

Copy the example file:

```bash
cp .env.example .env
```

Edit `.env`:

```bash
POSTGRES_DB="wnn_portal"
POSTGRES_USER="wnn"
POSTGRES_PASSWORD="change_this_database_password"
DATABASE_URL="postgresql://wnn:change_this_database_password@db:5432/wnn_portal?schema=public"

ADMIN_EMAIL="admin"
ADMIN_PASSWORD="124"
ADMIN_SESSION_SECRET="replace_with_a_long_random_secret"
```

Important:

- `POSTGRES_PASSWORD` and the password inside `DATABASE_URL` must match.
- Change `ADMIN_PASSWORD` before exposing the app to the internet.
- Use a long random value for `ADMIN_SESSION_SECRET`.

## 2. Deploy With Docker Compose

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
npx prisma migrate deploy
npx prisma db seed
```

The seed script is idempotent. It inserts initial content only when the database has not been initialized.

## 3. Useful Commands

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

## 4. Hermes / Dok Docker Compose Deployment

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

## 5. Reverse Proxy

For Nginx, Caddy, Traefik, Dokploy, or similar tools, proxy traffic to:

```txt
http://app:3000
```

For a single-server Docker Compose setup, map host port `3000` directly or let your panel attach a reverse proxy.

## 6. Backups

The PostgreSQL data is stored in the Docker volume:

```txt
postgres_data
```

Back up this volume or use `pg_dump` regularly.

Example:

```bash
docker compose exec db pg_dump -U wnn wnn_portal > backup.sql
```
