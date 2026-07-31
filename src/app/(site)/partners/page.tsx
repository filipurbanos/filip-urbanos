import type { Metadata } from "next";
import { PartnersView } from "@/components/page-views/PartnersView";
import { readCms } from "@/lib/cms/store";

export const metadata: Metadata = {
  title: "Partneri",
  description:
    "Partneri, sponzoring, media kit a spolupráca s Filipom Urbánošom.",
};

export const dynamic = "force-dynamic";

export default async function PartnersPage() {
  const data = await readCms();

  return (
    <div className="page">
      <PartnersView partners={data.partners} />
    </div>
  );
}
