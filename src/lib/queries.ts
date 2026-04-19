import { cache } from 'react'
import { prisma } from './prisma'
import { formatDateRu } from './utils'
import type { MenuData, MenuCategory, MenuItem, ServiceItem, ManagerInfo } from '@/types'

// ─── Site Settings ──────────────────────────────────────────

export async function getSiteSetting(key: string): Promise<string | null> {
  try {
    const setting = await prisma.siteSetting.findUnique({ where: { key } })
    return setting?.value ?? null
  } catch {
    // Table may not exist yet in production — fall back gracefully
    return null
  }
}

export async function getAllSiteSettings(): Promise<{ key: string; value: string }[]> {
  return prisma.siteSetting.findMany({ orderBy: { key: 'asc' } })
}

// ─── Catalog ────────────────────────────────────────────────

export async function getAllCategories() {
  return prisma.dishCategory.findMany({
    orderBy: { order: 'asc' },
  })
}

export async function getAllDishesGrouped() {
  return prisma.dishCategory.findMany({
    include: { dishes: { orderBy: { name: 'asc' } } },
    orderBy: { order: 'asc' },
  })
}

export async function getDishById(id: string) {
  return prisma.dish.findUnique({ where: { id } })
}

// ─── Service Templates ─────────────────────────────────────

export async function getAllServiceTemplates() {
  return prisma.serviceTemplate.findMany({
    orderBy: { order: 'asc' },
  })
}

// ─── Quotes ─────────────────────────────────────────────────

export async function getAllQuotes() {
  return prisma.quote.findMany({
    orderBy: { updatedAt: 'desc' },
    select: {
      id: true,
      slug: true,
      eventTitle: true,
      eventTime: true,
      persons: true,
      managerName: true,
      managerPhone: true,
      createdAt: true,
      updatedAt: true,
    },
  })
}

export async function getQuoteById(id: string) {
  return prisma.quote.findUnique({
    where: { id },
    include: {
      sections: {
        orderBy: { order: 'asc' },
        include: {
          items: { orderBy: { order: 'asc' } },
        },
      },
      services: { orderBy: { order: 'asc' } },
    },
  })
}

export const getQuoteBySlug = cache(async (slug: string) => {
  return prisma.quote.findUnique({
    where: { slug },
    include: {
      sections: {
        orderBy: { order: 'asc' },
        include: {
          items: { orderBy: { order: 'asc' } },
        },
      },
      services: { orderBy: { order: 'asc' } },
    },
  })
})

export async function getAllPublishedSlugs() {
  return prisma.quote.findMany({
    select: { slug: true },
  })
}

export async function getAllPublishedQuotesForSitemap() {
  return prisma.quote.findMany({
    select: { slug: true, updatedAt: true },
    orderBy: { updatedAt: 'desc' },
  })
}

// ─── Transformer: DB → MenuData ─────────────────────────────

type QuoteWithDetails = NonNullable<Awaited<ReturnType<typeof getQuoteBySlug>>>

export function quoteToMenuData(quote: QuoteWithDetails): MenuData {
  const banquetSections = quote.sections
    .filter((s) => s.type === 'banquet')
    .map((section): MenuCategory => ({
      id: section.id,
      title: section.title,
      items: section.items.map((item): MenuItem => ({
        id: item.id,
        name: item.name,
        description: item.description,
        weight: item.weight,
        weightUnit: item.weightUnit,
        quantity: item.quantity,
        pricePerUnit: item.pricePerUnit,
        image: item.image,
      })),
    }))

  const welcomeSection = quote.sections.find((s) => s.type === 'welcome')
  const welcomeItems: MenuItem[] = welcomeSection
    ? welcomeSection.items.map((item): MenuItem => ({
        id: item.id,
        name: item.name,
        description: item.description,
        weight: item.weight,
        weightUnit: item.weightUnit,
        quantity: item.quantity,
        pricePerUnit: item.pricePerUnit,
        image: item.image,
      }))
    : []

  const services: ServiceItem[] = quote.services.map((svc): ServiceItem => ({
    id: svc.id,
    name: svc.name,
    price: svc.price,
    quantity: svc.quantity,
    isPerPerson: svc.isPerPerson,
  }))

  const manager: ManagerInfo = {
    name: quote.managerName,
    phone: quote.managerPhone ?? '',
    createdAt: formatDateRu(quote.createdAt),
  }

  return {
    eventTitle: quote.eventTitle,
    eventTime: quote.eventTime,
    persons: quote.persons,
    manager,
    validUntil: quote.validUntil ? formatDateRu(quote.validUntil) : null,
    banquet: banquetSections,
    welcome: welcomeItems,
    services,
  }
}
