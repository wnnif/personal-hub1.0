import { AdminShell } from "@/components/admin/AdminShell";
import { SettingsPanel } from "@/components/admin/SettingsPanel";

export default function SettingsPage() {
  return (
    <AdminShell title="全局设置" description="管理站点标题、SEO 描述和默认主题。">
      <SettingsPanel />
    </AdminShell>
  );
}
