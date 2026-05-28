"use client";

import { useEffect, useState } from "react";
import { defaultDataset } from "@/lib/default-data";
import { loadPortalDataset, saveProfile, uploadAvatar } from "@/lib/portal-store";
import type { FeaturedLink, Profile, SocialLink } from "@/lib/types";
import { Input } from "./LinksManager";
import { Icon } from "@/components/Icon";

export function ProfileSettings() {
  const [profile, setProfile] = useState<Profile>(defaultDataset.profile);
  const [socials, setSocials] = useState<SocialLink[]>(defaultDataset.socials);
  const [featuredLinks, setFeaturedLinks] = useState<FeaturedLink[]>(defaultDataset.featuredLinks);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadPortalDataset().then((dataset) => {
      setProfile(dataset.profile);
      setSocials(dataset.socials);
      setFeaturedLinks(dataset.featuredLinks);
    });
  }, []);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    await persistProfile(profile, socials, featuredLinks);
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
          <Input label="页脚 HTML" value={profile.footerText} onChange={(footerText) => setProfile({ ...profile, footerText })} className="md:col-span-2" />
        </div>
      </section>

      <section className="glass-card rounded-[2rem] p-6">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">小图标按钮</h2>
            <p className="text-sm text-outline">控制头像下方的小图标矩阵。只有开启显示并填写真实链接时才会出现在前台。</p>
          </div>
          <button type="button" onClick={addSocial} className="rounded-full bg-primary px-4 py-2 text-sm font-bold text-white">
            添加小按钮
          </button>
        </div>
        <div className="space-y-3">
          {socials.map((social, index) => (
            <div key={social.id} className="grid min-w-0 gap-3 rounded-3xl bg-white/40 p-4 dark:bg-white/5 lg:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.4fr)_auto]">
              <input value={social.label} onChange={(event) => updateSocial(index, { label: event.target.value })} className="min-w-0 rounded-2xl border-0 bg-white/70 px-4 py-3 dark:bg-slate-950" placeholder="名称" />
              <input value={social.icon} onChange={(event) => updateSocial(index, { icon: event.target.value })} className="min-w-0 rounded-2xl border-0 bg-white/70 px-4 py-3 dark:bg-slate-950" placeholder="图标" />
              <input value={social.url} onChange={(event) => updateSocial(index, { url: event.target.value })} className="min-w-0 rounded-2xl border-0 bg-white/70 px-4 py-3 dark:bg-slate-950 lg:col-span-2 xl:col-span-1" placeholder="链接地址" />
              <button type="button" onClick={() => updateSocial(index, { isActive: !social.isActive })} className={`rounded-full px-3 py-2 text-xs font-bold ${social.isActive ? "bg-emerald-500/10 text-emerald-600" : "bg-slate-500/10 text-slate-500"}`}>
                {social.isActive ? "显示" : "隐藏"}
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="glass-card rounded-[2rem] p-6">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">大按钮卡片</h2>
            <p className="text-sm text-outline">控制左侧信息卡里的大号联系按钮。它和上面的小图标按钮互不强制同步。</p>
          </div>
          <button type="button" onClick={addFeaturedLink} className="rounded-full bg-primary px-4 py-2 text-sm font-bold text-white">
            添加大按钮
          </button>
        </div>
        <div className="space-y-3">
          {featuredLinks.map((link, index) => (
            <div key={link.id} className="grid min-w-0 gap-3 rounded-3xl bg-white/40 p-4 dark:bg-white/5 lg:grid-cols-2 2xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.4fr)_auto]">
              <input value={link.label} onChange={(event) => updateFeatured(index, { label: event.target.value })} className="min-w-0 rounded-2xl border-0 bg-white/70 px-4 py-3 dark:bg-slate-950" placeholder="名称" />
              <input value={link.icon} onChange={(event) => updateFeatured(index, { icon: event.target.value })} className="min-w-0 rounded-2xl border-0 bg-white/70 px-4 py-3 dark:bg-slate-950" placeholder="图标" />
              <input value={link.hint} onChange={(event) => updateFeatured(index, { hint: event.target.value })} className="min-w-0 rounded-2xl border-0 bg-white/70 px-4 py-3 dark:bg-slate-950" placeholder="悬浮提示" />
              <input value={link.url} onChange={(event) => updateFeatured(index, { url: event.target.value })} className="min-w-0 rounded-2xl border-0 bg-white/70 px-4 py-3 dark:bg-slate-950" placeholder="链接地址" />
              <button type="button" onClick={() => updateFeatured(index, { isActive: !link.isActive })} className={`rounded-full px-3 py-2 text-xs font-bold ${link.isActive ? "bg-emerald-500/10 text-emerald-600" : "bg-slate-500/10 text-slate-500"}`}>
                {link.isActive ? "显示" : "隐藏"}
              </button>
            </div>
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

  function addSocial() {
    setSocials([...socials, { id: crypto.randomUUID(), label: "新小按钮", icon: "link", url: "", sortOrder: socials.length + 1, isActive: true }]);
  }

  function addFeaturedLink() {
    setFeaturedLinks([...featuredLinks, { id: crypto.randomUUID(), label: "新大按钮", icon: "link", hint: "", url: "", sortOrder: featuredLinks.length + 1, isActive: true }]);
  }

  function updateSocial(index: number, patch: Partial<SocialLink>) {
    setSocials(socials.map((social, current) => (current === index ? { ...social, ...patch } : social)));
  }

  function updateFeatured(index: number, patch: Partial<FeaturedLink>) {
    setFeaturedLinks(featuredLinks.map((link, current) => (current === index ? { ...link, ...patch } : link)));
  }
}
