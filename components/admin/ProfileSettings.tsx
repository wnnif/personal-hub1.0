"use client";

import { useEffect, useState } from "react";
import { defaultDataset } from "@/lib/default-data";
import { loadPortalDataset, saveProfile, uploadAvatar } from "@/lib/portal-store";
import type { FeaturedLink, Profile, SocialLink } from "@/lib/types";
import { Input } from "./LinksManager";
import { Icon } from "@/components/Icon";

type SocialPatch = Partial<Pick<SocialLink, "label" | "icon" | "url" | "isActive">>;

export function ProfileSettings() {
  const [profile, setProfile] = useState<Profile>(defaultDataset.profile);
  const [socials, setSocials] = useState<SocialLink[]>(defaultDataset.socials.map(normalizeSocialLink));
  const [featuredLinks, setFeaturedLinks] = useState<FeaturedLink[]>(defaultDataset.featuredLinks);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadPortalDataset().then((dataset) => {
      const normalizedSocials = dataset.socials.map(normalizeSocialLink);
      setProfile(dataset.profile);
      setSocials(normalizedSocials);
      setFeaturedLinks(limitActiveFeaturedLinks(syncAllFeaturedFromSocials(dataset.featuredLinks, normalizedSocials)));
    });
  }, []);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const normalizedSocials = socials.map(normalizeSocialLink);
    const normalizedFeatured = limitActiveFeaturedLinks(syncAllFeaturedFromSocials(featuredLinks, normalizedSocials));
    setSocials(normalizedSocials);
    setFeaturedLinks(normalizedFeatured);
    await persistProfile(profile, normalizedSocials, normalizedFeatured);
  }

  async function persistProfile(nextProfile: Profile, nextSocials: SocialLink[], nextFeaturedLinks: FeaturedLink[]) {
    setError("");

    try {
      await saveProfile(nextProfile, nextSocials, nextFeaturedLinks);
      setSaved(true);
      window.setTimeout(() => setSaved(false), 1800);
    } catch {
      setError("保存失败，请稍后重试。");
    }
  }

  async function handleAvatarUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");
    setUploadMessage("");

    try {
      const result = await uploadAvatar(file);
      const nextProfile = { ...profile, avatarUrl: result.url };
      setProfile(nextProfile);
      await persistProfile(nextProfile, socials, featuredLinks);
      setUploadMessage(`已上传并保存到 ${result.path}`);
    } catch {
      setError("头像上传失败，请确认文件是 5MB 以内的图片。");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  function addSocial() {
    setSocials([
      ...socials,
      { id: crypto.randomUUID(), label: "GitHub", icon: "github", url: "", sortOrder: socials.length + 1, isActive: true }
    ]);
  }

  function updateSocial(index: number, patch: SocialPatch) {
    const current = socials[index];
    const nextItem = normalizeSocialLink({ ...current, ...patch });
    const nextSocials = socials.map((social, currentIndex) => (currentIndex === index ? nextItem : social));
    setSocials(nextSocials);
    setFeaturedLinks(limitActiveFeaturedLinks(syncFeaturedFromSocial(featuredLinks, current, nextItem)));
  }

  function toggleLarge(index: number) {
    const source = normalizeSocialLink(socials[index]);
    setFeaturedLinks(toggleFeaturedForSocial(featuredLinks, source));
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      <section className="glass-card rounded-[2rem] p-6">
        <div className="mb-6 flex flex-col gap-5 md:flex-row md:items-center">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-[#b7d4ff] bg-white/80 shadow-lg ring-8 ring-white/30 dark:border-inverse-primary/30 dark:bg-white/10 dark:ring-white/5">
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              className="h-full w-full rounded-full object-cover"
              onError={(event) => {
                event.currentTarget.src = "/avatar.svg";
              }}
            />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold">身份信息</h2>
            <p className="text-sm text-outline">这些内容会显示在前台左侧个人信息卡里。</p>
            <label className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-white transition active:scale-[0.98]">
              <Icon name="upload" className="text-[20px]" />
              {uploading ? "上传中..." : "上传本地头像"}
              <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} disabled={uploading} />
            </label>
            <p className="mt-2 text-xs font-semibold text-outline">本地开发保存到 public/uploads；Docker 部署保存到挂载目录 ./uploads，前台使用 /uploads/文件名 访问。</p>
            {uploadMessage && <p className="mt-2 text-xs font-semibold text-emerald-600">{uploadMessage}</p>}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Input label="显示名称" value={profile.name} onChange={(name) => setProfile({ ...profile, name })} />
          <Input label="头像地址" value={profile.avatarUrl} onChange={(avatarUrl) => setProfile({ ...profile, avatarUrl })} />
          <label className="md:col-span-2">
            <span className="mb-2 block text-sm font-semibold">个人简介</span>
            <textarea value={profile.bio} onChange={(event) => setProfile({ ...profile, bio: event.target.value })} maxLength={160} className="min-h-28 w-full rounded-2xl border-0 bg-white/60 px-4 py-3 focus:ring-2 focus:ring-primary dark:bg-white/5" />
            <span className="mt-1 block text-xs font-semibold text-outline">{profile.bio.length} / 160 字</span>
          </label>
          <Input label="页脚文案" value={profile.footerText} onChange={(footerText) => setProfile({ ...profile, footerText })} className="md:col-span-2" />
        </div>
      </section>

      <section className="glass-card rounded-[2rem] p-6">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">社交按钮</h2>
            <p className="text-sm text-outline">只管理这一组社交入口；图标自动内置匹配，大按钮最多显示 3 个，避免资料卡溢出。</p>
          </div>
          <button type="button" onClick={addSocial} className="rounded-full bg-primary px-4 py-2 text-sm font-bold text-white">
            添加社交入口
          </button>
        </div>
        <div className="mt-4 space-y-3">
          {socials.map((social, index) => (
            <SocialRow
              key={social.id}
              item={social}
              largeVisible={isFeaturedVisibleForSocial(featuredLinks, social)}
              onChange={(patch) => updateSocial(index, patch)}
              onToggleLarge={() => toggleLarge(index)}
            />
          ))}
        </div>
      </section>

      {(error || saved) && (
        <div className={`rounded-3xl px-5 py-4 text-sm font-bold ${error ? "bg-red-500/10 text-red-600" : "bg-emerald-500/10 text-emerald-600"}`}>
          {error || "已保存"}
        </div>
      )}

      <div className="sticky bottom-5 flex justify-end">
        <button type="submit" className="flex items-center gap-2 rounded-full bg-primary px-8 py-4 font-bold text-white shadow-lg shadow-primary/20">
          <Icon name="save" className="text-[20px]" />
          {saved ? "已保存" : "保存修改"}
        </button>
      </div>
    </form>
  );
}

