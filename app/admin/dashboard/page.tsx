import { AdminShell } from "@/components/admin/AdminShell";
import { DashboardClient } from "@/components/admin/DashboardClient";

export default function DashboardPage() {
  return (
    <AdminShell title="Dashboard" description="Here is what's happening with your portal today.">
      <DashboardClient />
    </AdminShell>
  );
}
