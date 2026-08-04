import { adminSecret } from "@/lib/cms/auth";

const PREFIX = "fu1.";

function toHex(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  return Array.from(bytes)
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

async function deriveKey(secret: string): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const material = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    "PBKDF2",
    false,
    ["deriveKey"],
  );
  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: enc.encode("filip-urbanos-auth-blob-v1"),
      iterations: 100_000,
      hash: "SHA-256",
    },
    material,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}

/** Encrypt sensitive JSON before storing on a public Blob store. */
export async function sealJson(plaintext: string): Promise<string> {
  const secret = adminSecret();
  if (!secret) {
    throw new Error("ADMIN_SECRET is not configured");
  }
  const key = await deriveKey(secret);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const cipher = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    new TextEncoder().encode(plaintext),
  );
  return `${PREFIX}${toHex(iv)}.${toHex(cipher)}`;
}

/** Decrypt sealed payload, or return plaintext for legacy unencrypted files. */
export async function openJson(raw: string): Promise<string> {
  const trimmed = raw.trim();
  if (!trimmed.startsWith(PREFIX)) {
    return raw;
  }

  const secret = adminSecret();
  if (!secret) {
    throw new Error("ADMIN_SECRET is not configured");
  }

  const body = trimmed.slice(PREFIX.length);
  const [ivHex, cipherHex] = body.split(".");
  if (!ivHex || !cipherHex) {
    throw new Error("Invalid sealed auth payload");
  }

  const key = await deriveKey(secret);
  const plain = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: fromHex(ivHex) as BufferSource },
    key,
    fromHex(cipherHex) as BufferSource,
  );
  return new TextDecoder().decode(plain);
}

export function timingSafeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}
