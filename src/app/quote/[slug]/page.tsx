import { notFound } from 'next/navigation'
import { getQuoteBySlug, getAllPublishedSlugs, quoteToMenuData } from '@/lib/queries'
import { calculateStats } from '@/lib/calculations'
import Hero from '@/components/Hero'
import MenuSection from '@/components/MenuSection'
import MenuItem from '@/components/MenuItem'
import WelcomeSection from '@/components/WelcomeSection'
import ServicesTable from '@/components/ServicesTable'
import StatsSummary from '@/components/StatsSummary'
import Footer from '@/components/Footer'

export const revalidate = 60

export async function generateStaticParams() {
  const slugs = await getAllPublishedSlugs()
  return slugs.map((q) => ({ slug: q.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const quote = await getQuoteBySlug(slug)
  if (!quote) return { title: 'Не найдено' }
  return {
    title: `${quote.eventTitle} — Любимый Кейтеринг`,
    description: `Банкетное меню для ${quote.clientName}`,
  }
}

export default async function QuotePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const quote = await getQuoteBySlug(slug)

  if (!quote || quote.status === 'draft') {
    notFound()
  }

  const menuData = quoteToMenuData(quote)
  const stats = calculateStats(menuData)

  return (
    <main>
      <Hero
        eventTitle={menuData.eventTitle}
        eventTime={menuData.eventTime}
        persons={menuData.persons}
        grandTotal={stats.grandTotal}
        client={menuData.client}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {menuData.banquet.map((category) => (
          <MenuSection key={category.id} title={category.title}>
            {category.items.map((item) => (
              <MenuItem key={item.id} item={item} />
            ))}
          </MenuSection>
        ))}

        <WelcomeSection items={menuData.welcome} />

        <ServicesTable services={menuData.services} persons={menuData.persons} />

        <StatsSummary stats={stats} />
      </div>

      <Footer />
    </main>
  )
}
