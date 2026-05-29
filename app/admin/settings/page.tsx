import { AdminShell } from "@/components/admin/AdminShell";
import { CredentialsPanel } from "@/components/admin/CredentialsPanel";
import { SettingsPanel } from "@/components/admin/SettingsPanel";

export default function SettingsPage() {
  return (
    <AdminShell title="全局设置" description="管理站点标题、SEO 描述、默认主题和后台账号密码。">
      <div className="space-y-6">
        <SettingsPanel />
        <CredentialsPanel />
      </div>
    </AdminShell>
  );
}
