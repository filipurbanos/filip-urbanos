import type { Inquiry } from "@/lib/cms/inquiries";
import { siteUrl } from "@/lib/site-url";

const TOPIC_LABEL: Record<Inquiry["topic"], string> = {
  partner: "Partnerstvo",
  media: "Médiá",
  other: "Iné",
};

function adminInquiriesUrl() {
  return `${siteUrl()}/admin/inquiries`;
}

function summaryLines(inquiry: Inquiry) {
  return [
    `*Nová správa z webu*`,
    `*Od:* ${inquiry.name} <${inquiry.email}>`,
    `*Téma:* ${TOPIC_LABEL[inquiry.topic]}`,
    `*Admin:* ${adminInquiriesUrl()}`,
    "",
    inquiry.message,
  ];
}

async function notifySlack(inquiry: Inquiry) {
  const webhook = process.env.CONTACT_SLACK_WEBHOOK_URL?.trim();
  if (!webhook) return;

  const text = summaryLines(inquiry).join("\n");
  const res = await fetch(webhook, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) {
    throw new Error(`Slack webhook failed: ${res.status}`);
  }
}

async function notifyEmail(inquiry: Inquiry) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const to = process.env.CONTACT_NOTIFY_TO?.trim();
  const from =
    process.env.CONTACT_NOTIFY_FROM?.trim() ||
    "Filip Urbanos Web <onboarding@resend.dev>";
  if (!apiKey || !to) return;

  const subject = `[Web] ${TOPIC_LABEL[inquiry.topic]} — ${inquiry.name}`;
  const text = [
    `Nová správa z kontaktného formulára`,
    "",
    `Od: ${inquiry.name} <${inquiry.email}>`,
    `Téma: ${TOPIC_LABEL[inquiry.topic]}`,
    `Admin: ${adminInquiriesUrl()}`,
    "",
    inquiry.message,
  ].join("\n");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: inquiry.email,
      subject,
      text,
    }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Resend failed: ${res.status} ${body}`);
  }
}

/** Best-effort notify; never throws to the contact API. */
export async function notifyInquiry(inquiry: Inquiry): Promise<void> {
  const results = await Promise.allSettled([
    notifySlack(inquiry),
    notifyEmail(inquiry),
  ]);
  for (const result of results) {
    if (result.status === "rejected") {
      console.error("[notifyInquiry]", result.reason);
    }
  }
}
