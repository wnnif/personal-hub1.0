"use client";

import { useEffect, useState } from "react";
import { defaultDataset } from "@/lib/default-data";
import { loadPortalDataset, saveSettings } from "@/lib/portal-store";
import type { SiteSettings, ThemeMode } from "@/lib/types";
import { Input } from "./LinksManager";

export function SettingsPanel() {
  const [settings, setSettings] = useState<SiteSettings>(defaultDataset.settings);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadPortalDataset().then((dataset) => setSettings(dataset.settings));
  }, []);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    await saveSettings(settings);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      <section className="glass-card rounded-[2rem] p-6">
        <div className="mb-6 flex items-center gap-3">
          <span className="material-symbols-outlined flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary dark:text-inverse-primary">language</span>
          <div>
            <h2 className="text-2xl font-bold">站点配置</h2>
            <p className="text-sm text-outline">全局标题和 SEO 描述。</p>
          </div>
        </div>
        <div className="grid gap-4">
          <Input label="站点标题" value={settings.siteTitle} onChange={(siteTitle) => setSettings({ ...settings, siteTitle })} />
          <label>
            <span className="mb-2 block text-sm font-semibold">SEO 描述</span>
            <textarea value={settings.seoDescription} onChange={(event) => setSettings({ ...settings, seoDescription: event.target.value })} maxLength={160} className="min-h-28 w-full rounded-2xl border-0 bg-white/60 px-4 py-3 focus:ring-2 focus:ring-primary dark:bg-white/5" />
            <span className="mt-1 block text-xs font-semibold text-outline">{settings.seoDescription.length} / 160 字</span>
          </label>
          <Input label="Google Analytics 跟踪 ID" value={settings.analyticsId} onChange={(analyticsId) => setSettings({ ...settings, analyticsId })} />
        </div>
      </section>

      <section className="glass-card rounded-[2rem] p-6">
        <div className="mb-6 flex items-center gap-3">
          <span className="material-symbols-outlined flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary dark:text-inverse-primary">palette</span>
          <div>
            <h2 className="text-2xl font-bold">主题配置</h2>
            <p className="text-sm text-outline">新访客首次打开时使用的默认外观。</p>
          </div>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {(["system", "light", "dark"] as ThemeMode[]).map((mode) => (
            <button
              type="button"
              key={mode}
              onClick={() => setSettings({ ...settings, defaultTheme: mode })}
              className={`rounded-3xl px-5 py-5 text-left font-bold transition active:scale-[0.98] ${
                settings.defaultTheme === mode ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-white/50 hover:bg-white/70 dark:bg-white/5 dark:hover:bg-white/10"
              }`}
            >
              <span className="material-symbols-outlined mb-8 block">{mode === "system" ? "desktop_windows" : mode === "light" ? "light_mode" : "dark_mode"}</span>
              {mode === "system" ? "跟随系统" : mode === "light" ? "浅色" : "深色"}
            </button>
          ))}
        </div>
      </section>

      <div className="flex justify-end">
        <button type="submit" className="flex items-center gap-2 rounded-full bg-primary px-8 py-4 font-bold text-white shadow-lg shadow-primary/20">
          <span className="material-symbols-outlined text-[20px]">save</span>
          {saved ? "已保存" : "保存修改"}
        </button>
      </div>
    </form>
  );
}
