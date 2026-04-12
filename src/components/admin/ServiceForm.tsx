'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { createServiceTemplate, updateServiceTemplate } from '@/lib/actions'

interface ServiceData {
  id?: string
  name: string
  defaultPrice: number
  isPerPerson: boolean
  order: number
}

interface ServiceFormProps {
  service?: ServiceData
  onClose: () => void
}

export default function ServiceForm({ service, onClose }: ServiceFormProps) {
  const [form, setForm] = useState({
    name: service?.name || '',
    defaultPrice: service?.defaultPrice || 0,
    isPerPerson: service?.isPerPerson || false,
    order: service?.order || 0,
  })
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      if (service?.id) {
        await updateServiceTemplate(service.id, form)
        toast.success('Услуга обновлена')
      } else {
        await createServiceTemplate(form)
        toast.success('Услуга добавлена')
      }
      onClose()
    } catch {
      toast.error('Ошибка сохранения')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
        <h3 className="text-lg font-semibold text-gray-900 mb-5">
          {service?.id ? 'Редактировать услугу' : 'Новая услуга'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Название</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-wine-500 focus:ring-1 focus:ring-wine-500/20 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Цена по умолчанию</label>
            <input
              type="number"
              required
              min={0}
              step="any"
              value={form.defaultPrice}
              onChange={(e) => setForm({ ...form, defaultPrice: parseFloat(e.target.value) || 0 })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-wine-500 focus:ring-1 focus:ring-wine-500/20 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isPerPerson"
              checked={form.isPerPerson}
              onChange={(e) => setForm({ ...form, isPerPerson: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300 text-wine-700 focus:ring-wine-500"
            />
            <label htmlFor="isPerPerson" className="text-sm text-gray-700">
              Цена за персону
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-wine-700 px-4 py-2 text-sm font-semibold text-white hover:bg-wine-600 disabled:opacity-60"
            >
              {saving ? 'Сохранение...' : 'Сохранить'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
