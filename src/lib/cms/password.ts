import { promises as fs } from "fs";
import path from "path";
import { adminPassword } from "@/lib/cms/auth";

const AUTH_PATH = path.join(process.cwd(), "data", "auth.json");

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
    const raw = await fs.readFile(AUTH_PATH, "utf8");
    return JSON.parse(raw) as AuthFile;
  } catch {
    return null;
  }
}

export async function verifyPassword(password: string): Promise<boolean> {
  const stored = await readAuthFile();
  if (!stored?.salt || !stored?.hash) {
    return password === adminPassword();
  }
  const hash = await deriveHash(password, stored.salt);
  return hash === stored.hash;
}

export async function setPassword(password: string): Promise<void> {
  const salt = createSalt();
  const hash = await deriveHash(password, salt);
  const payload: AuthFile = {
    salt,
    hash,
    updatedAt: new Date().toISOString(),
  };
  await fs.mkdir(path.dirname(AUTH_PATH), { recursive: true });
  await fs.writeFile(AUTH_PATH, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
}
