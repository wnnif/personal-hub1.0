"use client";

import { useEffect, useState } from "react";
import { defaultDataset } from "@/lib/default-data";
import { deleteCategory, loadPortalDataset, saveCategory } from "@/lib/portal-store";
import type { Category, PortalDataset } from "@/lib/types";
import { EditorModal, Input } from "./LinksManager";

const emptyCategory: Category = { id: "", name: "", icon: "category", sortOrder: 1, isActive: true };

export function CategoriesManager() {
  const [data, setData] = useState<PortalDataset>(defaultDataset);
  const [editing, setEditing] = useState<Category | null>(null);

  async function refresh() {
    setData(await loadPortalDataset());
  }

  useEffect(() => {
    refresh();
  }, []);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing) return;
    await saveCategory({
      ...editing,
      id: editing.id || slugify(editing.name),
      sortOrder: Number(editing.sortOrder) || data.categories.length + 1
    });
    setEditing(null);
    await refresh();
  }

  async function remove(id: string) {
    if (!window.confirm("Delete this category? Links will keep their data but lose this category.")) return;
    await deleteCategory(id);
    await refresh();
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button onClick={() => setEditing({ ...emptyCategory, sortOrder: data.categories.length + 1 })} className="flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-bold text-white">
          <span className="material-symbols-outlined text-[20px]">add</span>
          Add Category
        </button>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {data.categories.map((category) => {
          const activeLinks = data.links.filter((link) => link.categoryId === category.id && link.isActive).length;
          return (
            <section key={category.id} className="glass-card rounded-[2rem] p-6">
              <div className="mb-6 flex items-start justify-between">
                <span className="material-symbols-outlined flex h-14 w-14 items-center justify-center rounded-3xl bg-primary/10 text-primary dark:text-inverse-primary">{category.icon}</span>
                <div className="flex gap-2">
                  <button onClick={() => setEditing(category)} className="flex h-10 w-10 items-center justify-center rounded-full bg-white/60 text-primary dark:bg-white/5 dark:text-inverse-primary">
                    <span className="material-symbols-outlined text-[20px]">edit</span>
                  </button>
                  <button onClick={() => remove(category.id)} className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/10 text-red-600">
                    <span className="material-symbols-outlined text-[20px]">delete</span>
                  </button>
                </div>
              </div>
              <h2 className="text-2xl font-bold">{category.name}</h2>
              <p className="mt-2 text-sm font-semibold text-outline">{activeLinks} Active Links</p>
              <button
                onClick={async () => {
                  await saveCategory({ ...category, isActive: !category.isActive });
                  await refresh();
                }}
                className={`mt-6 rounded-full px-3 py-1 text-xs font-bold ${category.isActive ? "bg-emerald-500/10 text-emerald-600" : "bg-slate-500/10 text-slate-500"}`}
              >
                {category.isActive ? "Visible" : "Hidden"}
              </button>
            </section>
          );
        })}
      </div>

      {editing && (
        <EditorModal title={editing.id ? "Edit Category" : "Add Category"} onClose={() => setEditing(null)} onSubmit={submit}>
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Name" value={editing.name} onChange={(name) => setEditing({ ...editing, name })} />
            <Input label="Icon" value={editing.icon} onChange={(icon) => setEditing({ ...editing, icon })} />
            <Input label="Sort Order" value={String(editing.sortOrder)} onChange={(sortOrder) => setEditing({ ...editing, sortOrder: Number(sortOrder) })} />
          </div>
        </EditorModal>
      )}
    </div>
  );
}

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || crypto.randomUUID();
}
