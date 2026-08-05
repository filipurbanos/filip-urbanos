import { Hero } from "@/components/Hero";
import { HomeHub } from "@/components/HomeHub";
import { News } from "@/components/SiteSections";
import { homeMetadata } from "@/lib/page-meta";

export async function generateMetadata() {
  return homeMetadata();
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <HomeHub />
      <News />
    </>
  );
}
