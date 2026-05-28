const ABSOLUTE_SAFE_PROTOCOL_RE = /^(https?:|mailto:|tel:)/i;
const EXTERNAL_HTTP_RE = /^https?:\/\//i;

export function normalizeUrl(url: string) {
  const value = url.trim();
  if (!value || value === "#") return "#";
  if (ABSOLUTE_SAFE_PROTOCOL_RE.test(value)) return value;
  if (value.startsWith("/") || value.startsWith("#")) return value;
  return `https://${value}`;
}

export function displayUrl(url: string) {
  return normalizeUrl(url).replace(/^https?:\/\//i, "");
}

export function isExternalUrl(url: string) {
  return EXTERNAL_HTTP_RE.test(url.trim());
}

export function hasUsableUrl(url: string) {
  const value = url.trim();
  return Boolean(value && value !== "#");
}
