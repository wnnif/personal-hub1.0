import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getVisitStats } from "@/lib/server-data";

export async function GET(request: NextRequest) {
  const unauthorized = requireAdmin(request);
  if (unauthorized) return unauthorized;

  const dailyVisits = await getVisitStats(14);
  return NextResponse.json({
    dailyVisits,
    todayVisitors: dailyVisits.at(-1)?.visitors ?? 0
  });
}
