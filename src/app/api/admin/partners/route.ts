import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/cms/auth-server";
import { createId, mutateCms, readCms } from "@/lib/cms/store";
import { deleteUpload, saveUpload } from "@/lib/cms/storage";
import type { Partner, PartnerTier } from "@/lib/cms/types";
import { handleCmsWriteError } from "@/lib/cms/write-helpers";

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

  let logo = "";
  if (file instanceof File && file.size > 0) {
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Logo musí byť obrázok" }, { status: 400 });
    }
    const ext = file.name.split(".").pop()?.toLowerCase() || "png";
    const filename = `${createId("logo")}.${ext}`;
    logo = await saveUpload({
      filename,
      body: Buffer.from(await file.arrayBuffer()),
      contentType: file.type || "image/png",
    });
  }

  try {
    const data = await mutateCms((data) => {
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

      data.partners.sort(
        (a, b) => a.order - b.order || a.name.localeCompare(b.name),
      );
    });
    return NextResponse.json({ partners: data.partners });
  } catch (error) {
    return handleCmsWriteError(error);
  }
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

  try {
    let removedLogo = "";
    const data = await mutateCms((data) => {
      const partner = data.partners.find((item) => item.id === id);
      removedLogo = partner?.logo || "";
      data.partners = data.partners.filter((item) => item.id !== id);
    });
    if (removedLogo) {
      await deleteUpload(removedLogo);
    }
    return NextResponse.json({ partners: data.partners });
  } catch (error) {
    return handleCmsWriteError(error);
  }
}
