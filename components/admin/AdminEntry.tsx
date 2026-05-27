"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "./AdminShell";
import { DashboardClient } from "./DashboardClient";
import { LoginForm } from "./LoginForm";

export function AdminEntry() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/api/admin/session")
      .then((response) => response.json())
      .then((session: { authenticated: boolean }) => setAuthenticated(session.authenticated))
      .catch(() => setAuthenticated(false));
  }, []);

  if (authenticated === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface text-on-surface dark:bg-slate-950 dark:text-white">
        <div className="glass-card rounded-[2rem] px-8 py-5 text-sm font-semibold">正在加载后台...</div>
      </div>
    );
  }

  if (!authenticated) {
    return <LoginForm redirectTo="/admin" />;
  }

  return (
    <AdminShell title="仪表盘" description="查看导航站的链接数量、访问统计和最近内容。">
      <DashboardClient />
    </AdminShell>
  );
}
