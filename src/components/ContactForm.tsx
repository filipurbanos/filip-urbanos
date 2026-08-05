"use client";

import { useState } from "react";
import { Section, SectionHeader } from "@/components/Section";
import { useLocale } from "@/lib/locale";

type Topic = "partner" | "media" | "other";

export function ContactForm({ flushTop = false }: { flushTop?: boolean }) {
  const { t } = useLocale();
  const formCopy = t.contact.form;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState<Topic>("partner");
  const [message, setMessage] = useState("");
  const [company, setCompany] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">(
    "idle",
  );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, topic, message, company }),
      });
      if (!res.ok) {
        setStatus("error");
        return;
      }
      setStatus("ok");
      setName("");
      setEmail("");
      setTopic("partner");
      setMessage("");
      setCompany("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <Section
      id="contact-form"
      className={`contact-form-section${flushTop ? " section--after-banner" : ""}`}
    >
      <SectionHeader
        eyebrow={formCopy.eyebrow}
        title={formCopy.title}
        lead={formCopy.lead}
      />
      <form className="contact-form" onSubmit={onSubmit}>
        <label className="hp-field" aria-hidden="true">
          Company
          <input
            name="company"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
        </label>
        <label>
          {formCopy.name}
          <input
            name="name"
            autoComplete="name"
            required
            maxLength={120}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label>
          {formCopy.email}
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={160}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label>
          {formCopy.topic}
          <select
            name="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value as Topic)}
          >
            <option value="partner">{formCopy.topics.partner}</option>
            <option value="media">{formCopy.topics.media}</option>
            <option value="other">{formCopy.topics.other}</option>
          </select>
        </label>
        <label className="contact-form__wide">
          {formCopy.message}
          <textarea
            name="message"
            required
            minLength={10}
            maxLength={4000}
            rows={6}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </label>
        <div className="contact-form__actions">
          <button
            type="submit"
            className="btn btn--primary"
            disabled={status === "sending"}
          >
            {status === "sending" ? formCopy.sending : formCopy.submit}
          </button>
          {status === "ok" ? (
            <p className="contact-form__ok">{formCopy.success}</p>
          ) : null}
          {status === "error" ? (
            <p className="contact-form__error">{formCopy.error}</p>
          ) : null}
        </div>
      </form>
    </Section>
  );
}
