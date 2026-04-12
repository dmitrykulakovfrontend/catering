'use server'

import { prisma } from './prisma'
import { revalidatePath } from 'next/cache'
import { auth } from './auth'
import {
  categorySchema,
  dishSchema,
  serviceTemplateSchema,
  quoteSchema,
  type QuoteFormData,
  type DishFormData,
  type ServiceTemplateFormData,
  type CategoryFormData,
} from './validations'

async function requireSession() {
  const session = await auth()
  if (!session) throw new Error('Unauthorized')
  return session
}

// ─── Categories ─────────────────────────────────────────────

export async function createCategory(data: CategoryFormData) {
  await requireSession()
  const parsed = categorySchema.parse(data)
  const category = await prisma.dishCategory.create({ data: parsed })
  revalidatePath('/admin/catalog')
  return category
}

export async function updateCategory(id: string, data: CategoryFormData) {
  await requireSession()
  const parsed = categorySchema.parse(data)
  const category = await prisma.dishCategory.update({ where: { id }, data: parsed })
  revalidatePath('/admin/catalog')
  return category
}

export async function deleteCategory(id: string) {
  await requireSession()
  await prisma.dish.deleteMany({ where: { categoryId: id } })
  await prisma.dishCategory.delete({ where: { id } })
  revalidatePath('/admin/catalog')
}

export async function reorderCategories(orderedIds: string[]) {
  await requireSession()
  for (let i = 0; i < orderedIds.length; i++) {
    await prisma.dishCategory.update({
      where: { id: orderedIds[i] },
      data: { order: i },
    })
  }
  revalidatePath('/admin/catalog')
}

// ─── Dishes ─────────────────────────────────────────────────

export async function createDish(data: DishFormData) {
  await requireSession()
  const parsed = dishSchema.parse(data)
  const dish = await prisma.dish.create({ data: parsed })
  revalidatePath('/admin/catalog')
  return dish
}

export async function updateDish(id: string, data: DishFormData) {
  await requireSession()
  const parsed = dishSchema.parse(data)
  const dish = await prisma.dish.update({ where: { id }, data: parsed })
  revalidatePath('/admin/catalog')
  return dish
}

export async function deleteDish(id: string) {
  await requireSession()
  await prisma.dish.delete({ where: { id } })
  revalidatePath('/admin/catalog')
}

// ─── Service Templates ──────────────────────────────────────

export async function createServiceTemplate(data: ServiceTemplateFormData) {
  await requireSession()
  const parsed = serviceTemplateSchema.parse(data)
  const template = await prisma.serviceTemplate.create({ data: parsed })
  revalidatePath('/admin/catalog/services')
  return template
}

export async function updateServiceTemplate(id: string, data: ServiceTemplateFormData) {
  await requireSession()
  const parsed = serviceTemplateSchema.parse(data)
  const template = await prisma.serviceTemplate.update({ where: { id }, data: parsed })
  revalidatePath('/admin/catalog/services')
  return template
}

export async function deleteServiceTemplate(id: string) {
  await requireSession()
  await prisma.serviceTemplate.delete({ where: { id } })
  revalidatePath('/admin/catalog/services')
}

// ─── Quotes ─────────────────────────────────────────────────

export async function saveQuote(data: QuoteFormData, id?: string) {
  await requireSession()
  const parsed = quoteSchema.parse(data)

  const quoteData = {
    eventTitle: parsed.eventTitle,
    eventTime: parsed.eventTime,
    persons: parsed.persons,
    clientName: parsed.clientName,
    clientPhone: parsed.clientPhone,
    notes: parsed.notes,
    slug: parsed.slug,
  }

  let quote

  if (id) {
    // Update: delete old sections/services and recreate
    await prisma.quoteSection.deleteMany({ where: { quoteId: id } })
    await prisma.quoteService.deleteMany({ where: { quoteId: id } })

    quote = await prisma.quote.update({
      where: { id },
      data: {
        ...quoteData,
        sections: {
          create: parsed.sections.map((section, sIdx) => ({
            title: section.title,
            type: section.type,
            order: sIdx,
            items: {
              create: section.items.map((item, iIdx) => ({
                dishId: item.dishId,
                name: item.name,
                description: item.description,
                weight: item.weight,
                weightUnit: item.weightUnit,
                quantity: item.quantity,
                pricePerUnit: item.pricePerUnit,
                image: item.image,
                order: iIdx,
              })),
            },
          })),
        },
        services: {
          create: parsed.services.map((svc, idx) => ({
            serviceTemplateId: svc.serviceTemplateId,
            name: svc.name,
            price: svc.price,
            quantity: svc.quantity,
            isPerPerson: svc.isPerPerson,
            order: idx,
          })),
        },
      },
    })
  } else {
    // Create new
    quote = await prisma.quote.create({
      data: {
        ...quoteData,
        sections: {
          create: parsed.sections.map((section, sIdx) => ({
            title: section.title,
            type: section.type,
            order: sIdx,
            items: {
              create: section.items.map((item, iIdx) => ({
                dishId: item.dishId,
                name: item.name,
                description: item.description,
                weight: item.weight,
                weightUnit: item.weightUnit,
                quantity: item.quantity,
                pricePerUnit: item.pricePerUnit,
                image: item.image,
                order: iIdx,
              })),
            },
          })),
        },
        services: {
          create: parsed.services.map((svc, idx) => ({
            serviceTemplateId: svc.serviceTemplateId,
            name: svc.name,
            price: svc.price,
            quantity: svc.quantity,
            isPerPerson: svc.isPerPerson,
            order: idx,
          })),
        },
      },
    })
  }

  revalidatePath(`/quote/${quote.slug}`)
  revalidatePath('/admin')
  return quote
}

export async function deleteQuote(id: string) {
  await requireSession()
  const quote = await prisma.quote.findUnique({ where: { id }, select: { slug: true } })
  await prisma.quote.delete({ where: { id } })
  if (quote) revalidatePath(`/quote/${quote.slug}`)
  revalidatePath('/admin')
}
