"use client";

import { useEffect, useMemo, useState } from "react";
import { defaultDataset } from "@/lib/default-data";
import { deleteLink, loadPortalDataset, saveLink } from "@/lib/portal-store";
import type { Category, PortalDataset, PortalLink } from "@/lib/types";

const emptyLink: PortalLink = {
  id: "",
  title: "",
  description: "",
  url: "",
  icon: "link",
  categoryId: "tools",
  categoryName: "工具",
  sortOrder: 1,
  isActive: true
};

export function LinksManager() {
  const [data, setData] = useState<PortalDataset>(defaultDataset);
  const [filter, setFilter] = useState("全部");
  const [editing, setEditing] = useState<PortalLink | null>(null);
  const [query, setQuery] = useState("");

  async function refresh() {
    setData(await loadPortalDataset());
  }

  useEffect(() => {
    refresh();
  }, []);

  const categoryOptions = useMemo(() => ["全部", ...data.categories.map((category) => category.name)], [data.categories]);
  const visibleLinks = data.links
    .filter((link) => filter === "全部" || link.categoryName === filter)
    .filter((link) => `${link.title} ${link.url}`.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => a.sortOrder - b.sortOrder);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing) return;
    const category = data.categories.find((item) => item.id === editing.categoryId) ?? data.categories[0];
    await saveLink({
      ...editing,
      id: editing.id || slugify(editing.title || crypto.randomUUID()),
      categoryName: category?.name ?? "工具",
      sortOrder: Number(editing.sortOrder) || data.links.length + 1
    });
    setEditing(null);
    await refresh();
  }

  async function remove(id: string) {
    if (!window.confirm("确定删除这个链接吗？")) return;
    await deleteLink(id);
    await refresh();
  }

  function newLink() {
    const category = data.categories[0];
    setEditing({
      ...emptyLink,
      id: "",
      categoryId: category?.id ?? "tools",
      categoryName: category?.name ?? "工具",
      sortOrder: data.links.length + 1
    });
  }

  return (
    <div className="space-y-6">
      <section className="glass-card rounded-[2rem] p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-1 items-center gap-3 rounded-2xl bg-white/60 px-4 py-3 dark:bg-white/5">
            <span className="material-symbols-outlined text-[20px] text-outline">search</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索链接..." className="w-full border-0 bg-transparent p-0 focus:ring-0" />
          </div>
          <select value={filter} onChange={(event) => setFilter(event.target.value)} className="rounded-2xl border-0 bg-white/60 px-4 py-3 font-semibold dark:bg-slate-900">
            {categoryOptions.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>
          <button type="button" onClick={newLink} className="flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 font-bold text-white transition active:scale-[0.98]">
            <span className="material-symbols-outlined text-[20px]">add</span>
            新增链接
          </button>
        </div>
      </section>

      <section className="glass-card overflow-hidden rounded-[2rem]">
        <div className="hidden grid-cols-[64px_1.4fr_1fr_120px_120px] gap-4 border-b border-outline-variant/30 px-6 py-4 text-xs font-bold uppercase tracking-[0.18em] text-outline md:grid">
          <span>排序</span>
          <span>标题和地址</span>
          <span>分类</span>
          <span>状态</span>
          <span>操作</span>
        </div>
        {visibleLinks.map((link, index) => (
          <div key={link.id} className="grid gap-4 border-b border-outline-variant/20 px-6 py-5 last:border-0 md:grid-cols-[64px_1.4fr_1fr_120px_120px] md:items-center">
            <div className="flex items-center gap-2 text-outline">
              <span className="material-symbols-outlined text-[20px]">drag_indicator</span>
              {index + 1}
            </div>
            <div className="flex items-center gap-4">
              <span className="material-symbols-outlined flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary dark:text-inverse-primary">{link.icon}</span>
              <div>
                <div className="font-bold">{link.title}</div>
                <div className="break-all text-sm text-outline">{link.url}</div>
              </div>
            </div>
            <div className="font-semibold">{link.categoryName}</div>
            <button
              onClick={async () => {
                await saveLink({ ...link, isActive: !link.isActive });
                await refresh();
              }}
              className={`w-fit rounded-full px-3 py-1 text-xs font-bold ${link.isActive ? "bg-emerald-500/10 text-emerald-600" : "bg-slate-500/10 text-slate-500"}`}
            >
              {link.isActive ? "显示" : "隐藏"}
            </button>
            <div className="flex gap-2">
              <button onClick={() => setEditing(link)} className="flex h-10 w-10 items-center justify-center rounded-full bg-white/60 text-primary dark:bg-white/5 dark:text-inverse-primary">
                <span className="material-symbols-outlined text-[20px]">edit</span>
              </button>
              <button onClick={() => remove(link.id)} className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/10 text-red-600">
                <span className="material-symbols-outlined text-[20px]">delete</span>
              </button>
            </div>
          </div>
        ))}
      </section>

      {editing && (
        <EditorModal title={editing.id ? "编辑链接" : "新增链接"} onClose={() => setEditing(null)} onSubmit={submit}>
          <LinkFields link={editing} categories={data.categories} onChange={setEditing} />
        </EditorModal>
      )}
    </div>
  );
}

function LinkFields({ link, categories, onChange }: { link: PortalLink; categories: Category[]; onChange: (link: PortalLink) => void }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Input label="标题" value={link.title} onChange={(title) => onChange({ ...link, title })} />
      <Input label="图标" value={link.icon} onChange={(icon) => onChange({ ...link, icon })} />
      <Input label="网址" value={link.url} onChange={(url) => onChange({ ...link, url })} className="md:col-span-2" />
      <label className="block">
        <span className="mb-2 block text-sm font-semibold">分类</span>
        <select value={link.categoryId} onChange={(event) => onChange({ ...link, categoryId: event.target.value })} className="w-full rounded-2xl border-0 bg-white/60 px-4 py-3 dark:bg-white/5">
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </label>
      <Input label="排序" value={String(link.sortOrder)} onChange={(sortOrder) => onChange({ ...link, sortOrder: Number(sortOrder) })} />
      <label className="md:col-span-2">
        <span className="mb-2 block text-sm font-semibold">描述</span>
        <textarea value={link.description} onChange={(event) => onChange({ ...link, description: event.target.value })} className="min-h-28 w-full rounded-2xl border-0 bg-white/60 px-4 py-3 focus:ring-2 focus:ring-primary dark:bg-white/5" />
      </label>
    </div>
  );
}

export function EditorModal({ title, children, onClose, onSubmit }: { title: string; children: React.ReactNode; onClose: () => void; onSubmit: (event: React.FormEvent<HTMLFormElement>) => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 p-4 backdrop-blur-xl md:items-center">
      <form onSubmit={onSubmit} className="glass-card w-full max-w-2xl rounded-[2rem] p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">{title}</h2>
          <button type="button" onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-full bg-white/60 dark:bg-white/5">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        {children}
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="rounded-full bg-white/60 px-6 py-3 font-bold dark:bg-white/5">
            取消
          </button>
          <button type="submit" className="rounded-full bg-primary px-6 py-3 font-bold text-white">
            保存
          </button>
        </div>
      </form>
    </div>
  );
}

export function Input({ label, value, onChange, className = "" }: { label: string; value: string; onChange: (value: string) => void; className?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-2 block text-sm font-semibold">{label}</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-2xl border-0 bg-white/60 px-4 py-3 focus:ring-2 focus:ring-primary dark:bg-white/5" />
    </label>
  );
}

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || crypto.randomUUID();
}
