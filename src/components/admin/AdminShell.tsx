"use client";

import { AdminNav } from "@/components/admin/AdminNav";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname === "/admin/login";

  if (isLogin) {
    return <>{children}</>;
  }

  return (
    <div className="admin-shell">
      <AdminNav />
      <div className="admin-shell__content">{children}</div>
    </div>
  );
}
