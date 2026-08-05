import { NextResponse } from "next/server";
import { appendInquiry, type InquiryTopic } from "@/lib/cms/inquiries";
import { clientIp, takeRateLimit } from "@/lib/cms/rate-limit";

const TOPICS = new Set<InquiryTopic>(["partner", "media", "other"]);

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const ip = clientIp(request);
  const limit = takeRateLimit(`contact:${ip}`, 5, 15 * 60 * 1000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many requests" },
      {
        status: 429,
        headers: { "Retry-After": String(limit.retryAfterSec) },
      },
    );
  }

  let body: {
    name?: string;
    email?: string;
    topic?: string;
    message?: string;
    company?: string;
  };

  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Honeypot: bots fill hidden "company" — pretend success, drop the message.
  if (String(body.company || "").trim()) {
    return NextResponse.json({ ok: true });
  }

  const name = String(body.name || "").trim().slice(0, 120);
  const email = String(body.email || "").trim().slice(0, 160).toLowerCase();
  const topic = String(body.topic || "").trim() as InquiryTopic;
  const message = String(body.message || "").trim().slice(0, 4000);

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }
  if (!TOPICS.has(topic)) {
    return NextResponse.json({ error: "Invalid topic" }, { status: 400 });
  }
  if (message.length < 10) {
    return NextResponse.json({ error: "Message too short" }, { status: 400 });
  }

  await appendInquiry({ name, email, topic, message, ip });

  return NextResponse.json({ ok: true });
}
