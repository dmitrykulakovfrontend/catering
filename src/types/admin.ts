import type { Prisma } from '@prisma/client'
import type { QuoteFormData } from '@/lib/validations'
import type { getAllQuotes } from '@/lib/queries'

// ─── DB row shapes (derived from Prisma) ──────────────────

export type DishRow = Prisma.DishGetPayload<Record<string, never>>
export type DishCategoryRow = Prisma.DishCategoryGetPayload<Record<string, never>>
export type DishCategoryWithDishes = Prisma.DishCategoryGetPayload<{ include: { dishes: true } }>
export type ServiceTemplateRow = Prisma.ServiceTemplateGetPayload<Record<string, never>>

// ─── List/query result shapes ─────────────────────────────

export type QuoteSummary = Awaited<ReturnType<typeof getAllQuotes>>[number]

// ─── Editor draft shapes (from Zod schema in validations.ts) ──

export type QuoteDraft = QuoteFormData
export type QuoteSectionDraft = QuoteFormData['sections'][number]
export type QuoteItemDraft = QuoteFormData['sections'][number]['items'][number]
export type QuoteServiceDraft = QuoteFormData['services'][number]
