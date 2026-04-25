'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { createDish, updateDish } from '@/lib/actions'
import ImageUpload from './ImageUpload'
import Modal from './ui/Modal'
import type { DishRow } from '@/types/admin'
import { INPUT_BASE } from '@/lib/ui-classes'

type DishDraft = Partial<DishRow> & { categoryId: string }

interface DishFormProps {
  dish?: DishDraft
  categories: { id: string; name: string }[]
  onClose: () => void
}

export default function DishForm({ dish, categories, onClose }: DishFormProps) {
  const [form, setForm] = useState({
    name: dish?.name || '',
    description: dish?.description || '',
    weight: dish?.weight || 0,
    weightUnit: dish?.weightUnit || 'г',
    defaultPrice: dish?.defaultPrice || 0,
    image: dish?.image || '',
    categoryId: dish?.categoryId || categories[0]?.id || '',
  })
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      if (dish?.id) {
        await updateDish(dish.id, form)
        toast.success('Блюдо обновлено')
      } else {
        await createDish(form)
        toast.success('Блюдо добавлено')
      }
      onClose()
    } catch {
      toast.error('Ошибка сохранения')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal
      open
      onClose={onClose}
      panelClassName="relative z-10 w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
    >
      <h3 className="text-lg font-semibold text-neutral-900 mb-5">
        {dish?.id ? 'Редактировать блюдо' : 'Новое блюдо'}
      </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700">Название</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={INPUT_BASE}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700">Описание</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={2}
              className={INPUT_BASE}
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-neutral-700">Вес</label>
              <input
                type="number"
                required
                min={0}
                step="any"
                value={form.weight}
                onChange={(e) => setForm({ ...form, weight: parseFloat(e.target.value) || 0 })}
                className={INPUT_BASE}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700">Единица</label>
              <select
                value={form.weightUnit}
                onChange={(e) => setForm({ ...form, weightUnit: e.target.value })}
                className={INPUT_BASE}
              >
                <option value="г">г</option>
                <option value="мл">мл</option>
                <option value="шт">шт</option>
                <option value="кг">кг</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700">Цена</label>
              <input
                type="number"
                required
                min={0}
                step="any"
                value={form.defaultPrice}
                onChange={(e) => setForm({ ...form, defaultPrice: parseFloat(e.target.value) || 0 })}
                className={INPUT_BASE}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700">Категория</label>
            <select
              required
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
              className={INPUT_BASE}
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Фото</label>
            <ImageUpload value={form.image} onChange={(url) => setForm({ ...form, image: url })} />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-royal-500 px-4 py-2 text-sm font-semibold text-white hover:bg-royal-600 disabled:opacity-60"
            >
              {saving ? 'Сохранение...' : 'Сохранить'}
            </button>
          </div>
        </form>
    </Modal>
  )
}
