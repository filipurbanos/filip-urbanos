import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { isAdminAuthenticated } from "@/lib/cms/auth-server";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = (await headers()).get("x-pathname") || "";

  if (pathname !== "/admin/login") {
    if (!(await isAdminAuthenticated())) {
      redirect("/admin/login");
    }
  }

  return <AdminShell>{children}</AdminShell>;
}
