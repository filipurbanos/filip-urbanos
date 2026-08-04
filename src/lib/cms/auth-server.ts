import { cookies } from "next/headers";
import {
  COOKIE,
  sessionEpoch,
  verifySession,
} from "@/lib/cms/auth";
import { authEpoch } from "@/lib/cms/password";

/**
 * Node-only admin gate: valid HMAC session + password epoch match.
 * Use this from Route Handlers / Server Components — not from Edge middleware.
 */
export async function isAdminAuthenticated(): Promise<boolean> {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!(await verifySession(token))) return false;

  const cookieEpoch = sessionEpoch(token);
  if (cookieEpoch === null) return false;

  try {
    const current = await authEpoch();
    return cookieEpoch === current;
  } catch {
    return false;
  }
}
