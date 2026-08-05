"use client";

import { LocaleProvider } from "@/lib/locale";
import type { Locale } from "@/content/types";
import type { ReactNode } from "react";

export function Providers({
  children,
  initialLocale,
}: {
  children: ReactNode;
  initialLocale: Locale;
}) {
  return (
    <LocaleProvider initialLocale={initialLocale}>{children}</LocaleProvider>
  );
}
