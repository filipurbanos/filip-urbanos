import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Outfit } from "next/font/google";
import { Providers } from "@/components/Providers";
import { dictionaries } from "@/content";
import { siteUrl } from "@/lib/site-url";
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

const site = siteUrl();

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL(site),
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
    url: site,
    siteName: "Filip Urbánoš",
    images: [
      {
        url: "/media/hero.jpg",
        width: 1600,
        height: 1068,
        alt: "Filip Urbánoš",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: dictionaries.sk.meta.title,
    description: dictionaries.sk.meta.description,
    images: ["/media/hero.jpg"],
  },
  robots: {
    index: true,
    follow: true,
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
