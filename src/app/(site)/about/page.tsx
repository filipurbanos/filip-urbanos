import type { Metadata } from "next";
import { AboutView } from "@/components/page-views/AboutView";

export const metadata: Metadata = {
  title: "O Filipovi",
  description:
    "O Filipovi Urbánošovi — ambícia, disciplína a rast slovenského juniorského tenistu.",
};

export default function AboutPage() {
  return (
    <div className="page">
      <AboutView />
    </div>
  );
}
