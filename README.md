# Personal Hub 1.0

[English](./README.en.md) | 简体中文

Personal Hub 1.0 是一个开源、自托管的个人导航站，内置后台管理系统。适合个人主页、链接导航、开发者入口页和轻量起始页。

界面风格基于 Stitch Aura 设计包：Apple 风格极简、毛玻璃质感、动态流体背景，并支持明暗模式。

## 技术栈

- Next.js App Router
- Tailwind CSS
- PostgreSQL
- Prisma
- Docker Compose

## 功能

- 前台个人导航页：`/`
- 后台管理入口：`/admin`
- 链接管理：分类、显示/隐藏、排序
- 个人资料、社交链接、重点联系卡片
- 全局站点设置与 SEO 标题/描述
- 明暗模式
- 每日访问人数统计，使用数据库唯一去重并保存 IP 哈希
- Docker 优先的自托管部署

## 一键安装

适合全新服务器，默认安装到 `/opt/personal-hub`：

```bash
curl -fsSL https://raw.githubusercontent.com/wnnif/personal-hub/main/scripts/install.sh | bash
```

可自定义安装目录、端口和默认后台密码：

```bash
curl -fsSL https://raw.githubusercontent.com/wnnif/personal-hub/main/scripts/install.sh | INSTALL_DIR=/opt/personal-hub APP_PORT=3017 ADMIN_PASSWORD='你的密码' bash
```

## 一键更新

```bash
curl -fsSL https://raw.githubusercontent.com/wnnif/personal-hub/main/scripts/update.sh | bash
```

如果安装目录不是默认值：

```bash
curl -fsSL https://raw.githubusercontent.com/wnnif/personal-hub/main/scripts/update.sh | INSTALL_DIR=/opt/personal-hub bash
```

## Docker 快速开始

```bash
cp .env.example .env
# 按需修改 .env
docker compose up -d --build
```

打开：

- 前台：`http://localhost:3000`
- 后台：`http://localhost:3000/admin`

默认后台账号来自 `.env`：

```bash
ADMIN_EMAIL="admin"
ADMIN_PASSWORD="change_this_admin_password"
```

`.env.example` 使用占位值；公开部署前必须修改 `ADMIN_PASSWORD`、`POSTGRES_PASSWORD`、`ADMIN_SESSION_SECRET` 和 `VISIT_HASH_SALT`，或使用一键安装脚本自动生成强随机值。

生产环境登录页默认不会展示 `admin / 124` 提示；如果你要做公开演示，可显式设置：

```bash
NEXT_PUBLIC_SHOW_DEFAULT_CREDENTIALS="true"
```

容器启动时会自动执行 Prisma 数据库迁移和初始数据写入。

## 本地开发

先启动一个本地 PostgreSQL 数据库，配置 `DATABASE_URL`，然后执行：

```bash
npm install
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
```

## 路由

- `/` 前台导航页
- `/admin` 后台入口、登录页和仪表盘
- `/admin/login` 登录兼容路由
- `/admin/dashboard` 仪表盘
- `/admin/links` 链接管理
- `/admin/categories` 分类管理
- `/admin/profile` 个人资料和联系方式
- `/admin/settings` 全局设置

## 环境变量

```bash
APP_PORT="3000"
DATABASE_URL="postgresql://wnn:change_this_postgres_password@db:5432/wnn_portal?schema=public"
POSTGRES_DB="wnn_portal"
POSTGRES_USER="wnn"
POSTGRES_PASSWORD="change_this_postgres_password"
ADMIN_EMAIL="admin"
ADMIN_PASSWORD="change_this_admin_password"
ADMIN_SESSION_SECRET="change_this_to_a_long_random_session_secret"
VISIT_HASH_SALT="change_this_to_a_long_random_visit_hash_salt"
NEXT_PUBLIC_SHOW_DEFAULT_CREDENTIALS="false"
```

说明：

- `ADMIN_SESSION_SECRET` 生产环境必须设置，用于签名后台登录 cookie。
- 修改 `ADMIN_PASSWORD` 或 `ADMIN_PASSWORD_SHA256` 后，旧登录 cookie 会自动失效。
- `VISIT_HASH_SALT` 用于访问统计 IP 哈希，避免直接保存访客原始 IP。

## 部署

Docker、Docker Compose、Hermes 和 Dok（Docker Compose）部署说明见：[DEPLOYMENT.md](./DEPLOYMENT.md)。英文版：[DEPLOYMENT.en.md](./DEPLOYMENT.en.md)。

## 开源协议

MIT
