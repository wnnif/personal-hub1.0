"use client";

import { useEffect, useMemo, useState } from "react";
import { loadPortalDataset } from "@/lib/portal-store";
import { defaultDataset } from "@/lib/default-data";
import type { PortalDataset } from "@/lib/types";

export function PortalHome() {
  const [data, setData] = useState<PortalDataset>(defaultDataset);
  const [darkMode, setDarkMode] = useState(false);
  const [activeCategory, setActiveCategory] = useState("全部");
  const [searchEngine, setSearchEngine] = useState(defaultDataset.searchEngines[0].name);
  const [query, setQuery] = useState("");
  const [time, setTime] = useState("");

  useEffect(() => {
    loadPortalDataset().then(setData);
  }, []);

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    const key = `wnn-portal-visit-${today}`;
    if (window.localStorage.getItem(key)) {
      return;
    }

    fetch("/api/visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date: today })
    })
      .then((response) => {
        if (response.ok) {
          window.localStorage.setItem(key, "1");
        }
      })
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const nextDark = savedTheme ? savedTheme === "dark" : prefersDark;
    setDarkMode(nextDark);
    document.documentElement.classList.toggle("dark", nextDark);
  }, []);

  useEffect(() => {
    const update = () => {
      setTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    };
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const categories = useMemo(() => ["全部", ...data.categories.filter((item) => item.isActive).map((item) => item.name)], [data.categories]);
  const selectedEngine = data.searchEngines.find((engine) => engine.name === searchEngine) ?? data.searchEngines[0];
  const socialLinks = useMemo(
    () =>
      data.socials
        .filter((item) => item.isActive && hasUsableUrl(item.url))
        .sort((a, b) => a.sortOrder - b.sortOrder),
    [data.socials]
  );
  const featuredLinks = useMemo(
    () =>
      data.featuredLinks
        .filter((item) => item.isActive && hasUsableUrl(item.url))
        .sort((a, b) => a.sortOrder - b.sortOrder),
    [data.featuredLinks]
  );
  const visibleLinks = data.links
    .filter((link) => link.isActive)
    .filter((link) => activeCategory === "全部" || link.categoryName === activeCategory)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  function toggleTheme() {
    const next = !darkMode;
    setDarkMode(next);
    window.localStorage.setItem("theme", next ? "dark" : "light");
    document.documentElement.classList.toggle("dark", next);
  }

  function executeSearch() {
    const trimmed = query.trim();
    if (!trimmed) return;
    window.open(selectedEngine.url + encodeURIComponent(trimmed), "_blank", "noopener,noreferrer");
  }

  return (
    <main className="min-h-screen text-on-surface transition-colors duration-500 dark:text-inverse-on-surface">
      <div className="animated-bg" />
      <nav className="fixed top-0 z-50 flex h-16 w-full items-center justify-between border-b border-white/20 bg-white/20 px-6 backdrop-blur-2xl transition-colors dark:border-white/5 dark:bg-black/20">
        <a className="text-2xl font-bold tracking-tight text-primary dark:text-inverse-primary" href="/">
          {data.profile.name}
        </a>
        <button
          type="button"
          onClick={toggleTheme}
          className="flex h-10 w-10 items-center justify-center rounded-full text-primary transition hover:bg-white/40 dark:text-inverse-primary dark:hover:bg-white/10"
          aria-label="切换明暗模式"
        >
          <span className="material-symbols-outlined">{darkMode ? "light_mode" : "dark_mode"}</span>
        </button>
      </nav>

      <div className="mx-auto flex max-w-[1400px] flex-col gap-16 px-5 pb-16 pt-24 md:px-12 lg:flex-row">
        <aside className="lg:w-80 lg:flex-shrink-0">
          <section className="glass-card sticky top-24 flex flex-col items-center rounded-[2rem] p-10 text-center transition duration-300 hover:-translate-y-1 hover:shadow-2xl lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto lg:items-start lg:text-left">
            <div className="mb-6 flex h-32 w-32 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-[#b7d4ff] bg-white/80 shadow-lg ring-8 ring-white/30 dark:border-inverse-primary/30 dark:bg-white/10 dark:ring-white/5">
              <img
                src={data.profile.avatarUrl}
                alt={data.profile.name}
                className="h-full w-full rounded-full object-cover transition duration-500 hover:scale-110"
                onError={(event) => {
                  event.currentTarget.src = "/avatar.svg";
                }}
              />
            </div>
            <h1 className="mb-1 text-3xl font-semibold">{data.profile.name}</h1>
            <p className="mb-10 max-w-xs text-[17px] leading-7 text-on-surface-variant dark:text-outline-variant">{data.profile.bio}</p>

            <div className="mb-10 w-full rounded-3xl border border-primary-container/10 bg-primary-container/10 px-10 py-6 text-center font-mono text-primary shadow-sm dark:bg-inverse-primary/10 dark:text-inverse-primary">
              <div className="mb-1 text-xs font-bold uppercase tracking-[0.2em] opacity-60">本地时间</div>
              <div className="text-[32px] font-bold leading-none tracking-tight">{time}</div>
            </div>

            <div className="mb-10 grid w-full grid-cols-4 gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.id}
                  href={social.url}
                  target={social.url.startsWith("http") ? "_blank" : "_self"}
                  rel="noreferrer"
                  title={social.label}
                  className="card-container glass-card flex h-12 items-center justify-center rounded-2xl text-on-surface transition hover:bg-white/50 hover:text-primary dark:text-white dark:hover:bg-white/10 dark:hover:text-inverse-primary"
                >
                  <span className="tooltip-badge -top-10 rounded-full border border-white/20 bg-white/90 px-3 py-1 text-sm font-medium text-primary shadow-xl backdrop-blur-md dark:bg-slate-800 dark:text-inverse-primary">
                    {social.label}
                  </span>
                  <span className="material-symbols-outlined text-[20px]">{social.icon}</span>
                </a>
              ))}
            </div>

            <div className="mb-10 flex w-full flex-col gap-3">
              {featuredLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target={link.url.startsWith("http") ? "_blank" : "_self"}
                  rel="noreferrer"
                  className="card-container glass-card flex w-full items-center justify-center gap-2 rounded-3xl px-6 py-4 font-bold transition hover:bg-primary hover:text-white dark:bg-primary/25 dark:hover:bg-primary"
                >
                  <span className="tooltip-badge -top-10 rounded-full border border-white/20 bg-white/90 px-3 py-1 text-sm font-medium text-primary shadow-xl backdrop-blur-md dark:bg-slate-800 dark:text-inverse-primary">
                    {link.hint}
                  </span>
                  <span className="material-symbols-outlined text-[24px]">{link.icon}</span>
                  {link.label}
                </a>
              ))}
            </div>

            <a
              href="https://github.com/wnnif/personal-hub1.0"
              target="_blank"
              rel="noreferrer"
              className="w-full border-t border-outline-variant/20 pt-8 text-center text-sm text-outline transition hover:text-primary dark:text-outline-variant dark:hover:text-inverse-primary lg:text-left"
              dangerouslySetInnerHTML={{ __html: data.profile.footerText }}
            />
          </section>
        </aside>

        <section className="min-w-0 flex-1">
          <div className="glass-card mb-16 flex flex-col items-center rounded-3xl border border-white/40 p-1.5 shadow-lg focus-within:ring-4 focus-within:ring-primary-container/20 dark:border-white/5 md:flex-row">
            <div className="flex w-full items-center justify-between gap-2 rounded-2xl px-6 py-3 font-medium md:w-44">
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-primary dark:text-inverse-primary">{selectedEngine.icon}</span>
                <select value={searchEngine} onChange={(event) => setSearchEngine(event.target.value)} className="border-0 bg-transparent p-0 text-sm font-semibold focus:ring-0 dark:bg-transparent">
                  {data.searchEngines.map((engine) => (
                    <option key={engine.name}>{engine.name}</option>
                  ))}
                </select>
              </span>
            </div>
            <div className="hidden h-8 w-px bg-outline-variant/30 md:block" />
            <form
              className="relative flex w-full flex-1 items-center"
              onSubmit={(event) => {
                event.preventDefault();
                executeSearch();
              }}
            >
              <input
                className="w-full border-0 bg-transparent px-6 py-3 pr-32 text-[17px] placeholder:text-outline/70 focus:ring-0 dark:text-inverse-on-surface"
                placeholder="输入关键词搜索..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
              <button className="absolute right-1 rounded-2xl bg-primary px-8 py-2.5 text-sm font-semibold text-white shadow-md transition hover:brightness-110 active:scale-95" type="submit">
                搜索
              </button>
            </form>
          </div>

          <div className="no-scrollbar mb-10 flex gap-3 overflow-x-auto pb-1">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`whitespace-nowrap rounded-full px-10 py-2 text-sm font-semibold transition active:scale-95 ${
                  activeCategory === category ? "bg-primary text-white shadow-lg shadow-primary/20" : "glass-card text-on-surface-variant hover:bg-white/50 dark:text-outline-variant dark:hover:bg-white/10"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="masonry">
            {visibleLinks.map((item) => (
              <article key={item.id} className="masonry-item card-container cursor-pointer" onClick={() => window.open(normalizeUrl(item.url), "_blank", "noopener,noreferrer")}>
                <div className="glass-card group relative rounded-3xl p-6 pt-12 transition duration-300 hover:-translate-y-1.5 hover:shadow-2xl">
                  <div className="mb-3 flex items-center gap-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/5 text-primary shadow-sm transition group-hover:bg-primary group-hover:text-white dark:bg-white/5 dark:text-inverse-primary">
                      <span className="material-symbols-outlined text-[24px]">{item.icon}</span>
                    </div>
                    <div>
                      <h2 className="text-2xl font-semibold transition group-hover:text-primary dark:group-hover:text-inverse-primary">{item.title}</h2>
                      <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-outline dark:text-outline-variant">{item.categoryName}</span>
                    </div>
                  </div>
                  <p className="line-clamp-2 text-[17px] leading-7 text-on-surface-variant dark:text-outline-variant">{item.description}</p>
                  <div className="pointer-events-none absolute left-1/2 top-4 max-w-[calc(100%-3rem)] -translate-x-1/2 -translate-y-1 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    <div className="inline-flex max-w-full items-center gap-1 rounded-full border border-primary-container/10 bg-white/90 px-3 py-1.5 text-sm font-bold text-primary shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/90 dark:text-inverse-primary">
                      <span className="material-symbols-outlined text-[16px]" aria-hidden="true">
                        language
                      </span>
                      <span className="truncate">{displayUrl(item.url)}</span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function normalizeUrl(url: string) {
  if (!url || url === "#") return "#";
  if (/^(https?:|mailto:|tel:)/i.test(url)) return url;
  return `https://${url}`;
}

function displayUrl(url: string) {
  return normalizeUrl(url).replace(/^https?:\/\//, "");
}

function hasUsableUrl(url: string) {
  return Boolean(url && url.trim() && url.trim() !== "#");
}
