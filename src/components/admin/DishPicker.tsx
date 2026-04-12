'use client'

import { useState } from 'react'

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
  dishes: Dish[]
}

interface DishPickerProps {
  categories: Category[]
  onSelect: (dish: Dish) => void
  onClose: () => void
}

export default function DishPicker({ categories, onSelect, onClose }: DishPickerProps) {
  const [search, setSearch] = useState('')

  const filtered = categories
    .map((cat) => ({
      ...cat,
      dishes: cat.dishes.filter((d) =>
        d.name.toLowerCase().includes(search.toLowerCase())
      ),
    }))
    .filter((cat) => cat.dishes.length > 0)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 flex max-h-[80vh] w-full max-w-lg flex-col rounded-xl bg-white shadow-2xl">
        <div className="border-b border-gray-200 px-6 py-4">
          <h3 className="text-lg font-semibold text-gray-900">Выберите блюдо</h3>
          <input
            type="text"
            autoFocus
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск по названию..."
            className="mt-3 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-wine-500 focus:ring-1 focus:ring-wine-500/20 focus:outline-none"
          />
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {filtered.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-400">Ничего не найдено</p>
          ) : (
            <div className="space-y-5">
              {filtered.map((cat) => (
                <div key={cat.id}>
                  <h4 className="mb-2 text-xs font-semibold tracking-wide text-gray-400 uppercase">
                    {cat.name}
                  </h4>
                  <div className="space-y-1">
                    {cat.dishes.map((dish) => (
                      <button
                        key={dish.id}
                        onClick={() => { onSelect(dish); onClose() }}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-gold-50"
                      >
                        {dish.image ? (
                          <img src={dish.image} alt="" className="h-9 w-9 rounded-md object-cover" />
                        ) : (
                          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-gray-100 text-xs text-gray-400">◇</div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{dish.name}</p>
                          <p className="text-xs text-gray-500">
                            {dish.weight} {dish.weightUnit} · {dish.defaultPrice} ₽
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 px-6 py-3">
          <button
            onClick={onClose}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  )
}
