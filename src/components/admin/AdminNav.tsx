"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/tournaments", label: "Turnaje" },
  { href: "/admin/albums", label: "Albumy" },
  { href: "/admin/gallery", label: "Fotky" },
  { href: "/admin/videos", label: "Videá" },
  { href: "/admin/partners", label: "Partneri" },
  { href: "/admin/settings", label: "Nastavenia" },
];

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <header className="admin-nav">
      <div className="admin-nav__inner">
        <Link href="/admin" className="admin-nav__brand">
          Admin · Filip
        </Link>
        <nav>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={pathname === link.href ? "is-active" : ""}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="admin-nav__actions">
          <Link href="/">Web</Link>
          <button type="button" onClick={logout}>
            Odhlásiť
          </button>
        </div>
      </div>
    </header>
  );
}
