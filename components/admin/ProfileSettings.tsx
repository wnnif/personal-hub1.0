"use client";

import { useEffect, useState } from "react";
import { defaultDataset } from "@/lib/default-data";
import { loadPortalDataset, saveProfile } from "@/lib/portal-store";
import type { FeaturedLink, PortalDataset, Profile, SocialLink } from "@/lib/types";
import { Input } from "./LinksManager";

export function ProfileSettings() {
  const [data, setData] = useState<PortalDataset>(defaultDataset);
  const [profile, setProfile] = useState<Profile>(defaultDataset.profile);
  const [socials, setSocials] = useState<SocialLink[]>(defaultDataset.socials);
  const [featuredLinks, setFeaturedLinks] = useState<FeaturedLink[]>(defaultDataset.featuredLinks);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadPortalDataset().then((dataset) => {
      setData(dataset);
      setProfile(dataset.profile);
      setSocials(dataset.socials);
      setFeaturedLinks(dataset.featuredLinks);
    });
  }, []);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    await saveProfile(profile, socials, featuredLinks);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      <section className="glass-card rounded-[2rem] p-6">
        <div className="mb-6 flex items-center gap-4">
          <img src={profile.avatarUrl} alt={profile.name} className="h-20 w-20 rounded-3xl object-cover" />
          <div>
            <h2 className="text-2xl font-bold">Identity</h2>
            <p className="text-sm text-outline">Public profile shown in the left sidebar.</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="Display Name" value={profile.name} onChange={(name) => setProfile({ ...profile, name })} />
          <Input label="Avatar URL" value={profile.avatarUrl} onChange={(avatarUrl) => setProfile({ ...profile, avatarUrl })} />
          <label className="md:col-span-2">
            <span className="mb-2 block text-sm font-semibold">Short Biography</span>
            <textarea value={profile.bio} onChange={(event) => setProfile({ ...profile, bio: event.target.value })} maxLength={160} className="min-h-28 w-full rounded-2xl border-0 bg-white/60 px-4 py-3 focus:ring-2 focus:ring-primary dark:bg-white/5" />
            <span className="mt-1 block text-xs font-semibold text-outline">{profile.bio.length} / 160 characters</span>
          </label>
          <Input label="Footer HTML" value={profile.footerText} onChange={(footerText) => setProfile({ ...profile, footerText })} className="md:col-span-2" />
        </div>
      </section>

      <section className="glass-card rounded-[2rem] p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Connect</h2>
            <p className="text-sm text-outline">Social icon matrix in the public portal.</p>
          </div>
          <button type="button" onClick={() => setSocials([...socials, { id: crypto.randomUUID(), label: "New", icon: "link", url: "#", sortOrder: socials.length + 1, isActive: true }])} className="rounded-full bg-primary px-4 py-2 text-sm font-bold text-white">
            Add
          </button>
        </div>
        <div className="space-y-3">
          {socials.map((social, index) => (
            <div key={social.id} className="grid gap-3 rounded-3xl bg-white/40 p-4 dark:bg-white/5 md:grid-cols-[1fr_1fr_1.4fr_auto]">
              <input value={social.label} onChange={(event) => updateSocial(index, { label: event.target.value })} className="rounded-2xl border-0 bg-white/70 px-4 py-3 dark:bg-slate-950" placeholder="Label" />
              <input value={social.icon} onChange={(event) => updateSocial(index, { icon: event.target.value })} className="rounded-2xl border-0 bg-white/70 px-4 py-3 dark:bg-slate-950" placeholder="Icon" />
              <input value={social.url} onChange={(event) => updateSocial(index, { url: event.target.value })} className="rounded-2xl border-0 bg-white/70 px-4 py-3 dark:bg-slate-950" placeholder="URL" />
              <button type="button" onClick={() => updateSocial(index, { isActive: !social.isActive })} className={`rounded-full px-3 py-2 text-xs font-bold ${social.isActive ? "bg-emerald-500/10 text-emerald-600" : "bg-slate-500/10 text-slate-500"}`}>
                {social.isActive ? "Active" : "Hidden"}
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="glass-card rounded-[2rem] p-6">
        <h2 className="mb-6 text-2xl font-bold">Featured Contact Cards</h2>
        <div className="space-y-3">
          {featuredLinks.map((link, index) => (
            <div key={link.id} className="grid gap-3 rounded-3xl bg-white/40 p-4 dark:bg-white/5 md:grid-cols-[1fr_1fr_1fr_1.4fr_auto]">
              <input value={link.label} onChange={(event) => updateFeatured(index, { label: event.target.value })} className="rounded-2xl border-0 bg-white/70 px-4 py-3 dark:bg-slate-950" placeholder="Label" />
              <input value={link.icon} onChange={(event) => updateFeatured(index, { icon: event.target.value })} className="rounded-2xl border-0 bg-white/70 px-4 py-3 dark:bg-slate-950" placeholder="Icon" />
              <input value={link.hint} onChange={(event) => updateFeatured(index, { hint: event.target.value })} className="rounded-2xl border-0 bg-white/70 px-4 py-3 dark:bg-slate-950" placeholder="Hint" />
              <input value={link.url} onChange={(event) => updateFeatured(index, { url: event.target.value })} className="rounded-2xl border-0 bg-white/70 px-4 py-3 dark:bg-slate-950" placeholder="URL" />
              <button type="button" onClick={() => updateFeatured(index, { isActive: !link.isActive })} className={`rounded-full px-3 py-2 text-xs font-bold ${link.isActive ? "bg-emerald-500/10 text-emerald-600" : "bg-slate-500/10 text-slate-500"}`}>
                {link.isActive ? "Active" : "Hidden"}
              </button>
            </div>
          ))}
        </div>
      </section>

      <div className="sticky bottom-5 flex justify-end">
        <button type="submit" className="flex items-center gap-2 rounded-full bg-primary px-8 py-4 font-bold text-white shadow-lg shadow-primary/20">
          <span className="material-symbols-outlined text-[20px]">save</span>
          {saved ? "Saved" : "Save Changes"}
        </button>
      </div>
    </form>
  );

  function updateSocial(index: number, patch: Partial<SocialLink>) {
    setSocials(socials.map((social, current) => (current === index ? { ...social, ...patch } : social)));
  }

  function updateFeatured(index: number, patch: Partial<FeaturedLink>) {
    setFeaturedLinks(featuredLinks.map((link, current) => (current === index ? { ...link, ...patch } : link)));
  }
}
