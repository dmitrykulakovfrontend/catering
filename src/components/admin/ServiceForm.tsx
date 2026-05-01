'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { createServiceTemplate, updateServiceTemplate } from '@/lib/actions'
import { serviceTemplateSchema } from '@/lib/validations'
import type { ServiceTemplateRow } from '@/types/admin'
import { INPUT_BASE, INPUT_BASE_ERROR } from '@/lib/ui-classes'
import Modal from './ui/Modal'

interface ServiceFormProps {
  service?: ServiceTemplateRow
  onClose: () => void
}

export default function ServiceForm({ service, onClose }: ServiceFormProps) {
  const [form, setForm] = useState({
    name: service?.name || '',
    defaultPrice: service?.defaultPrice || 0,
    isPerPerson: service?.isPerPerson || false,
    order: service?.order || 0,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)

  function patch<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }))
    setErrors((prev) => {
      if (!(key in prev)) return prev
      const next = { ...prev }
      delete next[key as string]
      return next
    })
  }

  const cls = (key: string) => (errors[key] ? INPUT_BASE_ERROR : INPUT_BASE)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const result = serviceTemplateSchema.safeParse(form)
    if (!result.success) {
      const next: Record<string, string> = {}
      for (const issue of result.error.issues) {
        const key = issue.path.join('.')
        if (!(key in next)) next[key] = issue.message
      }
      setErrors(next)
      toast.error(result.error.issues[0].message)
      return
    }
    setErrors({})
    setSaving(true)
    try {
      if (service?.id) {
        await updateServiceTemplate(service.id, result.data)
        toast.success('Услуга обновлена')
      } else {
        await createServiceTemplate(result.data)
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
    <Modal open onClose={onClose}>
      <h3 className="text-lg font-semibold text-neutral-900 mb-5">
        {service?.id ? 'Редактировать услугу' : 'Новая услуга'}
      </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700">Название</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => patch('name', e.target.value)}
              className={cls('name')}
            />
            {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700">Цена по умолчанию</label>
            <input
              type="number"
              min={0}
              step="any"
              value={form.defaultPrice}
              onChange={(e) => patch('defaultPrice', parseFloat(e.target.value) || 0)}
              className={cls('defaultPrice')}
            />
            {errors.defaultPrice && <p className="mt-1 text-xs text-red-600">{errors.defaultPrice}</p>}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isPerPerson"
              checked={form.isPerPerson}
              onChange={(e) => patch('isPerPerson', e.target.checked)}
              className="h-4 w-4 rounded border-neutral-200 text-royal-500 focus:ring-royal-500"
            />
            <label htmlFor="isPerPerson" className="text-sm text-neutral-700">
              Цена за персону
            </label>
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
