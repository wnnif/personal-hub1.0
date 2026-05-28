# 部署指南

[English](./DEPLOYMENT.en.md) | 简体中文

本项目以 Docker 部署为优先目标。推荐生产环境使用 Docker Compose：一个应用容器加一个 PostgreSQL 容器。

## 1. 准备环境变量

复制示例配置：

```bash
cp .env.example .env
```

编辑 `.env`：

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

注意：

- `POSTGRES_PASSWORD` 必须和 `DATABASE_URL` 里的数据库密码一致。
- 默认 `ADMIN_PASSWORD=124` 方便本地首次体验；公开到互联网前建议修改。
- `ADMIN_SESSION_SECRET` 生产环境必须设置，用于签名后台登录 cookie。
- `VISIT_HASH_SALT` 用于访问统计 IP 哈希；公开部署时建议修改为只保存在服务器上的值。
- 生产环境登录页默认不显示 `admin / 124` 提示；需要公开演示时再把 `NEXT_PUBLIC_SHOW_DEFAULT_CREDENTIALS` 改为 `true`。

## 2. 使用 Docker Compose 部署

```bash
docker compose up -d --build
```

打开：

```txt
http://服务器IP:3000
http://服务器IP:3000/admin
```

应用容器启动时会自动执行：

```bash
npx prisma migrate deploy
npx prisma db seed
```

种子脚本是幂等的：数据库已经初始化后，不会重复覆盖已有内容。

## 3. 常用命令

查看日志：

```bash
docker compose logs -f app
```

重启应用：

```bash
docker compose restart app
```

拉取更新后重新构建：

```bash
git pull
docker compose up -d --build
```

停止服务：

```bash
docker compose down
```

停止服务并删除数据库数据卷：

```bash
docker compose down -v
```

## 4. Hermes / Dok Docker Compose 部署

Dok 使用 Docker Compose 部署。如果你的服务器面板支持从 Git 仓库使用 Docker Compose 部署：

1. 从 Git 仓库创建新应用。
2. 选择 Docker Compose 部署方式。
3. Compose 文件使用仓库根目录的 `docker-compose.yml`。
4. 添加 `.env.example` 中列出的环境变量。
5. 暴露容器端口 `3000`。
6. 将域名绑定到应用服务。
7. 在面板或反向代理中开启 HTTPS。

如果你的面板只支持 Dockerfile 部署：

1. 从仓库根目录构建镜像。
2. 使用 `Dockerfile`。
3. 准备一个可用的 PostgreSQL 数据库。
4. 将 `DATABASE_URL` 设置为该数据库的连接地址。
5. 设置 `ADMIN_EMAIL`、`ADMIN_PASSWORD` 和 `ADMIN_SESSION_SECRET`。
6. 暴露端口 `3000`。

## 5. 反向代理

如果使用 Nginx、Caddy、Traefik、Dokploy 或类似工具，将流量代理到：

```txt
http://app:3000
```

单服务器 Docker Compose 部署时，可以直接映射宿主机 `3000` 端口，也可以交给面板自动接入反向代理。

## 6. 数据备份

PostgreSQL 数据保存在 Docker volume：

```txt
postgres_data
```

请定期备份该 volume，或使用 `pg_dump` 备份数据库。

示例：

```bash
docker compose exec db pg_dump -U wnn wnn_portal > backup.sql
```
