"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { dictionaries } from "@/content";
import type { Content, Locale } from "@/content/types";
import { localePath, stripLocalePath } from "@/lib/locale-path";

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Content;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

function localeFromPath(pathname: string): Locale {
  return pathname === "/en" || pathname.startsWith("/en/") ? "en" : "sk";
}

export function LocaleProvider({
  children,
  initialLocale = "sk",
}: {
  children: ReactNode;
  initialLocale?: Locale;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const fromPath = localeFromPath(pathname || "/");
    setLocaleState(fromPath);
    document.documentElement.lang = fromPath;
  }, [pathname]);

  const setLocale = useCallback(
    (next: Locale) => {
      setLocaleState(next);
      document.documentElement.lang = next;
      const basePath = stripLocalePath(pathname || "/");
      router.push(localePath(next, basePath));
    },
    [pathname, router],
  );

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      t: dictionaries[locale],
    }),
    [locale, setLocale],
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useLocale must be used within LocaleProvider");
  }
  return ctx;
}
