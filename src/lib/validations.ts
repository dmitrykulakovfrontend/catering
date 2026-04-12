import { z } from 'zod'

export const categorySchema = z.object({
  name: z.string().min(1, 'Название обязательно'),
  order: z.number().int().default(0),
})

export const dishSchema = z.object({
  name: z.string().min(1, 'Название обязательно'),
  description: z.string().default(''),
  weight: z.number().positive('Вес должен быть положительным'),
  weightUnit: z.string().default('г'),
  defaultPrice: z.number().nonnegative('Цена не может быть отрицательной'),
  image: z.string().default(''),
  categoryId: z.string().min(1, 'Выберите категорию'),
})

export const serviceTemplateSchema = z.object({
  name: z.string().min(1, 'Название обязательно'),
  defaultPrice: z.number().nonnegative('Цена не может быть отрицательной'),
  isPerPerson: z.boolean().default(false),
  order: z.number().int().default(0),
})

export const quoteItemSchema = z.object({
  dishId: z.string().nullable().default(null),
  name: z.string().min(1),
  description: z.string().default(''),
  weight: z.number(),
  weightUnit: z.string().default('г'),
  quantity: z.number().int().positive(),
  pricePerUnit: z.number().nonnegative(),
  image: z.string().default(''),
  order: z.number().int().default(0),
})

export const quoteSectionSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1),
  type: z.enum(['banquet', 'welcome']).default('banquet'),
  order: z.number().int().default(0),
  items: z.array(quoteItemSchema),
})

export const quoteServiceSchema = z.object({
  serviceTemplateId: z.string().nullable().default(null),
  name: z.string().min(1),
  price: z.number().nonnegative(),
  quantity: z.number().int().positive().default(1),
  isPerPerson: z.boolean().default(false),
  order: z.number().int().default(0),
})

export const quoteSchema = z.object({
  eventTitle: z.string().min(1, 'Название мероприятия обязательно'),
  eventTime: z.string().min(1, 'Укажите время'),
  persons: z.number().int().positive('Количество персон должно быть положительным'),
  clientName: z.string().min(1, 'Имя клиента обязательно'),
  clientPhone: z.string().default(''),
  status: z.enum(['draft', 'sent', 'confirmed', 'archived']).default('draft'),
  notes: z.string().default(''),
  slug: z.string().min(1),
  sections: z.array(quoteSectionSchema),
  services: z.array(quoteServiceSchema),
})

export type QuoteFormData = z.infer<typeof quoteSchema>
export type DishFormData = z.infer<typeof dishSchema>
export type ServiceTemplateFormData = z.infer<typeof serviceTemplateSchema>
export type CategoryFormData = z.infer<typeof categorySchema>
