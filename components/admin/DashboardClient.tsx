"use client";

import { useEffect, useMemo, useState } from "react";
import { loadPortalDataset } from "@/lib/portal-store";
import { defaultDataset } from "@/lib/default-data";
import type { PortalDataset } from "@/lib/types";
import { Icon } from "@/components/Icon";

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
      { label: "链接总数", value: data.links.length, icon: "link", delta: "已收录" },
      { label: "分类数量", value: data.categories.length, icon: "category", delta: "稳定" },
      { label: "今日访问", value: visits.todayVisitors, icon: "monitoring", delta: "按浏览器去重" },
      { label: "公开链接", value: data.links.filter((link) => link.isActive).length, icon: "visibility", delta: "前台可见" },
      { label: "隐藏链接", value: data.links.filter((link) => !link.isActive).length, icon: "visibility_off", delta: "仅后台保留" }
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
              <Icon name={String(stat.icon)} className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary dark:text-inverse-primary" />
            </div>
            <div className="text-4xl font-bold">{stat.value}</div>
            <div className="mt-3 text-sm font-semibold text-primary dark:text-inverse-primary">{stat.delta}</div>
          </section>
        ))}
      </div>

      <section className="glass-card rounded-[2rem] p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">每日访问</h2>
            <p className="text-sm text-outline">最近 14 天的浏览器去重访问统计。</p>
          </div>
          <Icon name="bar_chart" className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary dark:text-inverse-primary" />
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
          <h2 className="text-xl font-bold">最近链接</h2>
          <span className="text-sm font-semibold text-outline">最新 {Math.min(data.links.length, 5)} 条</span>
        </div>
        <div className="divide-y divide-outline-variant/30">
          {data.links.slice(0, 5).map((link) => (
            <div key={link.id} className="flex items-center justify-between gap-4 py-4">
              <div className="flex items-center gap-4">
                <Icon name={String(link.icon)} className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/60 text-primary dark:bg-white/5 dark:text-inverse-primary" />
                <div>
                  <div className="font-semibold">{link.title}</div>
                  <div className="text-sm text-outline">{link.categoryName}</div>
                </div>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-bold ${link.isActive ? "bg-emerald-500/10 text-emerald-600" : "bg-slate-500/10 text-slate-500"}`}>
                {link.isActive ? "显示" : "隐藏"}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
