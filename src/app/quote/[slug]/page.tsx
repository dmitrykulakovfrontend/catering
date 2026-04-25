import { notFound } from "next/navigation";
import {
  getQuoteBySlug,
  getAllPublishedSlugs,
  quoteToMenuData,
} from "@/lib/queries";
import { calculateStats } from "@/lib/calculations";
import Hero from "@/components/quote/Hero";
import YesButContrast from "@/components/quote/YesButContrast";
import QuotePromise from "@/components/quote/QuotePromise";
import QuoteMenu from "@/components/quote/QuoteMenu";
import StatsSummary from "@/components/quote/StatsSummary";
import Footer from "@/components/Footer";

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getAllPublishedSlugs();
  return slugs.map((q) => ({ slug: q.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const quote = await getQuoteBySlug(slug);
  if (!quote) return { title: { absolute: "Не найдено" } };
  const title = `${quote.eventTitle} · ${quote.persons} персон · ${quote.eventTime}`;
  const description = `Банкетное меню на ${quote.persons} персон, ${quote.eventTime}. Расчёт стоимости, состав блюд, сервис под ключ.`;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: `/quote/${slug}` },
    openGraph: {
      title,
      description,
      url: `/quote/${slug}`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function QuotePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const quote = await getQuoteBySlug(slug);

  if (!quote) {
    notFound();
  }

  const menuData = quoteToMenuData(quote);
  const stats = calculateStats(menuData);

  return (
    <div className="min-h-screen font-sans text-neutral-900">
      <Hero
        eventTitle={menuData.eventTitle}
        persons={menuData.persons}
        grandTotal={stats.grandTotal}
        manager={menuData.manager}
        validUntil={menuData.validUntil}
      />

      <QuotePromise />

      <QuoteMenu menuData={menuData} />

      <StatsSummary stats={stats} managerPhone={menuData.manager.phone} />

      <YesButContrast />

      <Footer phone={menuData.manager.phone} ctaClassName="bg-cream" />
    </div>
  );
}
