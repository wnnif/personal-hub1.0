"use client";

import { useEffect, useMemo, useState } from "react";
import { loadPortalDataset } from "@/lib/portal-store";
import { defaultDataset } from "@/lib/default-data";
import type { PortalDataset } from "@/lib/types";

type VisitStats = {
  todayVisitors: number;
  dailyVisits: Array<{ date: string; visitors: number }>;
};

export function DashboardClient() {
  const [data, setData] = useState<PortalDataset>(defaultDataset);
  const [visits, setVisits] = useState<VisitStats>({ todayVisitors: 0, dailyVisits: [] });

  useEffect(() => {
    loadPortalDataset().then(setData);
    fetch("/api/admin/stats")
      .then((response) => response.json())
      .then((stats: VisitStats) => setVisits(stats))
      .catch(() => undefined);
  }, []);

  const stats = useMemo(
    () => [
      { label: "Total Links", value: data.links.length, icon: "link", delta: "Ready" },
      { label: "Categories", value: data.categories.length, icon: "category", delta: "Stable" },
      { label: "Today Visitors", value: visits.todayVisitors, icon: "monitoring", delta: "Daily unique" },
      { label: "Active Links", value: data.links.filter((link) => link.isActive).length, icon: "visibility", delta: "Public" },
      { label: "Hidden Links", value: data.links.filter((link) => !link.isActive).length, icon: "visibility_off", delta: "Private" }
    ],
    [data, visits.todayVisitors]
  );

  const maxVisitors = Math.max(1, ...visits.dailyVisits.map((item) => item.visitors));

  return (
    <div className="space-y-8">
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
        {stats.map((stat) => (
          <section key={stat.label} className="glass-card rounded-[2rem] p-6">
            <div className="mb-6 flex items-center justify-between">
              <span className="text-sm font-semibold text-on-surface-variant dark:text-outline-variant">{stat.label}</span>
              <span className="material-symbols-outlined flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary dark:text-inverse-primary">{stat.icon}</span>
            </div>
            <div className="text-4xl font-bold">{stat.value}</div>
            <div className="mt-3 text-sm font-semibold text-primary dark:text-inverse-primary">{stat.delta}</div>
          </section>
        ))}
      </div>

      <section className="glass-card rounded-[2rem] p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Daily Visitors</h2>
            <p className="text-sm text-outline">Approximate unique browsers over the last 14 days.</p>
          </div>
          <span className="material-symbols-outlined flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary dark:text-inverse-primary">bar_chart</span>
        </div>
        <div className="flex h-40 items-end gap-2">
          {visits.dailyVisits.map((item) => (
            <div key={item.date} className="flex min-w-0 flex-1 flex-col items-center gap-2">
              <div className="text-xs font-bold text-outline">{item.visitors}</div>
              <div className="w-full rounded-full bg-primary/10 dark:bg-white/5">
                <div className="mx-auto w-full rounded-full bg-primary transition-all" style={{ height: `${Math.max(8, (item.visitors / maxVisitors) * 112)}px` }} />
              </div>
              <div className="w-full truncate text-center text-[10px] font-semibold text-outline">{item.date.slice(5)}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="glass-card rounded-[2rem] p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold">Recent Links</h2>
          <span className="text-sm font-semibold text-outline">Latest {Math.min(data.links.length, 5)}</span>
        </div>
        <div className="divide-y divide-outline-variant/30">
          {data.links.slice(0, 5).map((link) => (
            <div key={link.id} className="flex items-center justify-between gap-4 py-4">
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined flex h-11 w-11 items-center justify-center rounded-2xl bg-white/60 text-primary dark:bg-white/5 dark:text-inverse-primary">{link.icon}</span>
                <div>
                  <div className="font-semibold">{link.title}</div>
                  <div className="text-sm text-outline">{link.categoryName}</div>
                </div>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-bold ${link.isActive ? "bg-emerald-500/10 text-emerald-600" : "bg-slate-500/10 text-slate-500"}`}>
                {link.isActive ? "Active" : "Hidden"}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
