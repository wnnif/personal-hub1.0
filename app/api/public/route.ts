import { NextResponse } from "next/server";
import { getPortalDataset } from "@/lib/server-data";

export async function GET() {
  return NextResponse.json(await getPortalDataset());
}
