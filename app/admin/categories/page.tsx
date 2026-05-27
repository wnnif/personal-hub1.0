import { AdminShell } from "@/components/admin/AdminShell";
import { CategoriesManager } from "@/components/admin/CategoriesManager";

export default function CategoriesPage() {
  return (
    <AdminShell title="Categories" description="Manage and organize your portal's taxonomies.">
      <CategoriesManager />
    </AdminShell>
  );
}
