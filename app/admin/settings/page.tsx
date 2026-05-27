import { AdminShell } from "@/components/admin/AdminShell";
import { SettingsPanel } from "@/components/admin/SettingsPanel";

export default function SettingsPage() {
  return (
    <AdminShell title="General Settings" description="Manage global site configuration and theme preferences.">
      <SettingsPanel />
    </AdminShell>
  );
}
