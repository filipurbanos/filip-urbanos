import type { Metadata } from "next";
import { Bebas_Neue, Outfit } from "next/font/google";
import { Providers } from "@/components/Providers";
import { dictionaries } from "@/content";
import "./globals.css";

const display = Bebas_Neue({
  weight: "400",
  subsets: ["latin", "latin-ext"],
  variable: "--font-display",
});

const body = Outfit({
  subsets: ["latin", "latin-ext"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: {
    default: dictionaries.sk.meta.title,
    template: "%s | Filip Urbánoš",
  },
  description: dictionaries.sk.meta.description,
  openGraph: {
    title: dictionaries.sk.meta.title,
    description: dictionaries.sk.meta.description,
    type: "website",
    locale: "sk_SK",
    alternateLocale: ["en_US"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sk" className={`${display.variable} ${body.variable} h-full`}>
      <body className="min-h-full antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
