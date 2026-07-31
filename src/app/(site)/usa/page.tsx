import type { Metadata } from "next";
import { UsaView } from "@/components/page-views/UsaView";

export const metadata: Metadata = {
  title: "USA",
  description:
    "USA kapitola Filipa Urbánoša — štúdium a tenis v Spojených štátoch.",
};

export default function UsaPage() {
  return (
    <div className="page">
      <UsaView />
    </div>
  );
}
