import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { Toaster } from "sonner";
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
  title: "Любимый Кейтеринг",
  description: "Банкетное меню и кейтеринг для вашего мероприятия",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${playfair.variable} ${inter.variable} antialiased`}>
      <body className="min-h-screen bg-[#FAF8F5] text-[#1A1A1A] font-sans">
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
