import Link from "next/link";
import { readInquiries } from "@/lib/cms/inquiries";
import { readCms } from "@/lib/cms/store";

export const metadata = {
  title: "Admin",
};

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [data, inquiries] = await Promise.all([readCms(), readInquiries()]);

  const cards = [
    {
      href: "/admin/tournaments",
      label: "Turnaje",
      count: data.tournaments.length,
      hint: "Kalendár + výsledky",
    },
    {
      href: "/admin/albums",
      label: "Albumy",
      count: data.albums.length,
      hint: "Akcie / záložky médií",
    },
    {
      href: "/admin/gallery",
      label: "Fotky",
      count: data.photos.length,
      hint: "Upload do galérie",
    },
    {
      href: "/admin/videos",
      label: "Videá",
      count: data.videos.length,
      hint: "URL alebo upload súboru (na Vercel ide do Blob)",
    },
    {
      href: "/admin/partners",
      label: "Partneri",
      count: data.partners.length,
      hint: "Hlavný + ďalší sponzori",
    },
    {
      href: "/admin/inquiries",
      label: "Správy",
      count: inquiries.length,
      hint: "Kontaktný formulár",
    },
  ];

  return (
    <div className="admin-page">
      <h1>Dashboard</h1>
      <p className="admin-lead">
        Správa obsahu webu — turnaje, fotky, videá a partneri. Zmeny sa hneď
        prejavia na verejných stránkach.
      </p>
      <div className="admin-cards">
        {cards.map((card) => (
          <Link key={card.href} href={card.href} className="admin-card">
            <span className="admin-card__label">{card.label}</span>
            <span className="admin-card__count">{card.count}</span>
            <span className="admin-card__hint">{card.hint}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
