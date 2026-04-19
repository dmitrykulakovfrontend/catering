import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/next";
import { SITE_URL } from "@/lib/siteUrl";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Любимый Кейтеринг · Lovely Catering — Кейтеринг в Москве",
    template: "%s — Любимый Кейтеринг · Lovely Catering",
  },
  description:
    "Любимый Кейтеринг (Lovely Catering) — кейтеринг в Москве: банкеты, фуршеты, корпоративы, свадьбы. Авторское меню, европейский сервис, 10 лет опыта. Расчёт за 1 день.",
  keywords: [
    "кейтеринг",
    "кейтеринг москва",
    "любимый кейтеринг",
    "lovely catering",
    "catering moscow",
    "банкет",
    "фуршет",
    "корпоратив",
    "свадебный кейтеринг",
    "выездное обслуживание",
    "банкетное меню",
  ],
  applicationName: "Любимый Кейтеринг · Lovely Catering",
  authors: [{ name: "Любимый Кейтеринг · Lovely Catering" }],
  creator: "Любимый Кейтеринг · Lovely Catering",
  publisher: "Любимый Кейтеринг · Lovely Catering",
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/manifest.webmanifest",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: "/",
    siteName: "Любимый Кейтеринг · Lovely Catering",
    title: "Любимый Кейтеринг · Lovely Catering — Кейтеринг в Москве",
    description:
      "Банкеты, фуршеты, корпоративы, свадьбы. Авторское меню и сервис под ключ.",
    alternateLocale: ["en_US"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Любимый Кейтеринг · Lovely Catering — Кейтеринг в Москве",
    description:
      "Банкеты, фуршеты, корпоративы, свадьбы. Авторское меню и сервис под ключ.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#1A1A1A",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={`${playfair.variable} ${inter.variable} antialiased`}
    >
      <body className="min-h-screen bg-[#F7F8FB] text-[#1A1A1A] font-sans">
        {children}
        <Toaster position="top-right" richColors />
        <Analytics />
      </body>
    </html>
  );
}
