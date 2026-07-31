const COOKIE = "fu_admin_session";

function secret() {
  return process.env.ADMIN_SECRET || "dev-filip-admin-secret-change-me";
}

export function adminPassword() {
  return process.env.ADMIN_PASSWORD || "filip-admin";
}

async function hmac(payload: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(payload));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function signSession(expiresAt: number): Promise<string> {
  const payload = `ok.${expiresAt}`;
  const sig = await hmac(payload);
  return `${payload}.${sig}`;
}

export async function verifySession(
  token: string | undefined,
): Promise<boolean> {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [ok, exp, sig] = parts;
  if (ok !== "ok") return false;
  const expiresAt = Number(exp);
  if (!Number.isFinite(expiresAt) || Date.now() > expiresAt) return false;
  const payload = `${ok}.${exp}`;
  const expected = await hmac(payload);
  return sig === expected;
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const { cookies } = await import("next/headers");
  const jar = await cookies();
  return verifySession(jar.get(COOKIE)?.value);
}

export function sessionCookieOptions(token: string) {
  return {
    name: COOKIE,
    value: token,
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  };
}

export { COOKIE };