const socialIconRules: Array<{ icon: string; words: string[] }> = [
  { icon: "github", words: ["github", "git"] },
  { icon: "telegram", words: ["telegram", "tg", "t.me"] },
  { icon: "wechat", words: ["wechat", "weixin", "微信"] },
  { icon: "qq", words: ["qq"] },
  { icon: "discord", words: ["discord"] },
  { icon: "x", words: ["twitter", "x.com", "推特"] },
  { icon: "rss", words: ["blog", "rss", "博客"] },
  { icon: "phone", words: ["phone", "tel:", "电话", "手机"] },
  { icon: "mail", words: ["mail", "email", "mailto:", "邮箱"] }
];

function detectSocialIcon(item: { label: string; url: string; icon?: string }) {
  const text = `${item.label} ${item.url}`.toLowerCase();
  return socialIconRules.find((rule) => rule.words.some((word) => text.includes(word.toLowerCase())))?.icon ?? "link";
}

function normalizeSocialLink<T extends SocialLink>(item: T): T {
  return { ...item, icon: detectSocialIcon(item) };
}

function syncFeaturedFromSocial(featured: FeaturedLink[], previous: SocialLink, next: SocialLink) {
  const matchIndex = featured.findIndex((item) => sameContact(item, previous) || sameContact(item, next));
  if (matchIndex < 0) return featured;
  return featured.map((item, index) =>
    index === matchIndex
      ? { ...item, label: next.label, icon: next.icon, url: next.url, hint: item.hint || next.label }
      : item
  );
}

