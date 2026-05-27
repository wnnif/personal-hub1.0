"use client";

import { defaultDataset } from "./default-data";
import type { Category, FeaturedLink, PortalDataset, PortalLink, Profile, SiteSettings, SocialLink } from "./types";

const STORAGE_KEY = "wnn-portal-demo-data";
const LOCAL_FALLBACK_KEY = "wnn-portal-use-local-data";

function cloneDefault(): PortalDataset {
  return JSON.parse(JSON.stringify(defaultDataset)) as PortalDataset;
}

function getLocalDataset(): PortalDataset {
  if (typeof window === "undefined") {
    return cloneDefault();
  }

  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    return cloneDefault();
  }

  try {
    return { ...cloneDefault(), ...(JSON.parse(saved) as PortalDataset) };
  } catch {
    return cloneDefault();
  }
}

function saveLocalDataset(dataset: PortalDataset) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(dataset));
}

function withCategoryNames(links: PortalLink[], categories: Category[]) {
  return links.map((link) => ({
    ...link,
    categoryName: categories.find((category) => category.id === link.categoryId)?.name ?? link.categoryName
  }));
}

async function requestJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {})
    }
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function loadPortalDataset(): Promise<PortalDataset> {
  if (shouldUseLocalFallback()) {
    return getLocalDataset();
  }

  try {
    return await requestJson<PortalDataset>("/api/public");
  } catch {
    setLocalFallback(true);
    return getLocalDataset();
  }
}

export async function saveLink(link: PortalLink) {
  try {
    await requestJson("/api/admin/links", {
      method: "POST",
      body: JSON.stringify(link)
    });
    setLocalFallback(false);
    return;
  } catch {
    setLocalFallback(true);
    mutateLocal((dataset) => {
      const links = dataset.links.filter((item) => item.id !== link.id);
      return { ...dataset, links: withCategoryNames([...links, link].sort((a, b) => a.sortOrder - b.sortOrder), dataset.categories) };
    });
  }
}

export async function deleteLink(id: string) {
  try {
    await requestJson(`/api/admin/links/${encodeURIComponent(id)}`, { method: "DELETE" });
    setLocalFallback(false);
    return;
  } catch {
    setLocalFallback(true);
    mutateLocal((dataset) => ({ ...dataset, links: dataset.links.filter((link) => link.id !== id) }));
  }
}

export async function saveCategory(category: Category) {
  try {
    await requestJson("/api/admin/categories", {
      method: "POST",
      body: JSON.stringify(category)
    });
    setLocalFallback(false);
    return;
  } catch {
    setLocalFallback(true);
    mutateLocal((dataset) => {
      const categories = dataset.categories.filter((item) => item.id !== category.id);
      const nextCategories = [...categories, category].sort((a, b) => a.sortOrder - b.sortOrder);
      return { ...dataset, categories: nextCategories, links: withCategoryNames(dataset.links, nextCategories) };
    });
  }
}

export async function deleteCategory(id: string) {
  try {
    await requestJson(`/api/admin/categories/${encodeURIComponent(id)}`, { method: "DELETE" });
    setLocalFallback(false);
    return;
  } catch {
    setLocalFallback(true);
    mutateLocal((dataset) => ({ ...dataset, categories: dataset.categories.filter((category) => category.id !== id) }));
  }
}

export async function saveProfile(profile: Profile, socials: SocialLink[], featuredLinks: FeaturedLink[]) {
  try {
    await requestJson("/api/admin/profile", {
      method: "PUT",
      body: JSON.stringify({ profile, socials, featuredLinks })
    });
    setLocalFallback(false);
    return;
  } catch {
    setLocalFallback(true);
    mutateLocal((dataset) => ({ ...dataset, profile, socials, featuredLinks }));
  }
}

export async function saveSettings(settings: SiteSettings) {
  try {
    await requestJson("/api/admin/settings", {
      method: "PUT",
      body: JSON.stringify(settings)
    });
    setLocalFallback(false);
    return;
  } catch {
    setLocalFallback(true);
    mutateLocal((dataset) => ({ ...dataset, settings }));
  }
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
    throw new Error(`Upload failed: ${response.status}`);
  }

  return response.json() as Promise<UploadResult>;
}

function mutateLocal(mutator: (dataset: PortalDataset) => PortalDataset) {
  const next = mutator(getLocalDataset());
  saveLocalDataset(next);
  return next;
}

function shouldUseLocalFallback() {
  return typeof window !== "undefined" && window.localStorage.getItem(LOCAL_FALLBACK_KEY) === "1";
}

function setLocalFallback(value: boolean) {
  if (typeof window === "undefined") return;

  if (value) {
    window.localStorage.setItem(LOCAL_FALLBACK_KEY, "1");
    return;
  }

  window.localStorage.removeItem(LOCAL_FALLBACK_KEY);
}
