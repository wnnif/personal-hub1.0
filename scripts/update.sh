#!/usr/bin/env bash
set -Eeuo pipefail

INSTALL_DIR="${INSTALL_DIR:-/opt/personal-hub1.0}"
BRANCH="${BRANCH:-main}"

log() { printf '\033[1;32m[personal-hub]\033[0m %s\n' "$*"; }
fail() { printf '\033[1;31m[personal-hub]\033[0m %s\n' "$*" >&2; exit 1; }

require_root() {
  if [ "${EUID:-$(id -u)}" -ne 0 ]; then
    fail "请用 root 运行：sudo bash scripts/update.sh"
  fi
}

main() {
  require_root
  [ -d "$INSTALL_DIR/.git" ] || fail "未找到仓库：$INSTALL_DIR。可用 INSTALL_DIR=/你的路径 指定。"
  command -v docker >/dev/null 2>&1 || fail "docker 未安装"
  docker compose version >/dev/null 2>&1 || fail "docker compose plugin 未安装"

  cd "$INSTALL_DIR"
  [ -f .env ] || fail "缺少 .env，请先执行一键安装或手动创建。"

  log "保存当前本地修改检查..."
  if [ -n "$(git status --porcelain)" ]; then
    fail "工作区有未提交修改。为避免覆盖，请先处理：cd $INSTALL_DIR && git status --short"
  fi

  log "拉取 ${BRANCH} 最新代码..."
  git fetch origin "$BRANCH"
  git checkout "$BRANCH"
  git pull --ff-only origin "$BRANCH"

  log "重建并启动服务..."
  docker compose up -d --build

  log "清理旧镜像..."
  docker image prune -f >/dev/null 2>&1 || true

  log "更新完成"
  docker compose ps
}

main "$@"
