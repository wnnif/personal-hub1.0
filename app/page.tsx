import type { Metadata } from "next";
import { PortalHome } from "@/components/portal/PortalHome";
import { getPortalDataset } from "@/lib/server-data";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getPortalDataset();
  return {
    title: data.settings.siteTitle,
    description: data.settings.seoDescription
  };
}

export default async function HomePage() {
  const data = await getPortalDataset();
  return <PortalHome initialData={data} />;
}
