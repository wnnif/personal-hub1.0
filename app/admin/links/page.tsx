import { AdminShell } from "@/components/admin/AdminShell";
import { LinksManager } from "@/components/admin/LinksManager";

export default function LinksPage() {
  return (
    <AdminShell title="链接管理" description="管理、排序和分类你的导航链接。">
      <LinksManager />
    </AdminShell>
  );
}
