import { AdminShell } from "@/components/admin/AdminShell";
import { LinksManager } from "@/components/admin/LinksManager";

export default function LinksPage() {
  return (
    <AdminShell title="Links Management" description="Manage, reorder, and categorize your portal links.">
      <LinksManager />
    </AdminShell>
  );
}
