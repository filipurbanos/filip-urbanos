import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/cms/auth";
import { createId, readCms, writeCms } from "@/lib/cms/store";
import type { Partner, PartnerTier } from "@/lib/cms/types";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const data = await readCms();
  return NextResponse.json({ partners: data.partners });
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await request.formData();
  const id = String(form.get("id") || "");
  const name = String(form.get("name") || "").trim();
  const url = String(form.get("url") || "").trim();
  const description = String(form.get("description") || "").trim();
  const tier = (String(form.get("tier") || "partner") === "main"
    ? "main"
    : "partner") as PartnerTier;
  const order = Number(form.get("order") || 100);
  const file = form.get("logo");

  if (!name) {
    return NextResponse.json({ error: "Chýba názov" }, { status: 400 });
  }

  const data = await readCms();
  let logo = "";

  if (file instanceof File && file.size > 0) {
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Logo musí byť obrázok" }, { status: 400 });
    }
    const ext = file.name.split(".").pop()?.toLowerCase() || "png";
    const filename = `${createId("logo")}.${ext}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadDir, { recursive: true });
    await fs.writeFile(
      path.join(uploadDir, filename),
      Buffer.from(await file.arrayBuffer()),
    );
    logo = `/uploads/${filename}`;
  }

  if (id) {
    data.partners = data.partners.map((item) => {
      if (item.id !== id) return item;
      return {
        ...item,
        name,
        url,
        description,
        tier,
        order: Number.isFinite(order) ? order : item.order,
        logo: logo || item.logo,
      };
    });
  } else {
    const partner: Partner = {
      id: createId("partner"),
      name,
      url,
      logo,
      tier,
      description,
      order: Number.isFinite(order) ? order : data.partners.length + 1,
    };
    data.partners.push(partner);
  }

  data.partners.sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));
  await writeCms(data);
  return NextResponse.json({ partners: data.partners });
}

export async function DELETE(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const data = await readCms();
  const partner = data.partners.find((item) => item.id === id);
  data.partners = data.partners.filter((item) => item.id !== id);
  await writeCms(data);

  if (partner?.logo.startsWith("/uploads/")) {
    await fs
      .unlink(path.join(process.cwd(), "public", partner.logo))
      .catch(() => undefined);
  }

  return NextResponse.json({ partners: data.partners });
}
