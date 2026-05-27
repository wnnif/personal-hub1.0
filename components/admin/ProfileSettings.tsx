"use client";

import { useEffect, useMemo, useState } from "react";
import { defaultDataset } from "@/lib/default-data";
import { loadPortalDataset, saveProfile, uploadAvatar } from "@/lib/portal-store";
import type { FeaturedLink, Profile, SocialLink } from "@/lib/types";
import { Input } from "./LinksManager";

export function ProfileSettings() {
  const [profile, setProfile] = useState<Profile>(defaultDataset.profile);
  const [socials, setSocials] = useState<SocialLink[]>(defaultDataset.socials);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  const [error, setError] = useState("");

  const syncedFeaturedLinks = useMemo(() => toFeaturedLinks(socials), [socials]);
  const visibleContactLinks = syncedFeaturedLinks.filter((link) => link.isActive && hasUsableUrl(link.url));

  useEffect(() => {
    loadPortalDataset().then((dataset) => {
      setProfile(dataset.profile);
      setSocials(dataset.socials);
    });
  }, []);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");

    try {
      await saveProfile(profile, socials, syncedFeaturedLinks);
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
      setProfile((current) => ({ ...current, avatarUrl: result.url }));
      setUploadMessage(`已上传到 ${result.path}`);
    } catch {
      setError("头像上传失败，请确认文件是 5MB 以内的图片。");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      <section className="glass-card rounded-[2rem] p-6">
        <div className="mb-6 flex flex-col gap-5 md:flex-row md:items-center">
          <img
            src={profile.avatarUrl}
            alt={profile.name}
            className="h-24 w-24 rounded-full object-cover shadow-lg"
            onError={(event) => {
              event.currentTarget.src = "/avatar.svg";
            }}
          />
          <div className="flex-1">
            <h2 className="text-2xl font-bold">身份信息</h2>
            <p className="text-sm text-outline">这些内容会显示在前台左侧个人信息卡里。</p>
            <label className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-white transition active:scale-[0.98]">
              <span className="material-symbols-outlined text-[20px]">upload</span>
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
          <Input label="页脚 HTML" value={profile.footerText} onChange={(footerText) => setProfile({ ...profile, footerText })} className="md:col-span-2" />
        </div>
      </section>

      <section className="glass-card rounded-[2rem] p-6">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">联系按钮</h2>
            <p className="text-sm text-outline">这里维护一份内容。填了真实链接并设为显示时，前台会同时出现小图标和大按钮。</p>
          </div>
          <button type="button" onClick={addSocial} className="rounded-full bg-primary px-4 py-2 text-sm font-bold text-white">
            添加
          </button>
        </div>
        <div className="space-y-3">
          {socials.map((social, index) => (
            <div key={social.id} className="grid gap-3 rounded-3xl bg-white/40 p-4 dark:bg-white/5 md:grid-cols-[1fr_1fr_1.4fr_auto]">
              <input value={social.label} onChange={(event) => updateSocial(index, { label: event.target.value })} className="rounded-2xl border-0 bg-white/70 px-4 py-3 dark:bg-slate-950" placeholder="名称" />
              <input value={social.icon} onChange={(event) => updateSocial(index, { icon: event.target.value })} className="rounded-2xl border-0 bg-white/70 px-4 py-3 dark:bg-slate-950" placeholder="图标" />
              <input value={social.url} onChange={(event) => updateSocial(index, { url: event.target.value })} className="rounded-2xl border-0 bg-white/70 px-4 py-3 dark:bg-slate-950" placeholder="链接地址" />
              <button type="button" onClick={() => updateSocial(index, { isActive: !social.isActive })} className={`rounded-full px-3 py-2 text-xs font-bold ${social.isActive ? "bg-emerald-500/10 text-emerald-600" : "bg-slate-500/10 text-slate-500"}`}>
                {social.isActive ? "显示" : "隐藏"}
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="glass-card rounded-[2rem] p-6">
        <h2 className="mb-2 text-2xl font-bold">前台大按钮预览</h2>
        <p className="mb-6 text-sm text-outline">大按钮会自动同步上面的联系按钮，不再单独编辑，避免小按钮和大按钮内容不一致。</p>
        <div className="flex flex-col gap-3 md:max-w-md">
          {visibleContactLinks.length > 0 ? (
            visibleContactLinks.map((link) => (
              <div key={link.id} className="flex items-center justify-center gap-2 rounded-3xl bg-white/60 px-6 py-4 font-bold dark:bg-white/5">
                <span className="material-symbols-outlined text-[22px]">{link.icon}</span>
                {link.label}
              </div>
            ))
          ) : (
            <div className="rounded-3xl bg-white/50 px-5 py-4 text-sm font-semibold text-outline dark:bg-white/5">还没有可显示的联系按钮。</div>
          )}
        </div>
      </section>

      {(error || saved) && (
        <div className={`rounded-3xl px-5 py-4 text-sm font-bold ${error ? "bg-red-500/10 text-red-600" : "bg-emerald-500/10 text-emerald-600"}`}>
          {error || "已保存"}
        </div>
      )}

      <div className="sticky bottom-5 flex justify-end">
        <button type="submit" className="flex items-center gap-2 rounded-full bg-primary px-8 py-4 font-bold text-white shadow-lg shadow-primary/20">
          <span className="material-symbols-outlined text-[20px]">save</span>
          {saved ? "已保存" : "保存修改"}
        </button>
      </div>
    </form>
  );

  function addSocial() {
    setSocials([...socials, { id: crypto.randomUUID(), label: "新链接", icon: "link", url: "", sortOrder: socials.length + 1, isActive: true }]);
  }

  function updateSocial(index: number, patch: Partial<SocialLink>) {
    setSocials(socials.map((social, current) => (current === index ? { ...social, ...patch } : social)));
  }
}

function toFeaturedLinks(socials: SocialLink[]): FeaturedLink[] {
  return socials.map((social) => ({
    id: social.id,
    label: social.label,
    icon: social.icon,
    hint: displayUrl(social.url),
    url: social.url,
    sortOrder: social.sortOrder,
    isActive: social.isActive
  }));
}

function displayUrl(url: string) {
  if (!url || url === "#") return "";
  return url.replace(/^https?:\/\//, "");
}

function hasUsableUrl(url: string) {
  return Boolean(url && url.trim() && url.trim() !== "#");
}
