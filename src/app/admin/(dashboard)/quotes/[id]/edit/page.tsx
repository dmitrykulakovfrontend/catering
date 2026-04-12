import { notFound } from 'next/navigation'
import { getQuoteById, getAllDishesGrouped, getAllServiceTemplates } from '@/lib/queries'
import QuoteEditor from '@/components/admin/QuoteEditor'

export default async function EditQuotePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const [quote, categories, serviceTemplates] = await Promise.all([
    getQuoteById(id),
    getAllDishesGrouped(),
    getAllServiceTemplates(),
  ])

  if (!quote) notFound()

  const initial = {
    eventTitle: quote.eventTitle,
    eventTime: quote.eventTime,
    persons: quote.persons,
    clientName: quote.clientName,
    clientPhone: quote.clientPhone,
    status: quote.status,
    notes: quote.notes,
    slug: quote.slug,
    sections: quote.sections.map((s) => ({
      id: s.id,
      title: s.title,
      type: s.type as 'banquet' | 'welcome',
      order: s.order,
      items: s.items.map((item) => ({
        dishId: item.dishId,
        name: item.name,
        description: item.description,
        weight: item.weight,
        weightUnit: item.weightUnit,
        quantity: item.quantity,
        pricePerUnit: item.pricePerUnit,
        image: item.image,
        order: item.order,
      })),
    })),
    services: quote.services.map((svc) => ({
      serviceTemplateId: svc.serviceTemplateId,
      name: svc.name,
      price: svc.price,
      quantity: svc.quantity,
      isPerPerson: svc.isPerPerson,
      order: svc.order,
    })),
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-2xl font-bold text-gray-900">
          Редактирование банкета
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          {quote.eventTitle} — {quote.clientName}
        </p>
      </div>

      <QuoteEditor
        quoteId={id}
        initial={initial}
        categories={categories}
        serviceTemplates={serviceTemplates}
      />
    </div>
  )
}
