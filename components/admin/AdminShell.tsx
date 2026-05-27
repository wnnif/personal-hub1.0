"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const navItems = [
  { href: "/admin/dashboard", label: "仪表盘", icon: "dashboard" },
  { href: "/admin/links", label: "链接", icon: "link" },
  { href: "/admin/categories", label: "分类", icon: "category" },
  { href: "/admin/profile", label: "资料", icon: "account_circle" },
  { href: "/admin/settings", label: "设置", icon: "settings" }
];

export function AdminShell({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const nextDark = savedTheme ? savedTheme === "dark" : prefersDark;
    setDarkMode(nextDark);
    document.documentElement.classList.toggle("dark", nextDark);
  }, []);

  useEffect(() => {
    async function check() {
      const response = await fetch("/api/admin/session");
      const session = (await response.json()) as { authenticated: boolean };
      if (!session.authenticated) {
        router.replace("/admin/login");
        return;
      }
      setReady(true);
    }

    check();
  }, [router]);

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
  }

  function toggleTheme() {
    const next = !darkMode;
    setDarkMode(next);
    window.localStorage.setItem("theme", next ? "dark" : "light");
    document.documentElement.classList.toggle("dark", next);
  }

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface text-on-surface dark:bg-slate-950 dark:text-white">
        <div className="glass-card rounded-[2rem] px-8 py-5 text-sm font-semibold">正在加载后台...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-on-surface dark:text-inverse-on-surface">
      <div className="animated-bg" />
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-72 border-r border-white/30 bg-white/30 p-6 backdrop-blur-2xl dark:border-white/5 dark:bg-black/20 lg:block">
        <div className="mb-10 flex items-center gap-3">
          <span className="material-symbols-outlined flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-white">admin_panel_settings</span>
          <div>
            <div className="font-bold">Wnn Portal</div>
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-outline">管理后台</div>
          </div>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                  active ? "bg-primary text-white shadow-lg shadow-primary/20" : "hover:bg-white/50 dark:hover:bg-white/10"
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-6 left-6 right-6 space-y-2">
          <Link href="/" className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition hover:bg-white/50 dark:hover:bg-white/10">
            <span className="material-symbols-outlined text-[20px]">open_in_new</span>
            查看前台
          </Link>
          <button onClick={logout} className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-500/10">
            <span className="material-symbols-outlined text-[20px]">logout</span>
            退出登录
          </button>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-white/30 bg-white/30 px-5 py-4 backdrop-blur-2xl dark:border-white/5 dark:bg-black/20 md:px-10">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
              <p className="mt-1 text-sm text-on-surface-variant dark:text-outline-variant">{description}</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={toggleTheme} className="flex h-11 w-11 items-center justify-center rounded-full glass-card text-primary dark:text-inverse-primary" aria-label="切换明暗模式">
                <span className="material-symbols-outlined">{darkMode ? "light_mode" : "dark_mode"}</span>
              </button>
              <Link href="/admin/dashboard" className="flex h-11 w-11 items-center justify-center rounded-full glass-card lg:hidden" aria-label="Admin menu">
                <span className="material-symbols-outlined">menu</span>
              </Link>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-7xl px-5 py-8 md:px-10">{children}</div>
      </div>
    </div>
  );
}
