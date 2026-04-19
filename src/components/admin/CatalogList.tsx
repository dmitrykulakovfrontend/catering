'use client'

import Image from 'next/image'
import { useState } from 'react'
import { toast } from 'sonner'
import { deleteCategory, deleteDish, reorderCategories } from '@/lib/actions'
import DishForm from './DishForm'
import DeleteConfirmDialog from './DeleteConfirmDialog'

interface Dish {
  id: string
  name: string
  description: string
  weight: number
  weightUnit: string
  defaultPrice: number
  image: string
  categoryId: string
}

interface Category {
  id: string
  name: string
  order: number
  dishes: Dish[]
}

export default function CatalogList({ categories }: { categories: Category[] }) {
  const [editingDish, setEditingDish] = useState<Dish | null>(null)
  const [addingToCategoryId, setAddingToCategoryId] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'dish' | 'category'; id: string; name: string } | null>(null)

  const catList = categories.map((c) => ({ id: c.id, name: c.name }))

  async function handleDelete() {
    if (!deleteTarget) return
    try {
      if (deleteTarget.type === 'dish') {
        await deleteDish(deleteTarget.id)
        toast.success('Блюдо удалено')
      } else {
        await deleteCategory(deleteTarget.id)
        toast.success('Категория удалена')
      }
    } catch {
      toast.error('Ошибка удаления')
    }
    setDeleteTarget(null)
  }

  async function moveCategory(idx: number, dir: -1 | 1) {
    const newIdx = idx + dir
    if (newIdx < 0 || newIdx >= categories.length) return
    const ids = categories.map((c) => c.id)
    ;[ids[idx], ids[newIdx]] = [ids[newIdx], ids[idx]]
    await reorderCategories(ids)
    toast.success('Порядок обновлён')
  }

  return (
    <>
      <div className="space-y-6">
        {categories.map((cat, catIdx) => (
          <div key={cat.id} className="rounded-xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
            <div className="flex items-center justify-between border-b border-neutral-100 bg-neutral-50 px-6 py-3">
              <h3 className="font-semibold text-neutral-900">{cat.name}</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => moveCategory(catIdx, -1)}
                  disabled={catIdx === 0}
                  className="rounded p-1 text-neutral-400 hover:bg-neutral-200 hover:text-neutral-600 disabled:opacity-30"
                  title="Вверх"
                >
                  ↑
                </button>
                <button
                  onClick={() => moveCategory(catIdx, 1)}
                  disabled={catIdx === categories.length - 1}
                  className="rounded p-1 text-neutral-400 hover:bg-neutral-200 hover:text-neutral-600 disabled:opacity-30"
                  title="Вниз"
                >
                  ↓
                </button>
                <button
                  onClick={() => setAddingToCategoryId(cat.id)}
                  className="rounded-md bg-royal-500 px-3 py-1 text-xs font-medium text-white hover:bg-royal-600"
                >
                  Добавить блюдо
                </button>
                <button
                  onClick={() => setDeleteTarget({ type: 'category', id: cat.id, name: cat.name })}
                  className="rounded-md px-2 py-1 text-xs font-medium text-red-500 hover:bg-red-50"
                >
                  Удалить
                </button>
              </div>
            </div>

            {cat.dishes.length === 0 ? (
              <div className="px-6 py-8 text-center text-sm text-neutral-400">
                Нет блюд в этой категории
              </div>
            ) : (
              <div className="divide-y divide-neutral-50">
                {cat.dishes.map((dish) => (
                  <div
                    key={dish.id}
                    className="flex items-center gap-4 px-6 py-3 hover:bg-royal-50/30 transition-colors"
                  >
                    {dish.image ? (
                      <div className="relative h-10 w-10 flex-shrink-0">
                        <Image
                          src={dish.image}
                          alt={dish.name}
                          fill
                          sizes="40px"
                          className="rounded-lg object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100 text-neutral-400 text-xs">
                        ◇
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-neutral-900 truncate">{dish.name}</p>
                      <p className="text-xs text-neutral-500">
                        {dish.weight} {dish.weightUnit} · {dish.defaultPrice} ₽
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setEditingDish(dish)}
                        className="rounded-md px-2.5 py-1 text-xs font-medium text-neutral-600 hover:bg-neutral-100"
                      >
                        Изменить
                      </button>
                      <button
                        onClick={() => setDeleteTarget({ type: 'dish', id: dish.id, name: dish.name })}
                        className="rounded-md px-2.5 py-1 text-xs font-medium text-red-500 hover:bg-red-50"
                      >
                        Удалить
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {editingDish && (
        <DishForm
          dish={editingDish}
          categories={catList}
          onClose={() => setEditingDish(null)}
        />
      )}

      {addingToCategoryId && (
        <DishForm
          dish={{ name: '', description: '', weight: 0, weightUnit: 'г', defaultPrice: 0, image: '', categoryId: addingToCategoryId }}
          categories={catList}
          onClose={() => setAddingToCategoryId(null)}
        />
      )}

      <DeleteConfirmDialog
        open={!!deleteTarget}
        title={deleteTarget?.type === 'category' ? 'Удалить категорию?' : 'Удалить блюдо?'}
        message={
          deleteTarget?.type === 'category'
            ? `Категория «${deleteTarget?.name}» и все её блюда будут удалены.`
            : `Блюдо «${deleteTarget?.name}» будет удалено из каталога. Существующие банкеты не пострадают.`
        }
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  )
}
