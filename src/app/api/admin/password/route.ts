import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/cms/auth";
import { setPassword, verifyPassword } from "@/lib/cms/password";

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as {
    currentPassword?: string;
    newPassword?: string;
  };

  if (!body.currentPassword || !body.newPassword) {
    return NextResponse.json({ error: "Vyplň všetky polia" }, { status: 400 });
  }

  if (body.newPassword.length < 8) {
    return NextResponse.json(
      { error: "Nové heslo musí mať aspoň 8 znakov" },
      { status: 400 },
    );
  }

  if (!(await verifyPassword(body.currentPassword))) {
    return NextResponse.json(
      { error: "Aktuálne heslo nesedí" },
      { status: 401 },
    );
  }

  await setPassword(body.newPassword);
  return NextResponse.json({ ok: true });
}