function syncAllFeaturedFromSocials(featured: FeaturedLink[], socials: SocialLink[]) {
  return featured.map((link) => {
    const social = socials.find((item) => sameContact(item, link));
    return social ? { ...link, label: social.label, icon: social.icon, url: social.url, hint: link.hint || social.label } : link;
  });
}

function limitActiveFeaturedLinks(featured: FeaturedLink[], preferredId?: string) {
  const activeItems = featured.filter((item) => item.isActive);
  if (activeItems.length <= 3) return featured;

  const allowedIds = new Set<string>();
  if (preferredId) allowedIds.add(preferredId);
  for (const item of featured) {
    if (!item.isActive || allowedIds.has(item.id)) continue;
    allowedIds.add(item.id);
    if (allowedIds.size >= 3) break;
  }

  return featured.map((item) => (item.isActive && !allowedIds.has(item.id) ? { ...item, isActive: false } : item));
}

function toggleFeaturedForSocial(featured: FeaturedLink[], source: SocialLink) {
  const matchIndex = featured.findIndex((item) => sameContact(item, source));
  if (matchIndex >= 0) {
    const next = featured.map((item, index) =>
      index === matchIndex
        ? { ...item, label: source.label, icon: source.icon, url: source.url, hint: item.hint || source.label, isActive: !item.isActive }
        : item
    );
    return limitActiveFeaturedLinks(next, next[matchIndex]?.id);
  }
  const nextItem = { id: crypto.randomUUID(), label: source.label, icon: source.icon, hint: source.label, url: source.url, sortOrder: featured.length + 1, isActive: true };
  return limitActiveFeaturedLinks([...featured, nextItem], nextItem.id);
}

function isFeaturedVisibleForSocial(featured: FeaturedLink[], source: SocialLink) {
  return Boolean(featured.find((item) => sameContact(item, source))?.isActive);
}

function sameContact(left: { label: string; url: string }, right: { label: string; url: string }) {
  const leftUrl = left.url.trim();
  const rightUrl = right.url.trim();
  if (leftUrl && rightUrl && leftUrl === rightUrl) return true;
  return Boolean(left.label.trim() && right.label.trim() && left.label.trim() === right.label.trim());
}

function SocialRow({
  item,
  largeVisible,
  onChange,
  onToggleLarge
}: {
  item: SocialLink;
  largeVisible: boolean;
  onChange: (patch: SocialPatch) => void;
  onToggleLarge: () => void;
}) {
  const autoIcon = detectSocialIcon(item);
  return (
    <div className="grid min-w-0 gap-3 rounded-3xl bg-white/40 p-4 dark:bg-white/5 xl:grid-cols-[minmax(220px,1fr)_minmax(0,1.6fr)_auto]">
      <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-1">
        <input value={item.label} onChange={(event) => onChange({ label: event.target.value })} className="min-w-0 rounded-2xl border-0 bg-white/70 px-4 py-3 dark:bg-slate-950" placeholder="名称，例如 GitHub / Telegram / 微信" />
        <div className="flex items-center gap-2 rounded-2xl bg-white/50 px-4 py-3 text-sm font-semibold text-outline dark:bg-slate-950">
          <Icon name={autoIcon} className="text-[20px] text-primary dark:text-inverse-primary" />
          图标内置自动匹配
        </div>
      </div>

      <div className="grid gap-2">
        <input value={item.url} onChange={(event) => onChange({ url: event.target.value })} className="min-w-0 rounded-2xl border-0 bg-white/70 px-4 py-3 dark:bg-slate-950" placeholder="链接地址" />
      </div>

      <div className="flex flex-wrap items-center gap-2 xl:flex-col xl:items-stretch">
        <button type="button" onClick={() => onChange({ isActive: !item.isActive })} className={`rounded-full px-3 py-2 text-xs font-bold ${item.isActive ? "bg-emerald-500/10 text-emerald-600" : "bg-slate-500/10 text-slate-500"}`}>
          小图标{item.isActive ? "显示" : "关闭"}
        </button>
        <button type="button" onClick={onToggleLarge} className={`rounded-full px-3 py-2 text-xs font-bold ${largeVisible ? "bg-emerald-500/10 text-emerald-600" : "bg-slate-500/10 text-slate-500"}`}>
          大按钮{largeVisible ? "显示" : "关闭"}
        </button>
      </div>
    </div>
  );
}
