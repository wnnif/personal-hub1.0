"use client";

import type { Category, FeaturedLink, PortalDataset, PortalLink, Profile, SiteSettings, SocialLink } from "./types";

async function requestJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {})
    }
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as { error?: string };
    throw new Error(body.error ?? `Request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function loadPortalDataset(): Promise<PortalDataset> {
  return requestJson<PortalDataset>("/api/public");
}

export async function saveLink(link: PortalLink) {
  await requestJson("/api/admin/links", {
    method: "POST",
    body: JSON.stringify(link)
  });
}

export async function deleteLink(id: string) {
  await requestJson(`/api/admin/links/${encodeURIComponent(id)}`, { method: "DELETE" });
}

export async function saveCategory(category: Category) {
  await requestJson("/api/admin/categories", {
    method: "POST",
    body: JSON.stringify(category)
  });
}

export async function deleteCategory(id: string) {
  await requestJson(`/api/admin/categories/${encodeURIComponent(id)}`, { method: "DELETE" });
}

export async function saveProfile(profile: Profile, socials: SocialLink[], featuredLinks: FeaturedLink[]) {
  await requestJson("/api/admin/profile", {
    method: "PUT",
    body: JSON.stringify({ profile, socials, featuredLinks })
  });
}

export async function saveSettings(settings: SiteSettings) {
  await requestJson("/api/admin/settings", {
    method: "PUT",
    body: JSON.stringify(settings)
  });
}

export type UploadResult = {
  url: string;
  path: string;
  filename: string;
};

export async function uploadAvatar(file: File): Promise<UploadResult> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/admin/upload", {
    method: "POST",
    body: formData
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as { error?: string };
    throw new Error(body.error ?? `Upload failed: ${response.status}`);
  }

  return response.json() as Promise<UploadResult>;
}
