"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function LoginForm({ redirectTo = "/admin" }: { redirectTo?: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const saved = window.localStorage.getItem("theme");
    const nextDark = saved ? saved === "dark" : prefersDark;
    setDarkMode(nextDark);
    document.documentElement.classList.toggle("dark", nextDark);
  }, []);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    setLoading(false);

    if (!response.ok) {
      const body = (await response.json().catch(() => ({ error: "Login failed" }))) as { error?: string };
      setError(body.error ?? "Login failed");
      return;
    }

    window.location.assign(redirectTo);
  }

  function toggleTheme() {
    const next = !darkMode;
    setDarkMode(next);
    window.localStorage.setItem("theme", next ? "dark" : "light");
    document.documentElement.classList.toggle("dark", next);
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-5 text-on-surface dark:text-inverse-on-surface">
      <div className="animated-bg" />
      <section className="glass-card w-full max-w-md rounded-[2rem] p-8">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white">admin_panel_settings</span>
            <div>
              <h1 className="text-2xl font-bold">Wnn Portal</h1>
              <p className="text-sm text-on-surface-variant dark:text-outline-variant">Enter your credentials to access the console.</p>
            </div>
          </div>
          <button onClick={toggleTheme} className="flex h-10 w-10 items-center justify-center rounded-full glass-card text-primary dark:text-inverse-primary" type="button">
            <span className="material-symbols-outlined">{darkMode ? "light_mode" : "dark_mode"}</span>
          </button>
        </div>

        <form onSubmit={submit} className="space-y-5">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold">Email</span>
            <div className="flex items-center gap-3 rounded-2xl bg-white/60 px-4 py-3 dark:bg-white/5">
              <span className="material-symbols-outlined text-[20px] text-outline">mail</span>
              <input value={email} onChange={(event) => setEmail(event.target.value)} className="w-full border-0 bg-transparent p-0 focus:ring-0" type="email" placeholder="you@example.com" />
            </div>
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold">Password</span>
            <div className="flex items-center gap-3 rounded-2xl bg-white/60 px-4 py-3 dark:bg-white/5">
              <span className="material-symbols-outlined text-[20px] text-outline">lock</span>
              <input value={password} onChange={(event) => setPassword(event.target.value)} className="w-full border-0 bg-transparent p-0 focus:ring-0" type="password" placeholder="••••••••" />
            </div>
          </label>

          <p className="rounded-2xl bg-primary/10 px-4 py-3 text-sm font-medium text-primary dark:text-inverse-primary">
            Default Docker credentials are configured through <code>ADMIN_EMAIL</code> and <code>ADMIN_PASSWORD</code>.
          </p>
          {error && <p className="rounded-2xl bg-red-500/10 px-4 py-3 text-sm font-medium text-red-600">{error}</p>}

          <button disabled={loading} className="h-12 w-full rounded-full bg-primary px-8 font-bold text-white transition hover:brightness-110 active:scale-[0.98]" type="submit">
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-between text-sm text-outline">
          <span>Protected by Wnn Security.</span>
          <Link href="/">Back to site</Link>
        </div>
      </section>
    </main>
  );
}
