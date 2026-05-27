import { AdminShell } from "@/components/admin/AdminShell";
import { CategoriesManager } from "@/components/admin/CategoriesManager";

export default function CategoriesPage() {
  return (
    <AdminShell title="分类管理" description="维护前台筛选分类和链接归档方式。">
      <CategoriesManager />
    </AdminShell>
  );
}
