import { getAllServiceTemplates } from '@/lib/queries'
import ServicesList from '@/components/admin/ServicesList'
import AddServiceButton from '@/components/admin/AddServiceButton'

export default async function ServicesPage() {
  const services = await getAllServiceTemplates()

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-sans text-2xl font-bold text-neutral-900">
            Шаблоны услуг
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Услуги, которые можно добавлять к банкетам
          </p>
        </div>
        <AddServiceButton />
      </div>

      <ServicesList services={services} />
    </div>
  )
}
