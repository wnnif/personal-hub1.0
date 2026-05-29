"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/Icon";
import { Input } from "./LinksManager";

type CredentialsForm = {
  email: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export function CredentialsPanel() {
  const [form, setForm] = useState<CredentialsForm>({
    email: "admin",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/session")
      .then((response) => response.json())
      .then((session: { email?: string }) => {
        if (session.email) setForm((current) => ({ ...current, email: session.email ?? "admin" }));
      })
      .catch(() => undefined);
  }, []);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    const response = await fetch("/api/admin/credentials", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    setLoading(false);

    const body = (await response.json().catch(() => ({}))) as { error?: string };
    if (!response.ok) {
      setError(body.error ?? "修改失败");
      return;
    }

    setMessage("账号密码已保存，正在重启后台并跳转登录页...");
    await fetch("/api/admin/logout", { method: "POST" }).catch(() => undefined);

    window.setTimeout(() => {
      window.location.assign("/admin/login");
    }, 2500);
  }

  return (
    <section className="glass-card rounded-[2rem] p-6">
      <div className="mb-6 flex items-center gap-3">
        <Icon name="lock" className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary dark:text-inverse-primary" />
        <div>
          <h2 className="text-2xl font-bold">后台账号密码</h2>
          <p className="text-sm text-outline">修改后会自动退出登录，请用新账号密码重新进入后台。</p>
        </div>
      </div>

      <form onSubmit={submit} className="grid gap-4">
        <Input label="后台账号" value={form.email} onChange={(email) => setForm({ ...form, email })} />
        <PasswordInput label="当前密码" value={form.currentPassword} onChange={(currentPassword) => setForm({ ...form, currentPassword })} />
        <PasswordInput label="新密码" value={form.newPassword} onChange={(newPassword) => setForm({ ...form, newPassword })} />
        <PasswordInput label="确认新密码" value={form.confirmPassword} onChange={(confirmPassword) => setForm({ ...form, confirmPassword })} />

        {error && <p className="rounded-2xl bg-red-500/10 px-4 py-3 text-sm font-medium text-red-600">{error}</p>}
        {message && <p className="rounded-2xl bg-primary/10 px-4 py-3 text-sm font-medium text-primary dark:text-inverse-primary">{message}</p>}

        <div className="flex justify-end">
          <button disabled={loading} type="submit" className="flex items-center gap-2 rounded-full bg-primary px-8 py-4 font-bold text-white shadow-lg shadow-primary/20 disabled:opacity-60">
            <Icon name="save" className="text-[20px]" />
            {loading ? "正在保存..." : "保存账号密码"}
          </button>
        </div>
      </form>
    </section>
  );
}

function PasswordInput({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  const [visible, setVisible] = useState(false);
  return (
    <label>
      <span className="mb-2 block text-sm font-semibold">{label}</span>
      <div className="flex items-center gap-3 rounded-2xl bg-white/60 px-4 py-3 dark:bg-white/5">
        <input value={value} onChange={(event) => onChange(event.target.value)} className="w-full border-0 bg-transparent p-0 focus:ring-0" type={visible ? "text" : "password"} />
        <button type="button" onClick={() => setVisible(!visible)} className="text-sm font-bold text-primary dark:text-inverse-primary">
          {visible ? "隐藏" : "显示"}
        </button>
      </div>
    </label>
  );
}
