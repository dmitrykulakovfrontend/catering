import { notFound } from "next/navigation";
import {
  getQuoteBySlug,
  getAllPublishedSlugs,
  quoteToMenuData,
} from "@/lib/queries";
import { calculateStats } from "@/lib/calculations";
import Hero from "@/components/quote/Hero";
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
  if (!quote) return { title: "Не найдено" };
  const description = `${quote.persons} персон · ${quote.eventTime} · Банкетное меню от Любимого Кейтеринга`;
  return {
    title: quote.eventTitle,
    description,
    alternates: { canonical: `/quote/${slug}` },
    openGraph: {
      title: quote.eventTitle,
      description,
      url: `/quote/${slug}`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: quote.eventTitle,
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

      <QuoteMenu menuData={menuData} />

      <StatsSummary stats={stats} managerPhone={menuData.manager.phone} />

      <Footer phone={menuData.manager.phone} ctaClassName="bg-cream" />
    </div>
  );
}
