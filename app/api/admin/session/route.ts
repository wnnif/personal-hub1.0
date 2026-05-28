import { NextRequest, NextResponse } from "next/server";
import { adminEmail, isAuthenticated } from "@/lib/auth";
import { clientConfig } from "@/lib/client-config";

export async function GET(request: NextRequest) {
  return NextResponse.json({
    authenticated: isAuthenticated(request),
    email: adminEmail(),
    ...clientConfig()
  });
}
