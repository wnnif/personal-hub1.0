/**
 * 极简输入校验/清洗工具，避免引入 zod 等额外依赖。
 *
 * - 所有字符串字段强制转换为 string 并做长度截断。
 * - 数字字段做 Number 转换并 clamp 到合理范围。
 * - 布尔字段做严格 Boolean 转换。
 * - URL 字段仅允许 http(s)、mailto、tel、站内相对路径或锚点，否则置空。
 *
 * 这些函数返回的对象可安全用于 Prisma upsert：字段类型可控、不会写入意外属性。
 */

import type { Category, FeaturedLink, PortalLink, Profile, SiteSettings, SocialLink } from "./types";

const MAX_TEXT = 500;
const MAX_LONG_TEXT = 5000;
const MAX_URL = 2000;
const MAX_ID = 100;

export function sanitizeString(value: unknown, maxLength = MAX_TEXT) {
  if (value == null) return "";
  return String(value).slice(0, maxLength);
}

export function sanitizeId(value: unknown) {
  const raw = sanitizeString(value, MAX_ID);
  // 限制为字母数字/下划线/连字符，避免奇怪的 id 引发数据库或路由问题。
  return raw.replace(/[^a-zA-Z0-9_\-:.]/g, "");
}

export function sanitizeNumber(value: unknown, fallback = 0, min = -1_000_000, max = 1_000_000) {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(min, Math.min(max, Math.round(n)));
}

export function sanitizeBoolean(value: unknown, fallback = true) {
  if (typeof value === "boolean") return value;
  if (value == null) return fallback;
  return Boolean(value);
}

/**
 * 仅允许安全协议，阻断 javascript:/data: 等危险协议。
 * 兼容联系方式常见的 mailto:/tel: 以及站内锚点 #。
 */
export function sanitizeUrl(value: unknown, { allowEmpty = true }: { allowEmpty?: boolean } = {}) {
  const raw = sanitizeString(value, MAX_URL).trim();
  if (!raw) return allowEmpty ? "" : "#";
  if (raw === "#" || raw.startsWith("/#") || raw.startsWith("/")) return raw;
  if (/^(https?:|mailto:|tel:)/i.test(raw)) return raw;
  return allowEmpty ? "" : "#";
}

/**
 * 强转换为对象，否则返回空对象。配合解构 + sanitize 使用，安全地丢弃意外字段。
 */
export function asObject(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}

export function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

// ----------------- 业务实体级清洗 -----------------

export function sanitizeProfile(input: unknown): Profile {
  const o = asObject(input);
  return {
    name: sanitizeString(o.name, 100),
    bio: sanitizeString(o.bio, MAX_LONG_TEXT),
    avatarUrl: sanitizeUrl(o.avatarUrl),
    footerText: sanitizeFooterText(o.footerText)
  };
}

/**
 * footer 文案历史上允许 <br /> 换行。为防 XSS 又向后兼容旧数据：
 * - 先把 <br>/<br/>/<br /> 之类的换行标签替换成换行符
 * - 再剥掉所有其它 HTML 标签
 * - 最后做长度截断
 *
 * 前端使用 `white-space: pre-line` 渲染换行，永远不再走 dangerouslySetInnerHTML。
 */
export function sanitizeFooterText(value: unknown) {
  const raw = sanitizeString(value, MAX_LONG_TEXT);
  const withNewlines = raw.replace(/<br\s*\/?\s*>/gi, "\n");
  const stripped = withNewlines.replace(/<[^>]*>/g, "");
  return stripped.slice(0, MAX_LONG_TEXT);
}

export function sanitizeSettings(input: unknown): SiteSettings {
  const o = asObject(input);
  const theme = sanitizeString(o.defaultTheme, 16);
  return {
    siteTitle: sanitizeString(o.siteTitle, 200),
    seoDescription: sanitizeString(o.seoDescription, MAX_LONG_TEXT),
    defaultTheme: (theme === "dark" || theme === "light" || theme === "system" ? theme : "system") as SiteSettings["defaultTheme"],
    analyticsId: sanitizeString(o.analyticsId, 200)
  };
}

export function sanitizeLink(input: unknown): PortalLink {
  const o = asObject(input);
  return {
    id: sanitizeId(o.id) || `link-${Date.now()}`,
    title: sanitizeString(o.title, 200),
    description: sanitizeString(o.description, 500),
    url: sanitizeUrl(o.url),
    icon: sanitizeString(o.icon, 100),
    categoryId: sanitizeId(o.categoryId),
    categoryName: sanitizeString(o.categoryName, 100),
    sortOrder: sanitizeNumber(o.sortOrder, 0, 0, 100000),
    isActive: sanitizeBoolean(o.isActive)
  };
}

export function sanitizeCategory(input: unknown): Category {
  const o = asObject(input);
  return {
    id: sanitizeId(o.id) || `cat-${Date.now()}`,
    name: sanitizeString(o.name, 100),
    icon: sanitizeString(o.icon, 100),
    sortOrder: sanitizeNumber(o.sortOrder, 0, 0, 100000),
    isActive: sanitizeBoolean(o.isActive)
  };
}

export function sanitizeSocial(input: unknown): SocialLink {
  const o = asObject(input);
  return {
    id: sanitizeId(o.id) || `social-${Date.now()}`,
    label: sanitizeString(o.label, 100),
    icon: sanitizeString(o.icon, 100),
    url: sanitizeUrl(o.url),
    sortOrder: sanitizeNumber(o.sortOrder, 0, 0, 100000),
    isActive: sanitizeBoolean(o.isActive)
  };
}

export function sanitizeFeatured(input: unknown): FeaturedLink {
  const o = asObject(input);
  return {
    id: sanitizeId(o.id) || `featured-${Date.now()}`,
    label: sanitizeString(o.label, 100),
    icon: sanitizeString(o.icon, 100),
    hint: sanitizeString(o.hint, 200),
    url: sanitizeUrl(o.url),
    sortOrder: sanitizeNumber(o.sortOrder, 0, 0, 100000),
    isActive: sanitizeBoolean(o.isActive)
  };
}

export function sanitizeProfilePayload(input: unknown) {
  const o = asObject(input);
  return {
    profile: sanitizeProfile(o.profile),
    socials: asArray(o.socials).slice(0, 50).map(sanitizeSocial),
    featuredLinks: asArray(o.featuredLinks).slice(0, 50).map(sanitizeFeatured)
  };
}
