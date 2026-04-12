import { getAllDishesGrouped, getAllServiceTemplates } from '@/lib/queries'
import QuoteEditor from '@/components/admin/QuoteEditor'

export default async function NewQuotePage() {
  const [categories, serviceTemplates] = await Promise.all([
    getAllDishesGrouped(),
    getAllServiceTemplates(),
  ])

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-2xl font-bold text-gray-900">
          Новый банкет
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Создайте новое банкетное предложение
        </p>
      </div>

      <QuoteEditor categories={categories} serviceTemplates={serviceTemplates} />
    </div>
  )
}
