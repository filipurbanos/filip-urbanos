import {
  readInquiriesJson,
  writeInquiriesJson,
} from "@/lib/cms/storage";

export type InquiryTopic = "partner" | "media" | "other";

export type Inquiry = {
  id: string;
  name: string;
  email: string;
  topic: InquiryTopic;
  message: string;
  createdAt: string;
  ip: string;
};

function createInquiryId() {
  return `inq_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

export async function readInquiries(): Promise<Inquiry[]> {
  const raw = await readInquiriesJson();
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as { inquiries?: Inquiry[] };
    return Array.isArray(parsed.inquiries) ? parsed.inquiries : [];
  } catch {
    return [];
  }
}

export async function appendInquiry(
  input: Omit<Inquiry, "id" | "createdAt">,
): Promise<Inquiry> {
  const inquiries = await readInquiries();
  const inquiry: Inquiry = {
    id: createInquiryId(),
    createdAt: new Date().toISOString(),
    ...input,
  };
  inquiries.unshift(inquiry);
  await writeInquiriesJson(JSON.stringify({ inquiries }, null, 2));
  return inquiry;
}

export async function deleteInquiry(id: string): Promise<Inquiry[]> {
  const inquiries = (await readInquiries()).filter((item) => item.id !== id);
  await writeInquiriesJson(JSON.stringify({ inquiries }, null, 2));
  return inquiries;
}
