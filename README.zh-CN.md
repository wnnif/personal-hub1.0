# Personal Hub 1.0

[English](./README.md) | 简体中文

Personal Hub 1.0 是一个开源、自托管的个人导航站，内置后台管理系统。它适合用作个人主页、链接导航、开发者入口页、轻量起始页。

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
- 全局站点设置
- 明暗模式
- 每日访问人数统计
- Docker 优先的自托管部署

## Docker 快速开始

```bash
cp .env.example .env
docker compose up -d --build
```

打开：

- 前台：`http://localhost:3000`
- 后台：`http://localhost:3000/admin`

默认后台账号来自 `.env`：

```bash
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="change-me-now"
```

正式公开访问前，请务必修改默认密码。

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
DATABASE_URL="postgresql://wnn:change_me@db:5432/wnn_portal?schema=public"
POSTGRES_DB="wnn_portal"
POSTGRES_USER="wnn"
POSTGRES_PASSWORD="change_me"
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="change-me-now"
ADMIN_SESSION_SECRET="replace-with-a-long-random-string"
```

生产环境请使用强密码，并设置足够长的 `ADMIN_SESSION_SECRET`。

## 部署

Docker、Docker Compose、Hermes 和 Dok（Docker Compose）部署说明见：[DEPLOYMENT.zh-CN.md](./DEPLOYMENT.zh-CN.md)。

## 开源协议

MIT
