import { AdminShell } from "@/components/admin/AdminShell";
import { ProfileSettings } from "@/components/admin/ProfileSettings";

export default function ProfilePage() {
  return (
    <AdminShell title="Profile Settings" description="Manage your public persona and contact information.">
      <ProfileSettings />
    </AdminShell>
  );
}
