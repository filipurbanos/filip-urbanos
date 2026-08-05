import { adminPassword } from "@/lib/cms/auth";
import { timingSafeEqualHex } from "@/lib/cms/secure-json";
import { readAuthJson, writeAuthJson } from "@/lib/cms/storage";

type AuthFile = {
  salt: string;
  hash: string;
  updatedAt: string;
};

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function fromHex(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i += 1) {
    bytes[i] = Number.parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

async function deriveHash(password: string, saltHex: string): Promise<string> {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: fromHex(saltHex) as BufferSource,
      iterations: 120_000,
      hash: "SHA-256",
    },
    keyMaterial,
    256,
  );
  return toHex(bits);
}

function createSalt(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return toHex(bytes.buffer);
}

async function readAuthFile(): Promise<AuthFile | null> {
  try {
    const raw = await readAuthJson();
    if (!raw) return null;
    return JSON.parse(raw) as AuthFile;
  } catch {
    return null;
  }
}

/** Epoch used to invalidate sessions after password change. */
export async function authEpoch(): Promise<number> {
  const stored = await readAuthFile();
  if (!stored?.updatedAt) return 0;
  const t = Date.parse(stored.updatedAt);
  return Number.isFinite(t) ? t : 0;
}

export async function verifyPassword(password: string): Promise<boolean> {
  const stored = await readAuthFile();
  if (!stored?.salt || !stored?.hash) {
    const bootstrap = adminPassword();
    if (!bootstrap) return false;
    const enc = new TextEncoder();
    const a = enc.encode(password);
    const b = enc.encode(bootstrap);
    if (a.length !== b.length) return false;
    let diff = 0;
    for (let i = 0; i < a.length; i += 1) {
      diff |= a[i]! ^ b[i]!;
    }
    return diff === 0;
  }
  const hash = await deriveHash(password, stored.salt);
  return timingSafeEqualHex(hash, stored.hash);
}

export async function setPassword(password: string): Promise<void> {
  const salt = createSalt();
  const hash = await deriveHash(password, salt);
  const payload: AuthFile = {
    salt,
    hash,
    updatedAt: new Date().toISOString(),
  };
  await writeAuthJson(`${JSON.stringify(payload, null, 2)}\n`);
}
