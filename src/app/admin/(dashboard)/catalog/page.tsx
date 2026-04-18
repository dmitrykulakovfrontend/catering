import { getAllDishesGrouped } from '@/lib/queries'
import CatalogList from '@/components/admin/CatalogList'
import CategoryManager from '@/components/admin/CategoryManager'

export default async function CatalogPage() {
  const categories = await getAllDishesGrouped()

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-sans text-2xl font-bold text-neutral-900">
            Каталог блюд
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Библиотека блюд для составления банкетов
          </p>
        </div>
        <CategoryManager />
      </div>

      <CatalogList categories={categories} />
    </div>
  )
}
