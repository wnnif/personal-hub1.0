import { AdminShell } from "@/components/admin/AdminShell";
import { DashboardClient } from "@/components/admin/DashboardClient";

export default function DashboardPage() {
  return (
    <AdminShell title="仪表盘" description="查看导航站的链接数量、访问统计和最近内容。">
      <DashboardClient />
    </AdminShell>
  );
}
