#!/usr/bin/env bash
set -Eeuo pipefail

REPO_URL="${REPO_URL:-https://github.com/wnnif/personal-hub.git}"
INSTALL_DIR="${INSTALL_DIR:-/opt/personal-hub}"
APP_PORT="${APP_PORT:-3000}"
ADMIN_EMAIL="${ADMIN_EMAIL:-admin}"
ADMIN_PASSWORD="${ADMIN_PASSWORD:-124}"

log() { printf '\033[1;32m[personal-hub]\033[0m %s\n' "$*"; }
warn() { printf '\033[1;33m[personal-hub]\033[0m %s\n' "$*"; }
fail() { printf '\033[1;31m[personal-hub]\033[0m %s\n' "$*" >&2; exit 1; }

require_root() {
  if [ "${EUID:-$(id -u)}" -ne 0 ]; then
    fail "请用 root 运行：sudo bash scripts/install.sh"
  fi
}

install_packages() {
  if command -v apt-get >/dev/null 2>&1; then
    export DEBIAN_FRONTEND=noninteractive
    apt-get update
    apt-get install -y git curl ca-certificates openssl docker.io
    if ! apt-get install -y docker-compose-plugin; then
      apt-get install -y docker-compose
    fi
  elif command -v dnf >/dev/null 2>&1; then
    dnf install -y git curl ca-certificates openssl docker docker-compose-plugin
    systemctl enable --now docker
  elif command -v yum >/dev/null 2>&1; then
    yum install -y git curl ca-certificates openssl docker docker-compose-plugin
    systemctl enable --now docker
  else
    fail "不支持的系统：请先安装 git、curl、openssl、docker 和 docker compose plugin。"
  fi

  systemctl enable --now docker >/dev/null 2>&1 || true
}

ensure_compose() {
  command -v docker >/dev/null 2>&1 || fail "docker 未安装成功"
  docker compose version >/dev/null 2>&1 || fail "docker compose 未安装成功"
}

make_env() {
  cd "$INSTALL_DIR"
  if [ -f .env ]; then
    warn ".env 已存在，保留原配置。"
    return
  fi

  local db_pass session_secret visit_salt
  db_pass="$(openssl rand -hex 24)"
  session_secret="$(openssl rand -hex 32)"
  visit_salt="$(openssl rand -hex 32)"

  cat > .env <<ENV
APP_PORT="${APP_PORT}"

POSTGRES_DB="wnn_portal"
POSTGRES_USER="wnn"
POSTGRES_PASSWORD="${db_pass}"
DATABASE_URL="postgresql://wnn:${db_pass}@db:5432/wnn_portal?schema=public"

ADMIN_EMAIL="${ADMIN_EMAIL}"
ADMIN_PASSWORD="${ADMIN_PASSWORD}"
ADMIN_SESSION_SECRET="${session_secret}"
VISIT_HASH_SALT="${visit_salt}"
NEXT_PUBLIC_SHOW_DEFAULT_CREDENTIALS="false"
ENV
  chmod 600 .env
}

main() {
  require_root
  install_packages
  ensure_compose

  if [ -d "$INSTALL_DIR/.git" ]; then
    log "目录已存在，切换到 main 并拉取最新代码：$INSTALL_DIR"
    git -C "$INSTALL_DIR" checkout main
    git -C "$INSTALL_DIR" pull origin main
  elif [ -e "$INSTALL_DIR" ] && [ "$(find "$INSTALL_DIR" -mindepth 1 -maxdepth 1 2>/dev/null | head -n 1)" ]; then
    fail "$INSTALL_DIR 已存在且不是空目录。请换 INSTALL_DIR 或手动处理。"
  else
    mkdir -p "$(dirname "$INSTALL_DIR")"
    git clone --branch main "$REPO_URL" "$INSTALL_DIR"
  fi

  make_env

  cd "$INSTALL_DIR"
  log "启动 Docker Compose..."
  docker compose up -d --build

  log "安装完成"
  log "前台：http://服务器IP:${APP_PORT}"
  log "后台：http://服务器IP:${APP_PORT}/admin"
  log "后台账号：${ADMIN_EMAIL}"
  log "后台密码：${ADMIN_PASSWORD}"
  warn "公开部署前建议修改 $INSTALL_DIR/.env 里的 ADMIN_PASSWORD，然后执行一键更新命令。"
}

main "$@"
