# 部署指南

[English](./DEPLOYMENT.en.md) | 简体中文

本项目以 Docker 部署为优先目标。推荐生产环境使用 Docker Compose：一个应用容器加一个 PostgreSQL 容器。

## 1. 一键安装/更新

全新服务器一键安装：

```bash
curl -fsSL https://raw.githubusercontent.com/wnnif/personal-hub/main/scripts/install.sh | bash
```

自定义安装目录、端口和初始后台密码：

```bash
curl -fsSL https://raw.githubusercontent.com/wnnif/personal-hub/main/scripts/install.sh | INSTALL_DIR=/opt/personal-hub APP_PORT=3017 ADMIN_PASSWORD='你的密码' bash
```

后续一键更新：

```bash
curl -fsSL https://raw.githubusercontent.com/wnnif/personal-hub/main/scripts/update.sh | bash
```

如果安装目录不是默认值：

```bash
curl -fsSL https://raw.githubusercontent.com/wnnif/personal-hub/main/scripts/update.sh | INSTALL_DIR=/opt/personal-hub bash
```

## 2. 准备环境变量

复制示例配置：

```bash
cp .env.example .env
```

编辑 `.env`：

```bash
APP_PORT="3000"

POSTGRES_DB="wnn_portal"
POSTGRES_USER="wnn"
POSTGRES_PASSWORD="change_this_postgres_password"
DATABASE_URL="postgresql://wnn:change_this_postgres_password@db:5432/wnn_portal?schema=public"

ADMIN_EMAIL="admin"
ADMIN_PASSWORD="change_this_admin_password"
ADMIN_SESSION_SECRET="change_this_to_a_long_random_session_secret"
VISIT_HASH_SALT="change_this_to_a_long_random_visit_hash_salt"
NEXT_PUBLIC_SHOW_DEFAULT_CREDENTIALS="false"
```

注意：

- `POSTGRES_PASSWORD` 必须和 `DATABASE_URL` 里的数据库密码一致。
- `.env.example` 使用占位密码；公开部署前必须改成强密码，或使用一键安装脚本自动生成强随机密钥。
- `ADMIN_SESSION_SECRET` 生产环境必须设置，用于签名后台登录 cookie。
- `VISIT_HASH_SALT` 用于访问统计 IP 哈希；公开部署时建议修改为只保存在服务器上的值。
- 生产环境登录页默认不显示 `admin / 124` 提示；需要公开演示时再把 `NEXT_PUBLIC_SHOW_DEFAULT_CREDENTIALS` 改为 `true`。

## 3. 使用 Docker Compose 部署

```bash
docker compose up -d --build
```

打开：

```txt
http://服务器IP:${APP_PORT:-3000}
http://服务器IP:${APP_PORT:-3000}/admin
```

应用容器启动时会自动执行：

```bash
npx prisma generate
npx prisma migrate deploy
npx prisma db seed
```

种子脚本是幂等的：数据库已经初始化后，不会重复覆盖已有内容。

## 4. 常用命令

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

## 5. Hermes / Dok Docker Compose 部署

Dok 使用 Docker Compose 部署。如果你的服务器面板支持从 Git 仓库使用 Docker Compose 部署：

1. 从 Git 仓库创建新应用。
2. 选择 Docker Compose 部署方式。
3. Compose 文件使用仓库根目录的 `docker-compose.yml`。
4. 添加 `.env.example` 中列出的环境变量。
5. 暴露容器端口 `3000`，宿主机端口可用 `APP_PORT` 调整。
6. 将域名绑定到应用服务。
7. 在面板或反向代理中开启 HTTPS。

如果你的面板只支持 Dockerfile 部署：

1. 从仓库根目录构建镜像。
2. 使用 `Dockerfile`。
3. 准备一个可用的 PostgreSQL 数据库。
4. 将 `DATABASE_URL` 设置为该数据库的连接地址。
5. 设置 `ADMIN_EMAIL`、`ADMIN_PASSWORD` 和 `ADMIN_SESSION_SECRET`。
6. 暴露端口 `3000`。

## 6. 反向代理

如果使用 Nginx、Caddy、Traefik、Dokploy 或类似工具，将流量代理到：

```txt
http://app:3000
```

单服务器 Docker Compose 部署时，可以直接映射宿主机 `3000` 端口，也可以交给面板自动接入反向代理。

## 7. 数据备份

PostgreSQL 数据保存在 Docker volume：

```txt
postgres_data
```

请定期备份该 volume，或使用 `pg_dump` 备份数据库。

示例：

```bash
docker compose exec db pg_dump -U wnn wnn_portal > backup.sql
```
