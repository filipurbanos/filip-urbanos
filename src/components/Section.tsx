"use client";

import { Reveal } from "@/components/Reveal";
import type { CSSProperties, ReactNode } from "react";

export function SectionHeader({
  eyebrow,
  title,
  lead,
}: {
  eyebrow: string;
  title: string;
  lead: string;
}) {
  return (
    <Reveal>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="section-title">{title}</h2>
      <p className="section-lead">{lead}</p>
    </Reveal>
  );
}

export function Section({
  id,
  className = "",
  children,
  narrow = false,
  style,
}: {
  id: string;
  className?: string;
  children: ReactNode;
  narrow?: boolean;
  style?: CSSProperties;
}) {
  return (
    <section className={`section ${className}`} id={id} style={style}>
      <div className={narrow ? "shell shell--narrow" : "shell"}>{children}</div>
    </section>
  );
}
