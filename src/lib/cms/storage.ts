import { promises as fs } from "fs";
import path from "path";
import { del, get, put } from "@vercel/blob";
import { isManagedUploadUrl } from "@/lib/cms/media-url";

export { isManagedUploadUrl, isPlayableMediaUrl } from "@/lib/cms/media-url";

const CONTENT_PATHNAME = "cms/content.json";
const AUTH_PATHNAME = "cms/auth.json";

/** Blob when token is set (or CMS_DRIVER=blob). Force fs with CMS_DRIVER=fs. */
export function usesBlobStorage(): boolean {
  if (process.env.CMS_DRIVER === "fs") return false;
  if (process.env.CMS_DRIVER === "blob") return true;
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim());
}

async function readTextFile(filePath: string): Promise<string | null> {
  try {
    return await fs.readFile(filePath, "utf8");
  } catch {
    return null;
  }
}

export async function readCmsJson(): Promise<string | null> {
  if (usesBlobStorage()) {
    const result = await get(CONTENT_PATHNAME, {
      access: "public",
      useCache: false,
    });
    if (!result?.stream) {
      const seed = await readTextFile(
        path.join(process.cwd(), "data", "content.json"),
      );
      if (seed) {
        await writeCmsJson(seed);
        return seed;
      }
      return null;
    }
    return new Response(result.stream).text();
  }

  return readTextFile(path.join(process.cwd(), "data", "content.json"));
}

export async function writeCmsJson(json: string): Promise<void> {
  if (usesBlobStorage()) {
    await put(CONTENT_PATHNAME, json, {
      access: "public",
      contentType: "application/json",
      addRandomSuffix: false,
      allowOverwrite: true,
    });
    return;
  }

  const filePath = path.join(process.cwd(), "data", "content.json");
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, json, "utf8");
}

export async function readAuthJson(): Promise<string | null> {
  if (usesBlobStorage()) {
    // Prefer private store when available; fall back to public (legacy).
    let result = await get(AUTH_PATHNAME, {
      access: "private",
      useCache: false,
    }).catch(() => null);

    if (!result?.stream) {
      result = await get(AUTH_PATHNAME, {
        access: "public",
        useCache: false,
      }).catch(() => null);
    }

    if (!result?.stream) return null;
    const raw = await new Response(result.stream).text();
    try {
      const { openJson } = await import("@/lib/cms/secure-json");
      const opened = await openJson(raw);
      // Migrate legacy plaintext auth.json to sealed storage.
      if (!raw.trim().startsWith("fu1.")) {
        await writeAuthJson(opened);
      }
      return opened;
    } catch {
      return null;
    }
  }

  return readTextFile(path.join(process.cwd(), "data", "auth.json"));
}

export async function writeAuthJson(json: string): Promise<void> {
  if (usesBlobStorage()) {
    const { sealJson } = await import("@/lib/cms/secure-json");
    const sealed = await sealJson(json);

    // Encrypt at rest so a public Blob store never exposes the password hash.
    // Try private store first; fall back to sealed public object.
    try {
      await put(AUTH_PATHNAME, sealed, {
        access: "private",
        contentType: "text/plain",
        addRandomSuffix: false,
        allowOverwrite: true,
      });
      return;
    } catch {
      await put(AUTH_PATHNAME, sealed, {
        access: "public",
        contentType: "text/plain",
        addRandomSuffix: false,
        allowOverwrite: true,
      });
      return;
    }
  }

  const filePath = path.join(process.cwd(), "data", "auth.json");
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, json, "utf8");
}

export type SaveUploadInput = {
  filename: string;
  body: Buffer | Blob | string;
  contentType?: string;
};

/** Saves under uploads/ and returns a public URL (/uploads/... or Blob URL). */
export async function saveUpload(input: SaveUploadInput): Promise<string> {
  const pathname = `uploads/${input.filename}`;

  if (usesBlobStorage()) {
    const blob = await put(pathname, input.body, {
      access: "public",
      contentType: input.contentType,
      addRandomSuffix: false,
      allowOverwrite: true,
      multipart: true,
    });
    return blob.url;
  }

  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(uploadDir, { recursive: true });
  const filePath = path.join(uploadDir, input.filename);

  if (Buffer.isBuffer(input.body) || typeof input.body === "string") {
    await fs.writeFile(filePath, input.body);
  } else {
    await fs.writeFile(filePath, Buffer.from(await input.body.arrayBuffer()));
  }

  return `/uploads/${input.filename}`;
}

export async function deleteUpload(url: string): Promise<void> {
  if (!isManagedUploadUrl(url)) return;

  if (url.startsWith("http")) {
    await del(url).catch(() => undefined);
    return;
  }

  if (usesBlobStorage()) {
    await del(url.replace(/^\//, "")).catch(() => undefined);
    return;
  }

  const filePath = path.join(process.cwd(), "public", url);
  await fs.unlink(filePath).catch(() => undefined);
}
