import type { Metadata } from "next";
import { JourneyView } from "@/components/page-views/JourneyView";

export const metadata: Metadata = {
  title: "Športová cesta",
  description:
    "Športová cesta Filipa Urbánoša — od Slovenska cez Barcelonu do USA.",
};

export default function JourneyPage() {
  return (
    <div className="page">
      <JourneyView />
    </div>
  );
}
