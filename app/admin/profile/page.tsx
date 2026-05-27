import { AdminShell } from "@/components/admin/AdminShell";
import { ProfileSettings } from "@/components/admin/ProfileSettings";

export default function ProfilePage() {
  return (
    <AdminShell title="个人资料" description="管理前台展示的头像、简介和联系方式。">
      <ProfileSettings />
    </AdminShell>
  );
}
