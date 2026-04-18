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
    description: `Банкетное меню — ${quote.eventTitle}`,
  }
}

export default async function QuotePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const quote = await getQuoteBySlug(slug)

  if (!quote) {
    notFound()
  }

  const menuData = quoteToMenuData(quote)
  const stats = calculateStats(menuData)

  return (
    <div className="min-h-screen font-sans text-neutral-900">
      <Hero
        eventTitle={menuData.eventTitle}
        persons={menuData.persons}
        grandTotal={stats.grandTotal}
        manager={menuData.manager}
        validUntil={menuData.validUntil}
      />

      {/* Menu sections */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-4">
        {/* Banquet categories */}
        {menuData.banquet.map((category) => {
          const catTotal = category.items.reduce(
            (sum, item) => sum + item.pricePerUnit * item.quantity,
            0
          )
          return (
            <MenuSection key={category.id} title={category.title} categoryTotal={catTotal}>
              {category.items.map((item) => (
                <MenuItem key={item.id} item={item} />
              ))}
            </MenuSection>
          )
        })}

        {/* Welcome zone */}
        <WelcomeSection items={menuData.welcome} />

        {/* Services */}
        <ServicesTable services={menuData.services} persons={menuData.persons} />
      </div>

      {/* Cost Breakdown */}
      <StatsSummary stats={stats} managerPhone={menuData.manager.phone} />

      {/* Footer */}
      <Footer managerPhone={menuData.manager.phone} />
    </div>
  )
}
